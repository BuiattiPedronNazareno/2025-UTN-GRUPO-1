import React, { useState, useEffect } from "react"
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
  List,
  ListItemButton,
  ListItemText,
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

import adulto1 from '../assets/tutorialadulto1.png'
import adulto2 from '../assets/tutorialadulto2.png'
import adulto3 from '../assets/tutorialadulto3.png'
import adulto4 from '../assets/tutorialadulto4.png'
import adulto5 from '../assets/tutorialadulto5.png'
import adulto6 from '../assets/tutorialadulto6.png'
import adulto7 from '../assets/tutorialadulto7.png'
import adulto8 from '../assets/tutorialadulto8.png'
import adulto9 from '../assets/tutorialadulto9.png'
import adulto10 from '../assets/tutorialadulto10.png'
import adulto11 from '../assets/tutorialadulto11.png'
import adulto12 from '../assets/tutorialadulto12.png'
import adulto13 from '../assets/tutorialadulto13.png'
import adulto14 from '../assets/tutorialadulto14.png'
import adulto15 from '../assets/tutorialadulto15.png'
import adulto16 from '../assets/tutorialadulto16.png'
import adulto17 from '../assets/tutorialadulto17.png'
import adulto18 from '../assets/tutorialadulto18.png'
import adulto19 from '../assets/tutorialadulto19.png'
import adulto20 from '../assets/tutorialadulto20.png'
import adulto21 from '../assets/tutorialadulto21.png'
import adulto22 from '../assets/tutorialadulto22.png'
import adulto23 from '../assets/tutorialadulto23.png'
import adulto24 from '../assets/tutorialadulto24.png'
import adulto25 from '../assets/tutorialadulto25.png'
import adulto26 from '../assets/tutorialadulto26.png'
import adulto27 from '../assets/tutorialadulto27.png'

const tutorialImages = [
  tutorial1, tutorial2, tutorial3, tutorial4, tutorial5,
  tutorial6, tutorial7, tutorial8, tutorial9, tutorial10,
  tutorial11, tutorial12, tutorial13, tutorial14, tutorial15,
  tutorial16, tutorial17, tutorial18, tutorial19, tutorial20,
  tutorial21
]

const tutorialImagesAdulto = [
  adulto1, adulto2, adulto3, adulto4, adulto5, adulto6, adulto7,
  adulto8, adulto9, adulto10, adulto11, adulto12, adulto13,
  adulto14, adulto15, adulto16, adulto17, adulto18, adulto19, 
  adulto20, adulto21, adulto22, adulto23, adulto24, adulto25, 
  adulto26, adulto27
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
  "Al terminar todos los pasos anteriores, habrás completado la Rutina del Día 🎉",
  "Habrán recordatorios para que sepas cuándo es hora de tus rutinas ⏰",
];

const tutorialContentsAdulto: string[] = [
  "Al ingresar con el PIN que has registrado podrás ver las rutinas y diferentes opciones para gestionarlas",
  "Seleccionando la opción de crear rutina...",
  "Encontrarás todo lo que podrás agregarle a la misma, como una imagen, y una lista de horarios y días en los que se mostrará la rutina en la vista del niño",
  "Podrás crear una motivación para la rutina",
  "Esta se activará una vez el niño haya completado la rutina, podrás agregar en la descripción la frase que aparecerá",
  "Las rutinas tienen un conjunto de pasos, seleccionando la opción de crear un paso...",
  "Podrás crear paso por paso, agregándole opcionalmente una imagen y/o un audio",
  "Las rutinas podrán tener hasta 4 pasos. Llegando a ese límite no se podrán crear más pasos",
  "En cualquier momento podrás editar las rutinas que creaste",
  "Y modificar la información que estas contienen",
  "Además de poder editar los pasos de la rutina",
  "Y cambiar los datos de cada paso",
  "También tienes la opción de ocultar los pasos",
  "Al ocultar un paso ya no se verá en la vista del niño",
  "Solo puedes crear hasta 5 rutinas para evitar la invasión visual",
  "Desde ajustes tendrás varias opciones",
  "Entre ellas: activar o desactivar las notificaciones de recordatorios, cambiar el PIN, cambiar los colores de los botones y demás elementos",
  "Al activar las notificaciones te habilitará la opción para agregar un recordatorio de una rutina",
  "Podrás seleccionar para este distintos datos como la frecuencia, color, sonido, entre otros",
  "Las rutinas con recordatorio tendrán el ícono de la campanita para abrir la opción de editar el recordatorio",
  "Y así cambiar los datos del recordatorio a decisión",
  "Al seleccionar ese botón podrás ocultar la rutina en la vista del niño",
  "Podrás desactivarlo cuando quieras",
  "El niño tendrá la opción de cancelar rutinas, para ello tendrás un historial para poder hacer un seguimiento",
  "Al entrar podrás ver todas las rutinas canceladas",
  "De igual forma, la notificación de cancelación te llegará vía WhatsApp",
  "Lo mismo para el caso de que el niño apriete el botón de ayuda que aparece en su vista",
]

