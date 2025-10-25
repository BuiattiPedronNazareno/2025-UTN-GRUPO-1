"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"
import { Container, Box, Button, List, ListItem, ListItemIcon, ListItemText, Typography, Stack } from "@mui/material"
import { CheckCircle, RadioButtonUnchecked } from "@mui/icons-material"
import BoltIcon from "@mui/icons-material/Bolt";
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
    { id: "1", title: "Lavarse los dientes", completed: true, icon: "✓" },
    { id: "2", title: "Comer", completed: true, icon: "✓" },
    { id: "3", title: "Hacer la cama", completed: false, icon: "☐" },
  ];

  const handleHelpClick = () => console.log("Solicitando ayuda...");
  const handleBackClick = () => navigate("/");

  return (
    <Box className="logros-infante">
      <NavBar title="Mis logros" showBackButton={true} onBackClick={handleBackClick} />

      <Container component="main" className="main-content" maxWidth="sm">
        <Box className="nivel-section">
          <Box className="nivel-header">
            <Typography variant="h5" className="nivel-titulo">
              Nivel actual
            </Typography>
          </Box>

          <Box className="nivel-actual">
            <BoltIcon className="nivel-icon" />
            <Typography variant="h6" className="nivel-text">
              {currentLevel}
            </Typography>
          </Box>
        </Box>

        <List className="achievements-list">
          {achievements.map((achievement) => (
            <ListItem
              key={achievement.id}
              className={`achievement-item ajuste-button ${achievement.completed ? "completed" : "pending"}`}
              sx={{
                backgroundColor: achievement.completed ? "#8FBC8F" : "#E0E0E0",
                mb: 2,
                borderRadius: "25px",
                py: 3,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: achievement.completed ? "#7CAF7C" : "#7CAF7C",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                },
              }}
            >
              <ListItemIcon>
                {achievement.completed ? (
                  <CheckCircle sx={{ color: "black", fontSize: "1.5rem" }} />
                ) : (
                  <RadioButtonUnchecked sx={{ color: "black", fontSize: "1.5rem" }} />
                )}
              </ListItemIcon>
              <ListItemText 
                primary={achievement.title} 
                sx={{ 
                  "& .MuiListItemText-primary": { 
                    fontSize: "1.2rem",
                    color: "black",
                    fontWeight: "600",
                    textAlign: "center"
                  } 
                }} 
              />
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
              className="back-button volver-button"
              onClick={handleBackClick}
              sx={{ 
                backgroundColor: "#CD5C5C", 
                color: "white", 
                py: 2,
                fontSize: "1.1rem",
                borderRadius: "25px",
                width: "100%",
                maxWidth: "200px",
                "&:hover": { 
                  backgroundColor: "#B22222" 
                } 
              }}
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
