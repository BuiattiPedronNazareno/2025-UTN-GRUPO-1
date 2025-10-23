"use client";

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Container, Card, CardContent, Typography, Button } from "@mui/material";
import HelpButton from "../components/HelpButton";
import { obtenerPasosPorRutina } from "../services/pasoService";
import { obtenerRutinaPorId } from "../services/rutinaService";
import type { Rutina } from "../services/rutinaService"
import type { Paso } from "../services/pasoService";
import "../styles/views/RutinaDetalle.scss";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

import ChevronRight from "@mui/icons-material/ChevronRight";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import { crearCancelacion } from "../services/cancelacionService";
const RutinaDetalleInfante: React.FC = () => {
  const navigate = useNavigate();
  const { rutinaId } = useParams<{ rutinaId: string }>();
  const [pasos, setPasos] = useState<Paso[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [rutina, setRutina] = useState<Rutina | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const fetchRutinaYPasos = async () => {
      try {
        if (!rutinaId) return;

        const [rutinaData, pasosData] = await Promise.all([
          obtenerRutinaPorId(Number(rutinaId)),
          obtenerPasosPorRutina(Number(rutinaId)).catch(() => []), 
        ]);

        setRutina(rutinaData);
        setPasos(pasosData);

      } catch (error) {
        console.error("Error al obtener rutina o pasos:", error);
      }
    };

    fetchRutinaYPasos();
  }, [rutinaId]);


  const handleHelpClick = () => {
    console.log("Solicitando ayuda...")
  }

  const handleCancelar = () => {
    try {
      if (!rutinaId) return;

      const cancelacion ={
        rutinaID: Number(rutinaId),
        fechaHora: new Date()
      }

      crearCancelacion(cancelacion);
      setShowNotification(true);

      // Ocultar después de 0.5 segundos y navegar
      setTimeout(() => {
        setShowNotification(false);
        navigate("/inicio");
      }, 2500);
    } catch (error) {
    console.error("Error al crear la cancelacion:", error);
    }
  };


  const handleNext = () => {
  if (currentStep < pasos.length - 1) {
    setCurrentStep(currentStep + 1);
  } else {
    // Último paso, finalizar rutina
    navigate("/inicio");
  }
};


  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

if (pasos.length === 0)
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
        <div className="cancel-notification">Rutina cancelada correctamente</div>
      )}
    </Box>
  );
};

export default RutinaDetalleInfante;

        <Typography variant="h5" className="verde-finalizar"></Typography>