interface StepData {
  title: string
  content: string
  image?: string
}

const stepsInfante: StepData[] = [
  { title: "😎 Bienvenido al tutorial", content: "Aquí aprenderás cómo completar tus rutinas..." },
  ...tutorialImages.map((img, i) => ({
    title: `Paso ${i + 1}`,
    content: tutorialContents[i],
    image: img,
  })),
  { title: "🎉 Fin del tutorial", content: "¡Ya sabes cómo usar la app! 🎉" },
]

const stepsAdulto: StepData[] = [
  { title: "👋 Bienvenido al tutorial adulto", content: "Aquí aprenderás a crear y gestionar rutinas paso a paso" },
  ...tutorialImagesAdulto.map((img, i) => ({
    title: `Paso ${i + 1}`,
    content: tutorialContentsAdulto[i],
    image: img,
  })),
  { title: "🎉 Fin del tutorial", content: "Ya conoces todas las funciones principales. ¡Estás preparado!" },
]

const tutorialModulesInfante = [
  { id: 1, title: "🧭 Introducción y entorno general", mandatory: true, steps: stepsInfante.slice(0, 5) },
  { id: 2, title: "⚙️ Ajustes y logros", steps: stepsInfante.slice(5, 10) },
  { id: 3, title: "🧑‍🤝‍🧑 Ayuda y apoyo", steps: stepsInfante.slice(10, 12) },
  { id: 4, title: "📋 Uso de rutinas y recordatorios", steps: stepsInfante.slice(12, 23) },
]

const tutorialModulesAdulto = [
  { id: 1, title: "🧭 Introducción y creación básica", mandatory: true, steps: stepsAdulto.slice(0, 6) },
  { id: 2, title: "🪜 Gestión de pasos", steps: stepsAdulto.slice(6, 13) },
  { id: 3, title: "🧩 Gestión general", steps: stepsAdulto.slice(13, 16) },
  { id: 4, title: "🔔 Notificaciones", steps: stepsAdulto.slice(16, 22) },
  { id: 5, title: "👀 Control y seguimiento", steps: stepsAdulto.slice(22, 30) },
]

const saveProgress = (mode: "adulto" | "infante", moduleId: number) => {
  localStorage.setItem(`tutorialProgress_${mode}`, moduleId.toString())
}

const getProgress = (mode: "adulto" | "infante") => {
  return parseInt(localStorage.getItem(`tutorialProgress_${mode}`) || "0")
}

interface TutorialWizardProps {
  open: boolean
  onClose: () => void
  mode: "adulto" | "infante"
  autoStart?: boolean
  initialModule?: number;
  navigate: (to: string, options?: { replace?: boolean; state?: any }) => void

}

