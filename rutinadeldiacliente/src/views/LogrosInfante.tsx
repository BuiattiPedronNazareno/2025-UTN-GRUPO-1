"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"
import { Container, Box, Button, List, ListItem, ListItemIcon, ListItemText, Chip, Stack } from "@mui/material"
import { CheckCircle, RadioButtonUnchecked } from "@mui/icons-material"
import FlashOnIcon from "@mui/icons-material/FlashOn"
import NavBar from "../components/NavBar"
import HelpButton from "../components/HelpButton"
import "../styles/views/LogrosInfante.scss"

interface Achievement {
  id: string
  title: string
  completed: boolean
  icon: string
}

const LogrosInfante: React.FC = () => {
  const navigate = useNavigate()

  const currentLevel = "PRINCIPIANTE"

  const achievements: Achievement[] = [
    {
      id: "1",
      title: "Lavarse los dientes",
      completed: true,
      icon: "✓",
    },
    {
      id: "2",
      title: "Comer",
      completed: true,
      icon: "✓",
    },
    {
      id: "3",
      title: "Hacer la cama",
      completed: false,
      icon: "☐",
    },
  ]

  const handleHelpClick = () => {
    console.log("Solicitando ayuda...")
  }

  const handleBackClick = () => {
    navigate("/")
  }

  return (
    <Box className="logros-infante">
      <NavBar title="Mis logros" showBackButton={true} onBackClick={handleBackClick} />

      <Container component="main" className="main-content" maxWidth="sm">
        <Box className="nivel-actual" sx={{ textAlign: "center", mb: 4 }}>
          <Chip
            icon={<FlashOnIcon />}
            label={currentLevel}
            className="nivel-badge"
            sx={{
              backgroundColor: "#4A90A4",
              color: "white",
              fontSize: "1rem",
              py: 2,
              px: 3,
            }}
          />
        </Box>

        <List className="achievements-list">
          {achievements.map((achievement) => (
            <ListItem
              key={achievement.id}
              className={`achievement-item ${achievement.completed ? "completed" : "pending"}`}
              sx={{
                backgroundColor: achievement.completed ? "#8FBC8F" : "#E0E0E0",
                mb: 2,
                borderRadius: 2,
              }}
            >
              <ListItemIcon>
                {achievement.completed ? (
                  <CheckCircle sx={{ color: "green" }} />
                ) : (
                  <RadioButtonUnchecked sx={{ color: "gray" }} />
                )}
              </ListItemIcon>
              <ListItemText primary={achievement.title} sx={{ "& .MuiListItemText-primary": { fontSize: "1.1rem" } }} />
            </ListItem>
          ))}
        </List>

        <Stack spacing={2} sx={{ mt: 4 }}>
          <Box className="help-section" sx={{ textAlign: "center" }}>
            <HelpButton onClick={handleHelpClick} />
          </Box>

          <Box className="back-section" sx={{ textAlign: "center" }}>
            <Button
              variant="outlined"
              className="back-button"
              onClick={handleBackClick}
              sx={{ backgroundColor: "#CD5C5C", color: "white", "&:hover": { backgroundColor: "#B22222" } }}
            >
              Volver
            </Button>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}

export default LogrosInfante
