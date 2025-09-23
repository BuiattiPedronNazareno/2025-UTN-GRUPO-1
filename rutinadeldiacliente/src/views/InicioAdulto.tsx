"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"
import { Container, Card, CardContent, CardMedia, Typography, Box, Button, IconButton } from "@mui/material"
import { Settings, Visibility, Edit, NotificationsActive } from "@mui/icons-material"
import "../styles/views/InicioAdulto.scss"

interface Routine {
  id: string
  title: string
  image: string
  backgroundColor: string
  hasNotification?: boolean
}

const InicioAdulto: React.FC = () => {
  const navigate = useNavigate()

  const routines: Routine[] = [
    {
      id: "1",
      title: "Lavarse los dientes",
      image: "/child-brushing-teeth-happily.jpg",
      backgroundColor: "#4A90A4",
    },
    {
      id: "2",
      title: "Comer",
      image: "/happy-child-eating-at-table-with-utensils.jpg",
      backgroundColor: "#4A90A4",
      hasNotification: true,
    },
  ]

  const handleRoutineView = (routineId: string) => {
    console.log(`Ver rutina: ${routineId}`)
  }

  const handleRoutineEdit = (routineId: string) => {
    console.log(`Editar rutina: ${routineId}`)
  }

  const handleCreateRoutine = () => {
  navigate("/crear-rutina");
  };

  const handleAddReminder = () => {
    console.log("Agregar recordatorio")
  }

  const handleSettingsClick = () => {
    navigate("/ajustes-adulto")
  }

  return (
    <Box className="inicio-adulto">
      {/* Header */}
      <Box className="header">
        <Box className="header-content">
          <Typography variant="h4" component="h1" className="header-title">
            Mis Rutinas
          </Typography>
          <IconButton className="settings-button" onClick={handleSettingsClick} sx={{ color: "#2C3E50" }}>
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
        {/* Routine Cards */}
        <Box className="routines-container">
          {routines.map((routine) => (
            <Card
              key={routine.id}
              className="routine-card"
              sx={{
                backgroundColor: routine.backgroundColor,
                borderRadius: "20px",
                overflow: "hidden",
                marginBottom: "1.5rem",
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={routine.image}
                alt={routine.title}
                className="routine-image"
              />
              <CardContent className="routine-content">
                <Typography variant="h5" component="h3" className="routine-title">
                  {routine.title}
                </Typography>

                <Box className="routine-actions">
                  {routine.hasNotification && (
                    <IconButton className="action-button notification-button" sx={{ color: "#2C3E50" }}>
                      <NotificationsActive />
                    </IconButton>
                  )}
                  <IconButton
                    className="action-button view-button"
                    onClick={() => handleRoutineView(routine.id)}
                    sx={{ color: "#2C3E50" }}
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton
                    className="action-button edit-button"
                    onClick={() => handleRoutineEdit(routine.id)}
                    sx={{ color: "#2C3E50" }}
                  >
                    <Edit />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Action Buttons */}
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
  )
}

export default InicioAdulto
