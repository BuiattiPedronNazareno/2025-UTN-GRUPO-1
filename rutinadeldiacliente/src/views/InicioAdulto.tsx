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
} from "@mui/material";
import {
  Settings,
  Visibility,
  VisibilityOff,
  Edit,
  NotificationsActive,
} from "@mui/icons-material";
import "../styles/views/InicioAdulto.scss";
import { obtenerRutinas, cambiarVisibilidadRutina } from "../services/rutinaService";
import type { Rutina } from "../services/rutinaService";
import { verificarRecordatorio } from "../services/recordatorioService";
import { obtenerTutorialStatus, completarTutorial } from "../services/UsuarioService";
import { useAppContext } from "../context/AppContext";

const InicioAdulto: React.FC = () => {
  const navigate = useNavigate();
  const [routines, setRoutines] = useState<Rutina[]>([]);
  const [routinesWithReminders, setRoutinesWithReminders] = useState<
    Set<number>
  >(new Set());
   const { usuarioActivo } = useAppContext();

  useEffect(() => {
    const fetchRutinas = async () => {
      try {
        const data = await obtenerRutinas();
        
        setRoutines(data);

        // después de obtener rutinas, verificamos recordatorios
        const results = await Promise.all(
          data.map(async (routine) => {
            const tiene = await verificarRecordatorio(routine.id);
            return tiene ? routine.id : null;
          }),
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
          alert("Es la primera vez que ingresas como adulto, ¡mostrando tutorial!");
          await completarTutorial(usuarioActivo.id);
        }
      } catch (error) {
        console.error("Error verificando tutorial adulto:", error);
      }
    };

    checkTutorial();
  }, [usuarioActivo]);

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
    const estadoNuevo = estadoActual.trim().toLowerCase() === "activa" ? "Oculta" : "Activa";

    const rutinaActualizada = await cambiarVisibilidadRutina(routineId, {
      estado: estadoNuevo,
    });

    setRoutines((prev) =>
      prev.map((r) =>
        r.id === routineId ? { ...r, estado: rutinaActualizada.estado } : r
      )
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
                className="routine-card"
                sx={{
                  backgroundColor: "#4A90A4",
                  cursor: "pointer",
                  "&:hover": { transform: "scale(1.02)" },
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                <CardMedia
                  component="img"
                  height={200}
                  image={routine.imagen || "/placeholder.svg"}
                  alt={routine.nombre}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    className="routine-header"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="h3"
                      className="routine-title"
                    >
                      {routine.nombre}
                    </Typography>

                    <Box className="routine-actions">
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
            className="create-routine-button"
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
            className="add-reminder-button"
            onClick={handleAddReminder}
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
            Agregar Recordatorio
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default InicioAdulto;
