"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material"
import "../styles/components/TutorialWizard.scss"
import tutorial1 from '../assets/tutorialinfante1.png'
import tutorial2 from '../assets/tutorialinfante2.png'
import tutorial3 from '../assets/tutorialinfante3.png'
import tutorial4 from '../assets/tutorialinfante4.png'
import tutorial5 from '../assets/tutorialinfante5.png'
import tutorial6 from '../assets/tutorialinfante6.png'
import tutorial7 from '../assets/tutorialinfante7.png'
import tutorial8 from '../assets/tutorialinfante8.png'
import tutorial9 from '../assets/tutorialinfante9.png'
import tutorial10 from '../assets/tutorialinfante10.png'
import tutorial11 from '../assets/tutorialinfante11.png'
import tutorial12 from '../assets/tutorialinfante12.png'
import tutorial13 from '../assets/tutorialinfante13.png'
import tutorial14 from '../assets/tutorialinfante14.png'
import tutorial15 from '../assets/tutorialinfante15.png'
import tutorial16 from '../assets/tutorialinfante16.png'
import tutorial17 from '../assets/tutorialinfante17.png'
import tutorial18 from '../assets/tutorialinfante18.png'
import tutorial19 from '../assets/tutorialinfante19.png'
import tutorial20 from '../assets/tutorialinfante20.png'
import tutorial21 from '../assets/tutorialinfante21.png'

const tutorialImages = [
  tutorial1, tutorial2, tutorial3, tutorial4, tutorial5,
  tutorial6, tutorial7, tutorial8, tutorial9, tutorial10,
  tutorial11, tutorial12, tutorial13, tutorial14, tutorial15,
  tutorial16, tutorial17, tutorial18, tutorial19, tutorial20,
  tutorial21
]

const tutorialContents: string[] = [
  "Al entrar a la aplicación vas a encontrarte con las rutinas 📋 a realizar durante el día ☀️. En ellas tendrás el paso a paso de cómo hacerlas 👣",
  "Arriba a la izquierda ⬆️👈 verás tu nivel en la app ⭐",
  "Arriba a la derecha 👉⬆️ verás los ajustes ⚙️",
  "Al entrar en ajustes ⚙️ verás un par de opciones 📋",
  "Si eliges la opción “Adulto” ¡No podrás acceder! ✋ Es la zona de los grandes. Necesitas la clave secreta para entrar 🤫",
  "Si quieres salir de aquí toca el botón “Volver” 🏃‍♂️",
  "Toca “Mis logros” para ver todo lo que has conseguido 🏆",
  "¡Mira qué bien! Aquí puedes ver tu nivel y todo lo que has logrado 🏅",
  "Para ir a Ajustes, toca el botón “Volver” 🔙 Luego, toca “Volver” de nuevo para ir al menú principal 🏠",
  "Si te sientes perdido, solo tienes que tocar el botón de ayuda y un adulto vendrá a ayudarte 🤝",
  "Si algo no te sale, pide ayuda. ¡No te preocupes! 🤗",
  "Toca la rutina para ver todos los pasos que debes seguir ✅",
  "¡Aquí está el primer paso que debes hacer! ✨",
  "Debajo de la imagen, verás lo que tienes que hacer 👀",
  "A veces, escucharás un audio de un adulto para ayudarte 🎧",
  "Puedes cancelar la rutina cuando quieras 🛑",
  "Si te equivocas, no te preocupes, siempre puedes volver a empezar 😊",
  "Para volver a los pasos, toca el botón de atrás ◀️",
  "Para avanzar al siguiente paso, toca el botón de adelante ▶️",
  "Al terminar todos los pasos, habrás completado la Rutina del Día 🎉",
  "Habrá recordatorios para que sepas cuándo es hora de tus rutinas ⏰",
];


interface TutorialWizardProps {
  open: boolean
  onClose: () => void
  mode: "adulto" | "infante"
}

interface Step {
  title: string
  content: string
  image?: string 
}

