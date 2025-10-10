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
import "../styles/components/RoutineCard.scss";
import "../styles/components/MainActionButton.scss";

const InicioAdulto: React.FC = () => {
  const navigate = useNavigate();
  const [routines, setRoutines] = useState<Rutina[]>([]);
  const [routinesWithReminders, setRoutinesWithReminders] = useState<
    Set<number>
  >(new Set());

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
              <Card className="routine-card">
                <CardMedia
                  component="img"
                  className="routine-image"
                  image={routine.imagen || "/placeholder.svg"}
                  alt={routine.nombre}
                />
                <CardContent>
                  <Typography className="routine-title">{routine.nombre}</Typography>

                  <Box className="routine-actions">
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

        <Box className="action-buttons" sx={{ mt: 4, textAlign: "center" }}>
          <Button
          variant="contained"
          className="main-action-button"
          onClick={handleCreateRoutine}
          >
            Crear Rutina
          </Button>

          <Button
            variant="contained"
            className="main-action-button"
            onClick={handleAddReminder}
            sx={{ mt: 2 }}
          >
            Agregar Recordatorio
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default InicioAdulto;
