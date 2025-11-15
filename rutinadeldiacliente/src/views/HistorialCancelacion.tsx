"use client";

import { useEffect, useState } from "react";
import { Button, Box, Typography, Snackbar, Alert } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import {
  obtenerCancelacionesPorUsuario,
  marcarCancelacionesComoLeidas,
  hayCancelacionesSinLeer
} from "../services/cancelacionService";
import { useAppContext } from "../context/AppContext";
import "../styles/views/HistorialCancelacion.scss";

const HistorialCancelacion = () => {
  const navigate = useNavigate();
  const { usuarioActivo } = useAppContext();
  const [cancelaciones, setCancelaciones] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [marcadasComoLeidas, setMarcadasComoLeidas] = useState(false);
  const [ultimaLectura, setUltimaLectura] = useState(0); 

  useEffect(() => {
    async function fetchData() {
      if (!usuarioActivo) return;
      const data = await obtenerCancelacionesPorUsuario(usuarioActivo.id);
      

      const ordenadas = data.sort((a, b) => {
        return new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime();
      });
      
      setCancelaciones(ordenadas);
      
      const lastRead = Number(localStorage.getItem(`cancelaciones_leidas_${usuarioActivo.id}`) || "0");
      setUltimaLectura(lastRead);
    }
    fetchData();
  }, [usuarioActivo]);

  const handleMarcarComoLeidas = () => {
    if (!usuarioActivo) return;
    marcarCancelacionesComoLeidas(usuarioActivo.id);
    
    setMarcadasComoLeidas(true);
    setSnackbarOpen(true);

    setUltimaLectura(Date.now());
    
    setTimeout(() => {
      navigate(-1);
    }, 1500);
  };

  const estaLeida = (fechaHora: string) => {
    return new Date(fechaHora).getTime() <= ultimaLectura;
  };

  return (
    <Box className="historial-container">

      <Button
        className="back-button"
        onClick={() => navigate(-1)}
      >
        <ArrowBackIcon />
        Volver
      </Button>

      <Typography variant="h4" className="historial-title">
        Historial de Cancelación
      </Typography>

      <Box className="cancelaciones-list">
        {cancelaciones.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: 'center', mt: 3, fontSize: '1.1rem' }}>
            No hay cancelaciones en los últimos 30 días
          </Typography>
        ) : (
          cancelaciones.map((c) => (
            <Box 
              key={c.id} 
              className={`cancelacion-card ${estaLeida(c.fechaHora) ? 'cancelacion-card--leida' : ''}`}
              sx={{
                opacity: estaLeida(c.fechaHora) ? 0.6 : 1,
                transition: 'opacity 0.3s ease'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography className="cancelacion-text">
                  {c.nombreInfante} canceló la rutina "{c.nombreRutina}"
                </Typography>
                {!estaLeida(c.fechaHora) && (
                  <span style={{ 
                    backgroundColor: '#ff5252', 
                    color: 'white', 
                    padding: '2px 6px', 
                    borderRadius: '10px', 
                    fontSize: '0.7rem',
                    fontWeight: 'bold'
                  }}>
                    NUEVA
                  </span>
                )}
              </Box>
              <Typography className="cancelacion-fecha">
                {new Date(c.fechaHora).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                {" "}
                {new Date(c.fechaHora).toLocaleDateString()}
              </Typography>
            </Box>
          ))
        )}
      </Box>

      {cancelaciones.length > 0 && !marcadasComoLeidas && (
        <Button
          className="mark-read-button"
          onClick={handleMarcarComoLeidas}
        >
          Marcar Todas Como Leídas
        </Button>
      )}

      {marcadasComoLeidas && (
        <Typography 
          variant="body1" 
          sx={{ 
            textAlign: 'center', 
            mt: 3, 
            color: '#4caf50',
            fontSize: '1.1rem',
            fontWeight: 'bold'
          }}
        >
          ✓ Cancelaciones marcadas como leídas
        </Typography>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Cancelaciones marcadas como leídas
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default HistorialCancelacion;