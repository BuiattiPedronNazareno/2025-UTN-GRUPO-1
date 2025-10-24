"use client"

import type React from "react"
import { useEffect, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Container, Card, CardContent, CardMedia, Typography, Box, IconButton } from "@mui/material"
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import NavBar from "../components/NavBar"
import HelpButton from "../components/HelpButton"
import "../styles/views/InicioInfante.scss"
import { obtenerRutinaPorInfante } from "../services/rutinaService"
import type { Rutina } from "../services/rutinaService"

import "../styles/components/RoutineCard.scss";
import "../styles/components/MainActionButton.scss";

import { verificarRecordatorio } from "../services/recordatorioService"

import { obtenerTutorialStatusInfante, completarTutorialInfante } from "../services/infanteService"
import { useAppContext } from "../context/AppContext";
import TutorialWizard from "../components/TutorialWizard";
import ReminderNotification from "../components/ReminderNotification";

const InicioInfante: React.FC = () => {
  const navigate = useNavigate()
  const [routines, setRoutines] = useState<Rutina[]>([])
  const [hasReminderMap, setHasReminderMap] = useState<Record<number, boolean>>({});
  const { infanteActivo } = useAppContext();
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialMode, setTutorialMode] = useState<"adulto" | "infante">("infante");
  const [autoStartTutorial, setAutoStartTutorial] = useState(false);
  const [firstMandatoryModule] = useState<number>(1)

  const [showReminderOverlay, setShowReminderOverlay] = useState<boolean>(true);
  const [queuedReminders, setQueuedReminders] = useState<Array<{ id: number, title: string, description: string, visible: boolean, color?: string, time?: string }>>([]);

  // helpers para persistir recordatorios manejados entre visitas usando cookies
  const HANDLED_KEY = 'handled_reminders'

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
        // construir cola de recordatorios basados en el map (solo si existen) y solo para rutinas visibles
        // Mockear color y hora para cada recordatorio
        const allReminders = data
          .filter(d => map[d.id] && ((d.estado || "").trim().toLowerCase() !== "oculta"))
          .map(d => ({
            id: d.id,
            title: `Recordatorio: ${d.nombre}`,
            description: `Es el momento de realizar ${d.nombre}. Toca para ver los pasos.`,
            visible: false,
            color: '#ff0000', // color mock (puede cambiarse por valor del servicio)
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }))

        // filtrar recordatorios ya manejados (persistidos en localStorage)
        const handled = getHandledReminders()
        const reminders = allReminders.filter(r => !handled.includes(r.id))
        setQueuedReminders(reminders)
      } catch (error) {
        console.error("Error al obtener rutinas:", error)
      }
    }

    fetchRutinas()
  }, [infanteActivo, getHandledReminders])


  // cuando la cola cambia, esperar 5s y luego mostrar todas las notificaciones (apiladas)
  useEffect(() => {
    if (!queuedReminders || queuedReminders.length === 0) return;

    const timer = setTimeout(() => {
      setQueuedReminders(prev => prev.map(r => ({ ...r, visible: true })))
    }, 5000)

    return () => clearTimeout(timer)
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
        {showReminderOverlay && queuedReminders.length > 0 && (
          <Box className="reminder-overlay-container">
            {[...queuedReminders].slice().reverse().map((rem) => (
              rem.visible && (
                <Box key={rem.id} className="stack-item">
                  <ReminderNotification
                    className="overlay"
                    title={rem.title}
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
                      setShowReminderOverlay(false)
                      navigate(`/rutina/${rem.id}/pasos`)
                    }}
                    onClose={() => setQueuedReminders(prev => prev.filter(p => p.id !== rem.id))}
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
                  {hasReminderMap[routine.id] && (
                    <IconButton
                      aria-label="recordatorio activo"
                      size="small"
                      sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: '#FFD54F',
                        zIndex: 2
                      }}
                      onClick={(e) => { e.stopPropagation(); navigate(`/recordatorio-infante/${routine.id}`); }}
                    >
                      <NotificationsActiveIcon />
                    </IconButton>
                  )}
                  <CardMedia
                    component="img"
                    height="200"
                    image={routine.imagen || "/placeholder.svg"}
                    alt={routine.nombre}
                    className="routine-image"
                  />
                  <CardContent>
                    <Typography variant="h6" component="h3" className="routine-title">
                      {routine.nombre}
                    </Typography>
                  </CardContent>
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