const TutorialWizard: React.FC<TutorialWizardProps> = ({ open, onClose, mode, autoStart, initialModule, navigate }) => {
  const modules = mode === "adulto" ? tutorialModulesAdulto : tutorialModulesInfante
  const [activeModule, setActiveModule] = useState<number | null>(initialModule ?? null)
  const [activeStep, setActiveStep] = useState(0)
  const [progress, setProgress] = useState<number>(0)

  useEffect(() => {
    localStorage.removeItem("tutorialProgress_adulto")
    localStorage.removeItem("tutorialProgress_infante")
    setProgress(0)
  }, [])

  useEffect(() => {
  console.log("El valor de mode es:", mode);
}, [mode]);


useEffect(() => {
  const progressValue = getProgress(mode)
  setProgress(progressValue)

  if (open && autoStart && progressValue === 0) {
    // Buscamos el primer módulo obligatorio
    const firstMandatoryModule = modules.find(m => m.mandatory)?.id || 1
    setActiveModule(firstMandatoryModule)
    setActiveStep(0)
  }
}, [mode, open, autoStart, modules])



  const handleNext = () => {
    if (!activeModule) return
    const currentSteps = modules.find(m => m.id === activeModule)!.steps
    if (activeStep < currentSteps.length - 1) {
      setActiveStep(prev => prev + 1)
    } else {
      if (activeModule > progress) {
        saveProgress(mode, activeModule)
        setProgress(activeModule)
      }
      setActiveModule(null)
      setActiveStep(0)
    }
  }

  const handleBack = () => {
    if (activeStep > 0) setActiveStep(prev => prev - 1)
  }

  if (!activeModule) {
    return (
      <Dialog open={open} onClose={onClose} fullScreen>
        <DialogTitle sx={{ textAlign: "center", py: 2 }}>
          {mode === "adulto" ? "Tutorial Adulto" : "Tutorial Niño"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
            {progress === 0
              ? "Debes completar el primer módulo obligatorio antes de continuar."
              : "Selecciona un módulo para continuar o repasar:"}
          </Typography>
          <List>
            {modules.map(mod => (
              <ListItemButton
                key={mod.id}
                disabled={mod.mandatory && progress < 1 && mod.id !== 1}
                onClick={() => setActiveModule(mod.id)}
              >
                <ListItemText
                  primary={mod.title}
                  secondary={
                    progress >= mod.id
                      ? "✅ Completado"
                      : mod.mandatory && mod.id === 1
                      ? "🟢 Obligatorio"
                      : "Opcional"
                  }
                />
              </ListItemButton>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    )
  }

  const module = modules.find(m => m.id === activeModule)!
  const step = module.steps[activeStep]

  return (
    <Dialog
      open={open}
      fullScreen
      className="tutorial-wizard"
      PaperProps={{
        sx: { backgroundColor: "#BFDBD8", boxShadow: "none" },
      }}
    >
      <DialogTitle className="tutorial-title pb-2 mb-0" sx={{ textAlign: "center", py: 2 }}>
        {step.title}
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
        {step.image ? (
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
              }}
            >
              <img
                src={step.image}
                alt={`Paso ${activeStep + 1}`}
                style={{
                  width: "100%",
                  maxWidth: "350px",
                  maxHeight: "60vh",
                  borderRadius: "12px",
                  objectFit: "contain",
                }}
              />
            </Box>
            <Box sx={{ flex: 1, textAlign: "center", px: 0 }}>
              <Typography variant="body1" sx={{ fontSize: "1.5rem", fontWeight: 400 }}>
                {step.content}
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
            <Typography variant="body1" sx={{ fontSize: "2rem", fontWeight: 700 }}>
              {step.content}
            </Typography>
          </Box>
        )}

        <Box className="tutorial-stepper" sx={{ mt: 4, width: "100%" }}>
          <Stepper activeStep={activeStep} alternativeLabel sx={{ minHeight: 30 }}>
            {module.steps.map((_, i) => (
              <Step key={i}><StepLabel /></Step>
            ))}
          </Stepper>
        </Box>
      </DialogContent>

      <DialogActions
        className="tutorial-actions"
        sx={{ justifyContent: "space-between", px: 3, py: 1 }}
      >
        <Button onClick={handleBack} disabled={activeStep === 0}>
          Atrás
        </Button>

        {/* Si es la primera vez y está en el último paso, mostramos las dos opciones */}
        {activeStep === module.steps.length - 1 && autoStart ? (
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                // Hace lo mismo que "Finalizar módulo"
                handleNext()
              }}
            >
              Completar tutorial
            </Button>

          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              onClose(); // Cerramos el modal
              if (mode === "adulto") {
                navigate("/adulto");
              } else {
                navigate("/inicio");
              }
            }}
          >
            Comenzar sin completar tutorial
          </Button>
          </Box>
        ) : (
          // Si no es la primera vez o no está en el último paso, comportamiento normal
          <Button onClick={handleNext}>
            {activeStep === module.steps.length - 1 ? "Finalizar módulo" : "Siguiente"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default TutorialWizard