"use client"

import type React from "react"
import { useEffect, useState } from "react" 
import { useNavigate } from "react-router-dom"
import { Container, Card, CardContent, CardMedia, Typography, Box } from "@mui/material"
import NavBar from "../components/NavBar"
import HelpButton from "../components/HelpButton"
import "../styles/views/InicioInfante.scss"
import { obtenerRutinas } from "../services/rutinaService"
import type { Rutina } from "../services/rutinaService"
import { obtenerTutorialStatusInfante, completarTutorialInfante } from "../services/infanteService"
import { useAppContext } from "../context/AppContext";
import TutorialWizard from "../components/TutorialWizard";

const InicioInfante: React.FC = () => {
  const navigate = useNavigate()
  const [routines, setRoutines] = useState<Rutina[]>([])
  const { infanteActivo } = useAppContext();
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialMode, setTutorialMode] = useState<"adulto" | "infante">("infante");
  const [autoStartTutorial, setAutoStartTutorial] = useState(false);
  const [firstMandatoryModule, setFirstMandatoryModule] = useState<number>(1)



  useEffect(() => {
    const fetchRutinas = async () => {
      try {
        const data = await obtenerRutinas()
        setRoutines(data)
      } catch (error) {
        console.error("Error al obtener rutinas:", error)
      }
    }

    fetchRutinas()
  }, [])

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

        <Box className="help-section" sx={{ textAlign: "center", mt: 4 }}>
          <HelpButton onClick={handleHelpClick} />
        </Box>
      </Container>

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