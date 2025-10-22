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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { crearCancelacion } from "../services/cancelacionService";

const RutinaDetalleInfante: React.FC = () => {
  const navigate = useNavigate();
  const { rutinaId } = useParams<{ rutinaId: string }>();
  const [pasos, setPasos] = useState<Paso[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [rutina, setRutina] = useState<Rutina | null>(null);

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
      navigate("/inicio");
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
        <Button
        variant="contained"
        fullWidth
        sx={{
          mb: 3,
          backgroundColor: "#64B5F6", // azul suave
          color: "white",
          borderRadius: 2,
          py: 1.5,
          "&:hover": {
            backgroundColor: "#42A5F5",
          },
        }}
        onClick={handleCancelar}
      >
        Volver
      </Button>
        <Typography variant="h5" component="h2" sx={{ textAlign: "center", mb: 2 }}>
          {rutina?.nombre || "Rutina"}
        </Typography>
        <Typography variant="body1" sx={{ textAlign: "center" }}>
          No hay pasos disponibles para esta rutina.
        </Typography>
      </Container>
    );

  const paso = pasos[currentStep];
  console.log(paso.imagen);


  return (
    <Box className="rutina-detalle-infante">
      <Container maxWidth="sm">
        <Button
          variant="contained"
          color="error"
          fullWidth
          sx={{ mb: 3 }}
          onClick={handleCancelar}
        >
          Cancelar Rutina
        </Button>

        <Typography variant="h5" component="h2" sx={{ textAlign: "center", mb: 1 }}>
          {rutina?.nombre || `Rutina ${paso.rutinaId}`}
        </Typography>

        <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }}>
          {`Paso ${paso.orden}`}
        </Typography>

        <Card className="step-card">
          <Box className="step-image">
            <img src={paso.imagen ? `/${paso.imagen}` : "/placeholder.svg"} alt={`Paso ${paso.orden}`} />
          </Box>
          <CardContent sx={{ textAlign: "center" }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {paso.descripcion}
            </Typography>

            <Button
              variant="outlined"
              fullWidth
              sx={{
                mb: 2,
                borderColor: "white",
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderColor: "white",
                },
              }}
            >
              <VolumeUpIcon />
            </Button>


            <Box className="help-section" sx={{ textAlign: "center", mt: 4 }}>
              <HelpButton onClick={handleHelpClick} />
            </Box>
          </CardContent>
        </Card>


        <Box className="step-buttons" sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#FBC02D", color: "white", "&:hover": { backgroundColor: "#FDD835" } }}
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            <ArrowBackIcon />
          </Button>

          <Button
            variant="contained"
            sx={{ backgroundColor: "#43A047", color: "white", "&:hover": { backgroundColor: "#66BB6A" } }}
            onClick={handleNext}
          >
            {currentStep === pasos.length - 1 ? "Finalizar rutina" : <ArrowForwardIcon />}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default RutinaDetalleInfante;
