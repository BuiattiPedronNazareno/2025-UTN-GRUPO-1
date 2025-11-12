import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { generarRutinaConIA, type RutinaIAResponse } from "../services/rutinaIAService";
import { obtenerInfantesPorUsuario } from "../services/infanteService";
import type { InfanteReadDTO } from "../services/infanteService";

interface GenerarRutinaIAModalProps {
  open: boolean;
  onClose: () => void;
  usuarioId: number;
  onRutinaGenerada: (rutina: RutinaIAResponse) => void;
}

const GenerarRutinaIAModal: React.FC<GenerarRutinaIAModalProps> = ({
  open,
  onClose,
  usuarioId,
  onRutinaGenerada,
}) => {
  const [idea, setIdea] = useState("");
  const [infanteSeleccionado, setInfanteSeleccionado] = useState<number | "">("");
  const [infantes, setInfantes] = useState<InfanteReadDTO[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [rutinaCreadaExito, setRutinaCreadaExito] = useState(false);

  useEffect(() => {
    if (open) {
      cargarInfantes();
    }
  }, [open]);

  const cargarInfantes = async () => {
    try {
      const data = await obtenerInfantesPorUsuario(usuarioId);
      setInfantes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Error al cargar los infantes");
      console.error(err);
    }
  };

  const handleGenerarRutina = async () => {
    if (!idea.trim()) {
      setError("Por favor describe la rutina que deseas crear");
      return;
    }

    if (!infanteSeleccionado) {
      setError("Por favor selecciona un infante");
      return;
    }

    setCargando(true);
    setError("");
    setRutinaCreadaExito(false);

    try {
      const rutina = await generarRutinaConIA(idea, infanteSeleccionado as number);
      setRutinaCreadaExito(true);
      
      setTimeout(() => {
        onRutinaGenerada(rutina);
        handleCerrar();
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error desconocido al generar rutina"
      );
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const handleCerrar = () => {
    setIdea("");
    setInfanteSeleccionado("");
    setError("");
    setRutinaCreadaExito(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCerrar} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1 }}>
        Generar Rutina con IA
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {rutinaCreadaExito ? (
          <Box sx={{ textAlign: "center", py: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#7FB069" }}>
              ¡Rutina creada exitosamente!
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              La rutina se ha asignado a {infantes.find(i => i.id === infanteSeleccionado)?.nombre}
            </Typography>
          </Box>
        ) : (
          <>
            {/* Selector de Infante */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Selecciona un infante</InputLabel>
              <Select
                value={infanteSeleccionado}
                onChange={(e) => setInfanteSeleccionado(e.target.value as number | "")}
                label="Selecciona un infante"
                disabled={cargando}
              >
                {infantes.map((infante) => (
                  <MenuItem key={infante.id} value={infante.id}>
                    {infante.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Campo de Idea */}
            <TextField
              label="¿Qué rutina deseas crear?"
              placeholder="Ej: Enseñar a mi hijo a lavarse las manos"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              multiline
              rows={4}
              fullWidth
              disabled={cargando}
              sx={{ mb: 2 }}
            />

            {/* Error */}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={handleCerrar} variant="outlined">
          {rutinaCreadaExito ? "Cerrar" : "Cancelar"}
        </Button>

        {!rutinaCreadaExito && (
          <Button
            onClick={handleGenerarRutina}
            variant="contained"
            disabled={cargando || !idea.trim() || !infanteSeleccionado}
            sx={{ backgroundColor: "#7FB069" }}
          >
            {cargando ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Generando...
              </>
            ) : (
              "Generar Rutina"
            )}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default GenerarRutinaIAModal;