"use client";

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Container, Card, CardContent, Typography, Button, CircularProgress } from "@mui/material";
import HelpButton from "../components/HelpButton";
import { obtenerPasosPorRutina } from "../services/pasoService";
import { obtenerRutinaPorId } from "../services/rutinaService";
import type { Rutina } from "../services/rutinaService"
import type { Paso } from "../services/pasoService";
import "../styles/views/RutinaDetalle.scss";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

import ChevronRight from "@mui/icons-material/ChevronRight";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import { crearCancelacion, cancelarRutina } from "../services/cancelacionService";
import CancelModal from "../components/CancelModal";
import { crearMotivacion } from "../services/motivacionService";
import { useAppContext } from "../context/AppContext";
import MotivacionModal from "../components/MotivacionModal";
import { obtenerInfanteNiveles } from "../services/infanteNivelService"; 

const RutinaDetalleInfante: React.FC = () => {
  const navigate = useNavigate();
  const { rutinaId } = useParams<{ rutinaId: string }>();
  const [pasos, setPasos] = useState<Paso[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [rutina, setRutina] = useState<Rutina | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { infanteActivo, actualizarNivelInfante } = useAppContext();
  const [motivacionModalOpen, setMotivacionModalOpen] = useState(false);
  const [motivacionData, setMotivacionData] = useState<{ subioNivel?: boolean; nuevoNivel?: string }>({});


  useEffect(() => {
    const fetchRutinaYPasos = async () => {
      try {
        if (!rutinaId) return;
        setIsLoading(true);
        const [rutinaData, pasosData] = await Promise.all([
          obtenerRutinaPorId(Number(rutinaId)),

          obtenerPasosPorRutina(Number(rutinaId)).catch(() => []),
        ]);

        setRutina(rutinaData);

        localStorage.setItem("routineId", rutinaData.id.toString());

        // Filtrar solo pasos con estado 'Activo' (si estado es undefined, asumimos 'Activo')
        const pasosActivos = pasosData.filter((p: Paso) => p.estado?.toLowerCase() === 'activo');
        setPasos(pasosActivos);
        // Asegurar que currentStep esté en rango
        setCurrentStep(0);


      } catch (error) {
        console.error("Error al obtener rutina o pasos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRutinaYPasos();
  }, [rutinaId]);


  const handleHelpClick = () => {
    console.log("Solicitando ayuda...")
  }

  const handleCancelar = async () => {
    try {
      if (!rutinaId || !infanteActivo) return;

      // ✅ Usar cancelarRutina que envía notificación por Telegram
      await cancelarRutina(Number(rutinaId), infanteActivo.id);
      
      setShowNotification(true);

      // Ocultar después de 2.5 segundos y navegar
      setTimeout(() => {
        setShowNotification(false);
        navigate("/inicio");
      }, 2500);
    } catch (error) {
      console.error("Error al cancelar la rutina:", error);
    }
  };


const handleNext = async () => {
  if (currentStep < pasos.length - 1) {
    setCurrentStep(currentStep + 1);
  } else {
    // Último paso, crear motivación
    try {
      if (infanteActivo && rutina) {
        const response = await crearMotivacion({
          rutinaId: rutina.id,
          infanteId: infanteActivo.id,
        });

        setMotivacionData({
          subioNivel: response.subioNivel,
          nuevoNivel: response.nuevoNivel,
        });

        // Si subió de nivel, actualizar el contexto
          if (response.subioNivel && response.nuevoNivel) {
            console.log("🚀 El infante subió de nivel:", response.nuevoNivel);
            
            // Buscar el ID del nuevo nivel
            const niveles = await obtenerInfanteNiveles();
            const nuevoNivel = niveles.find(n => n.descripcion === response.nuevoNivel);
            
            if (nuevoNivel) {
              console.log("📈 Actualizando nivel en contexto:", { nuevoNivelId: nuevoNivel.id, descripcion: response.nuevoNivel });
              actualizarNivelInfante(nuevoNivel.id, response.nuevoNivel);
            } else {
              console.warn("⚠️ No se encontró el nivel con descripción:", response.nuevoNivel);
            }
          }

        setMotivacionModalOpen(true);
      }
    } catch (error) {
      console.error("Error al crear motivación:", error);
    }
  }
};




  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };
  
  if (isLoading) {
  return (
    <Container maxWidth="sm" sx={{ mt: 4, textAlign: "center" }}>
      <CircularProgress /> {/* Importar de @mui/material */}
      <Typography variant="h6" sx={{ mt: 2 }}>
        Cargando rutina...
      </Typography>
    </Container>
  );
  }
  if (pasos.length === 0 && isLoading === false) {
    console.log("Pasos de la rutina:", pasos, pasos.length);
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Button className="volver-button" onClick={handleCancelar}>
          Volver
        </Button>
        <Typography variant="h5" align="center" sx={{ mb: 2 }}>

          {rutina?.nombre || "Rutina"}
        </Typography>
        <Typography variant="body1" align="center">
          No hay pasos disponibles para esta rutina.
        </Typography>
        {showNotification && <div className="cancel-notification">Rutina cancelada</div>}
      </Container>
    );
  }
  const paso = pasos[currentStep];
  console.log(paso.imagen);

  return (
    <Box className="rutina-detalle-infante">
      <Container maxWidth="xs">
        <Button className="volver-button" onClick={handleCancelar}>
          Cancelar Rutina
        </Button>

        <Typography variant="h5" align="center" className="rutina-titulo">
          {rutina?.nombre || `Rutina ${paso.rutinaId}`}
        </Typography>

        <Card className="step-card">
          <Box className="step-image">
            <img
              src={paso.imagen ? `/${paso.imagen}` : "/placeholder.svg"}
              alt={`Paso ${paso.orden}`}
            />
          </Box>

          <CardContent className="step-content">
            <Typography variant="body1" className="paso-descripcion">
              {paso.descripcion}
            </Typography>

            <Button variant="contained" className="audio-button">
              <VolumeUpIcon />
            </Button>

            <HelpButton onClick={handleHelpClick} />
          </CardContent>
        </Card>

        <Box className="step-buttons">
          <Button
            variant="contained"
            className="naranja"
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            <ChevronLeft />
          </Button>

          {currentStep === pasos.length - 1 ? 
            <Button
              variant="contained"
              className="verde-finalizar"
              onClick={handleNext}
            >
              <Typography variant="h5"> Finalizar </Typography> 
            </Button>
          : 
            <Button
              variant="contained"
              className="verde"
              onClick={handleNext}
            >
              <ChevronRight />
            </Button>
          }
        </Box>
      </Container>
      {showNotification && (
        <CancelModal open={showNotification} onClose={() => setShowNotification(false)} />
      )}
      {motivacionModalOpen && (
        <MotivacionModal
          open={motivacionModalOpen}
          onClose={() => {
            setMotivacionModalOpen(false);
            navigate("/inicio");
          }}
          mensaje="¡Completaste la rutina!"
          subioNivel={!!motivacionData.subioNivel}
          nuevoNivel={motivacionData.nuevoNivel}
        />
      )}

    </Box>
  );
};

export default RutinaDetalleInfante;

   


