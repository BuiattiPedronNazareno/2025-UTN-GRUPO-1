import type React from "react"
import { useEffect, useState, useCallback, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Container, Card, CardContent, CardMedia, Typography, Box, IconButton } from "@mui/material"
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import NavBar from "../components/NavBar"
import HelpButton from "../components/HelpButton"
import "../styles/views/InicioInfante.scss"
import { obtenerRutinaPorInfante, obtenerRutinaPorId } from "../services/rutinaService"
import type { Rutina } from "../services/rutinaService"
import "../styles/components/RoutineCard.scss";
import "../styles/components/MainActionButton.scss";
import * as signalR from "@microsoft/signalr";
import { verificarRecordatorio } from "../services/recordatorioService"
import { obtenerTutorialStatusInfante, completarTutorialInfante } from "../services/infanteService"
import { useAppContext } from "../context/AppContext";
import TutorialWizard from "../components/TutorialWizard";
import ReminderNotification from "../components/ReminderNotification";
import defaultCard from "../assets/default-card.png";
import type { RecordatorioNotificacion } from "../services/recordatorioService";

const InicioInfante: React.FC = () => {
  const navigate = useNavigate()
  const [routines, setRoutines] = useState<Rutina[]>([])
  const [hasReminderMap, setHasReminderMap] = useState<Record<number, boolean>>({});
  const { infanteActivo } = useAppContext();
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialMode, setTutorialMode] = useState<"adulto" | "infante">("infante");
  const [autoStartTutorial, setAutoStartTutorial] = useState(false);
  const [firstMandatoryModule] = useState<number>(1)

  const [queuedReminders, setQueuedReminders] = useState<Array<{ id: number, routineId: number, routineName: string, description: string, visible: boolean, color?: string, time?: string }>>([]);

  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const hasLoadedPending = useRef<boolean>(false);

  // helpers para persistir recordatorios manejados entre visitas usando cookies
  const HANDLED_KEY = 'handled_reminders'
  const PENDING_KEY = 'pending_reminders'

  const getCookie = (name: string): string | null => {
    const cookies = document.cookie ? document.cookie.split('; ') : []
    const found = cookies.find(c => c.startsWith(name + '='))
    return found ? decodeURIComponent(found.split('=')[1]) : null
  }

  const setCookie = (name: string, value: string, days = 365) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString()
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`
  }

  const getHandledReminders = useCallback((): number[] => {
    try {
      const raw = getCookie(HANDLED_KEY)
      if (!raw) return []
      return JSON.parse(raw) as number[]
    } catch {
      return []
    }
  }, [])

  const setHandledReminders = useCallback((ids: number[]) => {
    try {
      setCookie(HANDLED_KEY, JSON.stringify(ids), 365)
    } catch {
      // ignore
    }
  }, [])

  // Cargar notificaciones pendientes al inicio (solo una vez)
  useEffect(() => {
    if (!infanteActivo || hasLoadedPending.current) return;

    try {
      const raw = getCookie(PENDING_KEY)
      if (raw) {
        const pending = JSON.parse(raw) as Array<{ id: number, routineId: number, routineName: string, description: string, visible: boolean, color?: string, time?: string }>
        if (pending.length > 0) {
          console.log("📋 Recuperando notificaciones pendientes:", pending)
          setQueuedReminders(pending)
          hasLoadedPending.current = true
        }
      }
    } catch (err) {
      console.error("Error cargando notificaciones pendientes:", err)
    }
  }, [infanteActivo])

  // Guardar notificaciones pendientes cuando cambien
  useEffect(() => {
    if (!hasLoadedPending.current) return; // No guardar hasta que se hayan cargado las pendientes

    try {
      if (queuedReminders.length > 0) {
        setCookie(PENDING_KEY, JSON.stringify(queuedReminders), 365)
        console.log("💾 Guardando notificaciones pendientes:", queuedReminders.length)
      } else {
        // Limpiar cookie si no hay recordatorios
        document.cookie = `${PENDING_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
        console.log("🗑️ Limpiando notificaciones pendientes")
      }
    } catch (err) {
      console.error("Error guardando notificaciones:", err)
    }
  }, [queuedReminders])

  // Configurar SignalR - SOLO UNA VEZ
  useEffect(() => {
    if (!infanteActivo) return;

    // Si ya hay una conexión activa, no crear otra
    if (connectionRef.current && connectionRef.current.state === signalR.HubConnectionState.Connected) {
      console.log("⚠️ Ya existe una conexión activa");
      return;
    }

    const connectToHub = async () => {
      try {
        const connection = new signalR.HubConnectionBuilder()
          .withUrl(`http://localhost:5012/remindersHub?userId=${infanteActivo.id}`)
          .withAutomaticReconnect()
          .configureLogging(signalR.LogLevel.Information)
          .build();

        // Escuchar mensajes desde el servidor
        connection.on("ReceiveNotification", (message: RecordatorioNotificacion | string) => {
          console.log("📩 Notificación recibida desde SignalR:", message);

          // Ignorar mensajes de texto simple (como mensajes de bienvenida)
          if (typeof message === 'string') {
            console.log("ℹ️ Mensaje de texto ignorado:", message);
            return;
          }

          // Verificar que tenga la estructura correcta de RecordatorioNotificacion
          if (!message.id || !message.descripcion) {
            console.log("⚠️ Mensaje sin estructura válida ignorado:", message);
            return;
          }

          // Verificar que el recordatorio no haya sido manejado antes
          const handled = getHandledReminders();
          if (!handled.includes(message.id)) {
            // Agregar el nuevo recordatorio a la cola
            const handleReminder = async () => {
              // Verificar duplicados antes de hacer la petición
              setQueuedReminders(prev => {
                const exists = prev.some(r => r.id === message.id);
                if (exists) {
                  console.log("⚠️ Recordatorio duplicado ignorado:", message.id);
                  return prev;
                }
                return prev; // No hacemos nada aún, esperamos la respuesta de la API
              });

              try {
                console.log("✅ Obteniendo rutina para recordatorio:", message.id);
                const rutinaAsociada = await obtenerRutinaPorId(message.rutinaId);

                const newReminder = {
                  id: message.id,
                  description: message.descripcion,
                  visible: false,
                  color: message.color || '#ff0000',
                  time: message.hora,
                  routineName: rutinaAsociada.nombre,
                  routineId: message.rutinaId
                };

                setQueuedReminders(prev => {
                  // Verificar duplicados nuevamente antes de agregar
                  const exists = prev.some(r => r.id === message.id);
                  if (exists) {
                    console.log("⚠️ Recordatorio duplicado ignorado en segundo check:", message.id);
                    return prev;
                  }
                  console.log("✅ Recordatorio agregado a la cola:", message.id);
                  hasLoadedPending.current = true; // Marcar como cargado después de la primera notificación
                  return [...prev, newReminder];
                });
              } catch (err) {
                console.error("Error obteniendo rutina:", err);
              }
            };

            handleReminder();
          } else {
            console.log("ℹ️ Recordatorio ya fue manejado anteriormente:", message.id);
          }
        });

        // Iniciar la conexión
        await connection.start();
        console.log("✅ Conectado a SignalR como usuario:", infanteActivo.id);
        connectionRef.current = connection;
      } catch (err) {
        console.error("❌ Error al conectar a SignalR:", err);
        connectionRef.current = null;
      }
    };

    connectToHub();

    // Cleanup: desconectar al desmontar el componente
    return () => {
      if (connectionRef.current) {
        console.log("🔌 Desconectando SignalR...");
        connectionRef.current.stop();
        connectionRef.current = null;
      }
    };
  }, [infanteActivo, getHandledReminders]);

  useEffect(() => {
    const fetchRutinas = async () => {
      if (!infanteActivo) return;
      try {
        const data = await obtenerRutinaPorInfante(infanteActivo.id)
        setRoutines(data)
        // verificar recordatorios para cada rutina (pero ignorar rutinas ocultas)
        const map: Record<number, boolean> = {}
        await Promise.all(
          data.map(async (r) => {
            try {
              // Si la rutina está Oculta, no la consideramos para recordatorios
              if ((r.estado || "").trim().toLowerCase() === "oculta") {
                map[r.id] = false
                return
              }

              const has = await verificarRecordatorio(r.id)
              map[r.id] = has
            } catch (err) {
              console.error('Error verificando recordatorio para rutina', r.id, err)
              map[r.id] = false
            }
          })
        )
        setHasReminderMap(map)
      } catch (error) {
        console.error("Error al obtener rutinas:", error)
      }
    }

    fetchRutinas()
  }, [infanteActivo])

  // cuando la cola cambia y hay recordatorios nuevos, mostrarlos automáticamente
  useEffect(() => {
    if (!queuedReminders || queuedReminders.length === 0) return;

    // Si hay recordatorios que no están visibles, mostrarlos después de 1 segundo
    const hasInvisible = queuedReminders.some(r => !r.visible);
    if (hasInvisible) {
      const timer = setTimeout(() => {
        setQueuedReminders(prev => prev.map(r => ({ ...r, visible: true })))
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [queuedReminders])

  useEffect(() => {
    const checkTutorial = async () => {
      if (!infanteActivo) return;

      try {
        const status = await obtenerTutorialStatusInfante(infanteActivo.id);
        if (status.showInfantTutorial) {
          setTutorialMode("infante");
          setShowTutorial(true);
          setAutoStartTutorial(true);
          // El primer módulo obligatorio ya está definido por defecto
          // Se marca como completado en el backend
          await completarTutorialInfante(infanteActivo.id);
        }
      } catch (error) {
        console.error("Error verificando tutorial infante:", error);
      }
    };

    checkTutorial();
  }, [infanteActivo]);


  const handleRoutineClick = (routineId: number) => {
    console.log(`Iniciando rutina: ${routineId}`)
    navigate(`/rutina/${routineId}/pasos`);
  }

  const handleHelpClick = () => {
    console.log("Solicitando ayuda...")
  }

  const handleSettingsClick = () => {
    navigate("/ajustes")
  }

  return (
    <Box className="inicio-infante">
      <NavBar title="Mis Rutinas" showSettingsButton={true} onSettingsClick={handleSettingsClick} alignLevel="left" />

      <Container component="main" className="main-content" maxWidth="md">
        {/* Overlay de notificación de recordatorio: aparece sobre la página y puede cerrarse. Se muestran apiladas. */}
        {queuedReminders.length > 0 && (
          <Box className="reminder-overlay-container">
            {queuedReminders.map((rem) => (
              rem.visible && (
                <Box key={rem.id} className="stack-item">
                  <ReminderNotification
                    routineName={rem.routineName}
                    className="overlay"
                    description={rem.description}
                    time={rem.time}
                    color={rem.color}
                    onOpen={() => {
                      // marcar como manejada y persistir
                      const handled = getHandledReminders()
                      const updated = Array.from(new Set([...handled, rem.id]))
                      setHandledReminders(updated)
                      // remover de la lista mostrada y navegar
                      setQueuedReminders(prev => prev.filter(p => p.id !== rem.id))
                      navigate(`/rutina/${rem.routineId}/pasos`)
                    }}
                    onClose={() => {
                      // marcar como manejada y remover de la lista
                      const handled = getHandledReminders()
                      const updated = Array.from(new Set([...handled, rem.id]))
                      setHandledReminders(updated)
                      setQueuedReminders(prev => prev.filter(p => p.id !== rem.id))
                    }}
                  />
                </Box>
              )
            ))}
          </Box>
        )}
        <Box
          className="routines-container"
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            justifyContent: 'center',
            mt: 0
          }}
        >
          {routines
            .filter((routine) => (routine.estado || "").toLowerCase() !== "oculta")
            .map((routine) => (
              <Box
                key={routine.id}
                sx={{
                  width: { xs: '100%', sm: '48%' },
                  maxWidth: '400px'
                }}
              >
                <Card
                  className="routine-card"
                  onClick={() => handleRoutineClick(routine.id)}
                  sx={{
                    backgroundColor: "#3E8596",
                    cursor: "pointer",
                    "&:hover": { transform: "scale(1.02)" },
                    height: '100%',
                    position: 'relative', // para que el icono absolute quede relativo a la card
                    overflow: 'hidden'
                  }}
                >
                  {/* icono de recordatorio en la esquina superior derecha si existe */}
                  <CardMedia
                    component="img"
                    height="200"
                    image={routine.imagen ? routine.imagen : defaultCard}
                    alt={routine.nombre}
                    className="routine-image"
                  />
                  <CardContent>
                    <Typography variant="h6" component="h3" className="routine-title">
                      {routine.nombre}
                    </Typography>
                  </CardContent>
                  {hasReminderMap[routine.id] && (
                    <IconButton
                      aria-label="recordatorio activo"
                      size="small"
                      sx={{
                        position: 'absolute',
                        right: 20,
                        bottom: 20,
                        color: '#000000ff',
                        zIndex: 2
                      }}
                      onClick={(e) => { e.stopPropagation(); navigate(`/recordatorio-infante/${routine.id}`); }}
                    >
                      <NotificationsActiveIcon />
                    </IconButton>
                  )}
                </Card>
              </Box>
            ))}
        </Box>


      </Container>
      <Box className="help-section my-4" sx={{ textAlign: "center", mt: 4 }}>
        <HelpButton onClick={handleHelpClick} />
      </Box>
      <TutorialWizard
        open={showTutorial}
        onClose={() => setShowTutorial(false)}
        mode={tutorialMode}
        autoStart={autoStartTutorial}
        initialModule={firstMandatoryModule}
        navigate={navigate}
      />
    </Box>
  )
}

export default InicioInfante
