"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"
import { Container, Card, CardContent, CardMedia, Typography, Box } from "@mui/material"
import NavBar from "../components/NavBar"
import HelpButton from "../components/HelpButton"
import "../styles/views/InicioInfante.scss"

interface Routine {
  id: string
  title: string
  image: string
  backgroundColor: string
}

const InicioInfante: React.FC = () => {
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
    },
  ]

  const handleRoutineClick = (routineId: string) => {
    console.log(`Iniciando rutina: ${routineId}`)
  }

  const handleHelpClick = () => {
    console.log("Solicitando ayuda...")
  }

  const handleSettingsClick = () => {
    navigate("/ajustes")
  }

  return (
    <Box className="inicio-infante">
      <NavBar title="Mis Rutinas" showSettingsButton={true} onSettingsClick={handleSettingsClick} />

      <Container component="main" className="main-content" maxWidth="md">
        <Box 
          className="routines-container"
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            justifyContent: 'center',
            mt: 4
          }}
        >
          {routines.map((routine) => (
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
                  height: '100%'
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={routine.image || "/placeholder.svg"}
                  alt={routine.title}
                  className="routine-image"
                />
                <CardContent>
                  <Typography variant="h6" component="h3" className="routine-title">
                    {routine.title}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>

        <Box className="help-section" sx={{ textAlign: "center", mt: 4 }}>
          <HelpButton onClick={handleHelpClick} />
        </Box>
      </Container>
    </Box>
  )
}

export default InicioInfante