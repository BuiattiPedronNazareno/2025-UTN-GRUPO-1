"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Settings,
  Visibility,
  VisibilityOff,
  Edit,
  NotificationsActive,
} from "@mui/icons-material";
import "../styles/views/InicioAdulto.scss";
import { obtenerRutinaPorInfante, cambiarVisibilidadRutina } from "../services/rutinaService";
import type { Rutina } from "../services/rutinaService";
import { obtenerInfantesPorUsuario } from "../services/infanteService";
import { verificarRecordatorio } from "../services/recordatorioService";
import { obtenerTutorialStatus, completarTutorial } from "../services/UsuarioService";
import { useAppContext } from "../context/AppContext";
import TutorialWizard from "../components/TutorialWizard";
import GenerarRutinaIAModal from "../components/GenerarRutinaIAModal";
import type { RutinaIAResponse } from "../services/rutinaIAService";
import defaultCard from "../assets/default-card.png";

const InicioAdulto: React.FC = () => {
  const navigate = useNavigate();
  const [routines, setRoutines] = useState<Rutina[]>([]);
  const [routinesWithReminders, setRoutinesWithReminders] = useState<
    Set<number>
  >(new Set());
  const { usuarioActivo } = useAppContext();
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialMode, setTutorialMode] = useState<"adulto" | "infante">("adulto");
  const [autoStartTutorial, setAutoStartTutorial] = useState(false);
  const [firstMandatoryModule, setFirstMandatoryModule] = useState<number>(1)
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openGenerarRutinaIA, setOpenGenerarRutinaIA] = useState(false);



  useEffect(() => {
    const fetchRutinas = async () => {
      try {
        if (!usuarioActivo) return;

        console.log("Buscando infantes del usuario:", usuarioActivo.id);
        const infantes = await obtenerInfantesPorUsuario(usuarioActivo.id);

        if (!Array.isArray(infantes) || infantes.length === 0) {
          console.warn("El usuario no tiene infantes registrados.");
          setRoutines([]);
          return;
        }

        // ✅ Obtener rutinas de todos los infantes
        const data = await Promise.all(
          infantes.map(async (infante) => {
            try {
              const rutinas = await obtenerRutinaPorInfante(infante.id);
              console.log(`Rutinas del infante ${infante.nombre}:`, rutinas);
              return Array.isArray(rutinas) ? rutinas : [];
            } catch (error) {
              console.error(`Error al obtener rutinas del infante ${infante.id}:`, error);
              return [];
            }
          })
        );

        // ✅ Aplanar el array de arrays (Rutina[][] → Rutina[])
        const todasLasRutinas = data.flat();
        setRoutines(todasLasRutinas);

        // ✅ Verificar recordatorios solo sobre rutinas válidas
        const results = await Promise.all(
          todasLasRutinas.map(async (routine) => {
            try {
              const tiene = await verificarRecordatorio(routine.id);
              return tiene ? routine.id : null;
            } catch {
              return null;
            }
          })
        );

        // guardamos solo los ids que tienen recordatorio
        setRoutinesWithReminders(new Set(results.filter(Boolean) as number[]));
      } catch (error) {
        console.error("Error al obtener rutinas:", error);
      }
    };

    fetchRutinas();
  }, []);

  useEffect(() => {
    const checkTutorial = async () => {
      if (!usuarioActivo) return;

      try {
        const status = await obtenerTutorialStatus(usuarioActivo.id);
        if (status.showAdultTutorial) {
          setTutorialMode("adulto");
          setShowTutorial(true);
          setAutoStartTutorial(true);

          // El primer módulo obligatorio ya está definido por defecto
          // Se marca como completado en el backend
          await completarTutorial(usuarioActivo.id);
        }
      } catch (error) {
        console.error("Error verificando tutorial adulto:", error);
      }
    };

    checkTutorial();
  }, [usuarioActivo]);

  const handleGenerarRutinaConIA = (rutina: RutinaIAResponse) => {
    setRoutines((prev) => [...prev, rutina as unknown as Rutina]);
    
    setSnackbarMessage(`¡Rutina "${rutina.nombre}" creada exitosamente.`);
    setSnackbarOpen(true);
  };

  const handleRoutineEdit = (routineId: number) => {
    navigate(`/editar-rutina/${routineId}`);
  };

  const handleCreateRoutine = () => {
    navigate("/crear-rutina");
  };

  const handleAddReminder = () => {
    console.log("Agregar recordatorio");
    navigate("/recordatorio-adulto");
  };

  const handleSettingsClick = () => {
    navigate("/ajustes-adulto");
  };

  const handleCambiarEstadoRutina = async (routineId: number, estadoActual: string) => {
    try {
      const isCurrentlyActive = (estadoActual || "").trim().toLowerCase() === "activa";

      // Si se intenta ocultar y solo queda una rutina activa, bloquear la acción
      if (isCurrentlyActive) {
        const activeCount = routines.reduce((count, r) => {
          return count + ((r.estado || "").trim().toLowerCase() === "activa" ? 1 : 0);
        }, 0);

        if (activeCount <= 1) {
          // Mostrar snackbar estético en lugar de alert
          setSnackbarMessage("No puedes ocultar la última rutina activa. Debe haber al menos una rutina en estado 'Activa'.");
          setSnackbarOpen(true);
          return;
        }
      }

      const estadoNuevo = isCurrentlyActive ? "Oculta" : "Activa";

      const rutinaActualizada = await cambiarVisibilidadRutina(routineId, {
        estado: estadoNuevo,
      });

      setRoutines((prev) =>
        prev.map((r) => (r.id === routineId ? { ...r, estado: rutinaActualizada.estado } : r))
      );
    } catch (error) {
      console.error("Error al actualizar rutina:", error);
    }
  };

  return (
    <Box className="inicio-adulto">
      <Box className="header">
        <Box className="header-content">
          <Typography variant="h4" component="h1" className="header-title">
            Mis Rutinas
          </Typography>
          <IconButton
            className="settings-button"
            onClick={handleSettingsClick}
            sx={{ color: "#2C3E50" }}
          >
            <Settings fontSize="large" />
          </IconButton>
        </Box>

        <Box className="stats">
          <Typography variant="body2" className="stats-text">
            RUTINAS ACTIVAS: 5/5
          </Typography>
          <Typography variant="body2" className="stats-text">
            TOTAL RUTINAS CREADAS: 10
          </Typography>
        </Box>
      </Box>

      <Container component="main" className="main-content" maxWidth="md">

        <Box
          className="routines-container"
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            justifyContent: "center",
            mt: 4,
          }}
        >
          {routines.map((routine) => (

            <Box
              key={routine.id}
              sx={{
                width: { xs: "100%", sm: "48%" },
                maxWidth: "400px",
              }}
            >
              <Card
                className={"routine-card " + ((routine.estado || "").toLowerCase() === "oculta" ? "routine-card--hidden" : "")}
                sx={{
                  backgroundColor: "#4A90A4",
                  cursor: "pointer",
                  "&:hover": { transform: "scale(1.02)" },
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  paddingBottom: "0rem",
                }}
              >
                <CardMedia
                  className="routine-image"
                  component="img"
                  height={200}
                  image={routine.imagen ? routine.imagen : defaultCard}
                  alt={routine.nombre}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent className="routine-content" sx={{ flexGrow: 1, width: "100%", padding: 0, paddingBottom: 0, }}>
                  <Box
                    className="routine-header"
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="h3"
                      className="routine-title"
                      sx={{ 
                        textAlign: "left",
                        mb: 1 
                      }}
                    >
                      {routine.nombre}
                    </Typography>


                    <Box 
                      className="routine-actions"
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        width: "100%",
                        gap: 1
                      }}
                    >
                      {/* 👇 Solo aparece si el backend confirmó recordatorio */}
                      {routinesWithReminders.has(routine.id) && (
                        <IconButton
                          className="action-button notification-button"
                          onClick={() =>
                            navigate(`/lista-recordatorio-adulto/${routine.id}`)
                          }
                        >
                          <NotificationsActive />
                        </IconButton>
                      )}
                     <IconButton

                        onClick={() =>
                          handleCambiarEstadoRutina(routine.id, routine.estado ?? "Activa")
                        }
                        className="action-button"
                      >
                        {routine.estado === "Activa" ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                      <IconButton
                        onClick={() => handleRoutineEdit(routine.id)}
                        className="action-button"
                      >
                        <Edit />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>

        <Box className="action-buttons" sx={{ mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            className="inicio-button create-routine-button"
            onClick={handleCreateRoutine}
            sx={{
              backgroundColor: "#7FB069",
              color: "white",
              borderRadius: "25px",
              py: 2,
              px: 4,
              fontSize: "1.1rem",
              fontWeight: "bold",
              mb: 2,
              width: "100%",
              "&:hover": {
                backgroundColor: "#6FA055",
              },
            }}
          >
            Crear Rutina
          </Button>

          <Button
            variant="contained"
            size="large"
            className="inicio-button add-reminder-button"
            onClick={handleAddReminder}
            sx={{
              backgroundColor: "#7FB069",
              color: "white",
              borderRadius: "25px",
              py: 2,
              px: 4,
              fontSize: "1.1rem",
              fontWeight: "bold",
              mb: 2,
              width: "100%",
              "&:hover": {
                backgroundColor: "#6FA055",
              },
            }}
          >
            Agregar Recordatorio
          </Button>

          <Button
            variant="contained"
            size="large"
            className="inicio-button"
            onClick={() => setOpenGenerarRutinaIA(true)}
            sx={{
              backgroundColor: "#8FBC8F",
              color: "white",
              borderRadius: "25px",
              py: 2,
              px: 4,
              fontSize: "1.1rem",
              fontWeight: "bold",
              mb: 2,
              width: "100%",
              "&:hover": {
                backgroundColor: "#7BA87B",
              },
            }}
          >
            Generar Rutina con IA
          </Button>
          
          <Button
            variant="contained"
            size="large"
            className="inicio-button indicators-button"
            onClick={() => navigate("/indicadores-progreso")}
            sx={{
              backgroundColor: "#7FB069",
              color: "white",
              borderRadius: "25px",
              py: 2,
              px: 4,
              fontSize: "1.1rem",
              fontWeight: "bold",
              width: "100%",
              "&:hover": {
                backgroundColor: "#6FA055",
              },
            }}
          >
            Indicadores de Progreso
          </Button>
        </Box>
      </Container>

      {/* Snackbar estético para advertencias y éxitos */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={(_e, reason) => {
          if (reason === 'clickaway') return;
          setSnackbarOpen(false);
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarMessage.includes('exitosamente') ? 'success' : 'warning'}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <TutorialWizard
        open={showTutorial}
        onClose={() => setShowTutorial(false)}
        mode={tutorialMode}
        autoStart={autoStartTutorial}
        initialModule={firstMandatoryModule ?? undefined}
        navigate={navigate}
      />

      <GenerarRutinaIAModal
        open={openGenerarRutinaIA}
        onClose={() => setOpenGenerarRutinaIA(false)}
        usuarioId={usuarioActivo?.id || 0}
        onRutinaGenerada={handleGenerarRutinaConIA}
      />

    </Box>
  );
};

export default InicioAdulto;