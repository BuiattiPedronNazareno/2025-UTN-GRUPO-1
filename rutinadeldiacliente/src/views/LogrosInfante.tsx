"use client"

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { Container, Box, Button, List, ListItem, ListItemIcon, ListItemText, Typography, Stack } from "@mui/material"
import { CheckCircle, RadioButtonUnchecked } from "@mui/icons-material"
import BoltIcon from "@mui/icons-material/Bolt";
import NavBar from "../components/NavBar"
import HelpButton from "../components/HelpButton"
import "../styles/views/LogrosInfante.scss"
import { useAppContext } from "../context/AppContext";
import { obtenerMotivacionesPorInfante } from "../services/motivacionService";
import type { MotivacionReadDTO } from "../services/motivacionService";

interface Achievement {
  id: string
  title: string
  completed: boolean
  icon: string
}

const LogrosInfante: React.FC = () => {
  const navigate = useNavigate()
  const { nivelDescripcion, infanteActivo } = useAppContext();
  const [motivaciones, setMotivaciones] = useState<MotivacionReadDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMotivaciones = async () => {
      try {
        if (!infanteActivo?.id) return; // ✅ usamos infanteActivo?.id
        const data = await obtenerMotivacionesPorInfante(infanteActivo.id);
        setMotivaciones(data);
      } catch (error) {
        console.error("Error al obtener motivaciones:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMotivaciones();
  }, [infanteActivo?.id]);

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
            <Typography 
            className="nivel-text"
            variant="h4" // más grande que h6
            sx={{ textTransform: "uppercase", fontWeight: "bold" }}
            >
              {nivelDescripcion}
            </Typography>
          </Box>
        </Box>

     {/* ✅ Lista de motivaciones */}
        <List className="achievements-list">
          {loading ? (
            <Typography variant="body1" textAlign="center">
              Cargando motivaciones...
            </Typography>
          ) : motivaciones.length === 0 ? (
            <Typography variant="body1" textAlign="center">
              Aun no completaste ninguna rutina.
            </Typography>
          ) : (
            motivaciones.map((motivacion) => (
              <ListItem
                key={motivacion.id}
                className="achievement-item ajuste-button"
                sx={{
                  backgroundColor: "#E0E0E0",
                  mb: 2,
                  borderRadius: "25px",
                  py: 3,
                  px: 2,
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  "&:hover": {
                    backgroundColor: "#7CAF7C",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  },
                }}
              >
                {/* ✅ Ícono negro al lado izquierdo */}
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <CheckCircle sx={{ color: "black" }} />
                </ListItemIcon>

                <ListItemText
                  primary={motivacion.descripcion}
                  sx={{
                    "& .MuiListItemText-primary": {
                    fontSize: "1rem",
                    color: "black",
                    fontWeight: "600",
                    textAlign: "left",
                    lineHeight: 1.6, // espacio entre líneas
                    wordBreak: "break-word", // rompe palabras largas si es necesario
                    whiteSpace: "pre-wrap", // respeta saltos de línea si los hay
                    },
                  }}
                />
              </ListItem>
            ))
          )}
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
