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

interface TutorialWizardProps {
  open: boolean
  onClose: () => void
  mode: "adulto" | "infante"
}

const stepsAdulto = [
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

const stepsInfante = [
  {
    title: "Bienvenido al tutorial infantil",
    content: "Aquí aprenderás cómo completar tus rutinas y usar la ayuda.",
  },
  {
    title: "Completar rutinas",
    content: "Presiona sobre cada actividad para marcarla como completada.",
  },
  {
    title: "Botón de ayuda",
    content: "Si necesitas asistencia, toca el botón de ayuda en la pantalla.",
  },
  {
    title: "Resumen",
    content: "¡Muy bien! Ya sabes cómo usar la app correctamente.",
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth className="tutorial-wizard">
      <DialogTitle className="tutorial-title">{steps[activeStep].title}</DialogTitle>

      <DialogContent className="tutorial-content">
        <Typography variant="body1">{steps[activeStep].content}</Typography>

        <Box className="tutorial-stepper">
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((s, index) => (
              <Step key={index}>
                <StepLabel />
              </Step>
            ))}
          </Stepper>
        </Box>
      </DialogContent>

      <DialogActions className="tutorial-actions">
        <Button
          onClick={handleBack}
          disabled={activeStep === 0}
          className="back-button"
        >
          Atrás
        </Button>
        <Button onClick={handleNext} className="next-button">
          {activeStep === steps.length - 1 ? "Finalizar" : "Siguiente"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TutorialWizard