const stepsAdulto: Step[] = [
  {
    title: "Bienvenido al tutorial adulto",
    content: "Aquí aprenderás a crear y gestionar rutinas paso a paso.",
  },
  {
    title: "Crear rutinas",
    content: "Accede a la sección de rutinas y presiona 'Nueva rutina'.",
  },
  {
    title: "Gestionar rutinas",
    content: "Edita, elimina o reorganiza tus rutinas según tus necesidades.",
  },
  {
    title: "Resumen",
    content: "Ya conoces las funciones principales. ¡Estás listo!",
  },
]

const stepsInfante: Step[] = [
  {
    title: "😎 Bienvenido al tutorial",
    content: "Aquí aprenderás cómo completar tus rutinas y pedir ayuda cuando lo necesites",
  },
  ...tutorialImages.map((img, i) => ({
    title: `Paso ${i + 1}`,
    content: tutorialContents[i],
    image: img,
  })),
  {
    title: "🔁 Recordatorio",
    content: "Puedes repetir este tutorial en cualquier momento desde los ajustes ✨📖",
  },
  {
    title: "🎉 Bienvenido a Rutina Del Día 🌞📱",
    content: "¡Ya sabes cómo usar la app! Disfruta organizando tus días con facilidad",
  },
]

const TutorialWizard: React.FC<TutorialWizardProps> = ({ open, onClose, mode }) => {
  const steps = mode === "adulto" ? stepsAdulto : stepsInfante
  const [activeStep, setActiveStep] = useState(0)

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(prev => prev + 1)
    } else {
      onClose()
      setActiveStep(0)
    }
  }

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1)
    }
  }

  const isTextOnlyStep = () => {
    if (mode === "infante") {
      return activeStep === 0 || activeStep === 22 || activeStep === 23 // pasos 1, 23 y 24
    }
    return false
  }

  return (
    <Dialog
        open={open}
        onClose={onClose}
        fullScreen
        className="tutorial-wizard"
        PaperProps={{
            sx: {
            backgroundColor: '#BFDBD8', 
            boxShadow: 'none',
            }
        }}
    >
        <DialogTitle className="tutorial-title pb-2 mb-0" sx={{ textAlign: "center", py: 2 }}>
            {steps[activeStep].title}
        </DialogTitle>

        <DialogContent
          className="tutorial-content pb-0"
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "calc(100vh - 120px)", 
            overflow: "hidden",
            px: 2,
          }}
        >
          {!isTextOnlyStep() ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
                gap: 0,
                maxWidth: "850px", 
                margin: "0 auto", 
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minWidth: "350px",
                  maxWidth: "350px",
                  mx: 0,
                  px: 0,
                }}
              >
                <img
                  src={steps[activeStep].image}
                  alt={`Tutorial paso ${activeStep + 1}`}
                  style={{
                    width: "100%",
                    maxWidth: "350px",
                    maxHeight: "60vh",
                    borderRadius: "12px",
                    objectFit: "contain",
                  }}
                />
              </Box>

              <Box
                sx={{
                  flex: 1,
                  textAlign: "center",
                  px: 0,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: "1.5rem",
                    fontWeight: 400,
                  }}
                >
                  {steps[activeStep].content}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                px: 2,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontSize: "2rem",
                  fontWeight: 700,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {steps[activeStep].content}
              </Typography>
            </Box>
          )}

          <Box className="tutorial-stepper" sx={{ mt: 4, width: "100%" }}>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ minHeight: 30 }}>
              {steps.map((_, index) => (
                <Step key={index}>
                  <StepLabel sx={{ px: 0, "& span.MuiStepLabel-label": { fontSize: 12 } }} />
                </Step>
              ))}
            </Stepper>
          </Box>
        </DialogContent>

        <DialogActions className="tutorial-actions" sx={{ justifyContent: "space-between", px: 3, py: 1 }}>
            <Button onClick={handleBack} disabled={activeStep === 0}>
            Atrás
            </Button>
            <Button onClick={handleNext}>
            {activeStep === steps.length - 1 ? "Finalizar" : "Siguiente"}
            </Button>
        </DialogActions>
    </Dialog>

  )
}

export default TutorialWizard
