"use client";

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { obtenerRutinas } from "../services/rutinaService";
import type { Rutina } from "../services/rutinaService";
import {
  obtenerRecordatorio,
  crearRecordatorio,
  actualizarRecordatorio,
  eliminarRecordatorio,
} from "../services/recordatorioService";

const frequencies = ["Diaria", "Semanal"];
const daysOfWeek = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];
const sounds = ["Campanita suave", "Alarma fuerte", "Sonido relajante"];

const RecordatorioAdulto: React.FC = () => {
  const [idrec, setIdrec] = useState(0);
  const [rutinaId, setRutinaId] = useState(0);
  const [routines, setRoutines] = useState<Rutina[]>([]);
  const [routine, setRoutine] = useState("");
  const [frequency, setFrequency] = useState(frequencies[1]);
  const [day, setDay] = useState(daysOfWeek[0]);
  const [time, setTime] = useState("08:00");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#ff0000");
  const [sound, setSound] = useState(sounds[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  // Determinar si estamos editando basándonos en la URL
  const isEditing = location.pathname.startsWith("/editar-recordatorio-adulto");
  const idURL = params.id;

  const title = isEditing ? "Editar Recordatorio" : "Agregar Recordatorio";

  // Función para obtener datos del recordatorio
  const fetchRecordatorio = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const rec = await obtenerRecordatorio(Number(id));
      console.log("Recordatorio data:", rec);

      // Establecer los valores por defecto con los datos del backend
      setIdrec(rec.id || 0);
      setRutinaId(rec.rutinaId || 0);
      setFrequency(rec.frecuencia || frequencies[1]);
      setDay(rec.diaSemana || daysOfWeek[0]);
      setTime(rec.hora || "08:00");
      setDescription(rec.descripcion || "");
      setColor(rec.color || "#ff0000");
      setSound(rec.sonido || sounds[0]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      console.error("Error fetching recordatorio:", err);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener todas las rutinas
  const fetchAllRoutines = async () => {
    try {
      const data = await obtenerRutinas();
      setRoutines(data);
    } catch (err) {
      console.error("Error fetching all routines:", err);
    }
  };

  // useEffect para cargar datos cuando estamos editando
  useEffect(() => {
    if (isEditing && idURL) {
      fetchRecordatorio(idURL);
    }
    if (!isEditing) {
      fetchAllRoutines();
    }
  }, [isEditing, idURL]);

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      if (isEditing) {
        const updateData: UpdateRecordatorioData = {
          descripcion: description,
          frecuencia: frequency,
          hora: time,
          diaSemana: day,
          sonido: sound,
          color: color,
          rutinaId: Number(rutinaId),
        };

        console.log("Updating recordatorio data:", updateData);
        await actualizarRecordatorio(idrec, updateData);
      } else {
        const createData: CreateRecordatorioData = {
          descripcion: description,
          frecuencia: frequency,
          hora: time,
          diaSemana: day,
          sonido: sound,
          color: color,
          rutinaId: Number(routine),
        };

        console.log("Creating recordatorio data:", createData);
        await crearRecordatorio(createData);
      }

      // Redireccionar después de guardar exitosamente
      navigate("/adulto", {
        state: {
          message: isEditing
            ? "Recordatorio actualizado exitosamente"
            : "Recordatorio creado exitosamente",
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      console.error("Error saving recordatorio:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditing || !idURL) return;

    if (window.confirm("¿Estás seguro de eliminar este recordatorio?")) {
      try {
        setLoading(true);
        setError(null);

        await eliminarRecordatorio(idrec);

        // Redireccionar después de eliminar exitosamente
        navigate("/adulto", {
          state: { message: "Recordatorio eliminado exitosamente" },
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
        console.error("Error deleting recordatorio:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Mostrar loading mientras se cargan los datos
  if (loading && isEditing) {
    return (
      <Box
        sx={{
          bgcolor: "#cce5e5",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#cce5e5", height: "100vh", p: 2 }}>
      {/* AppBar con volver */}
      <AppBar position="static" sx={{ bgcolor: "orange" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate("/adulto")}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">Volver</Typography>
        </Toolbar>
      </AppBar>

      <Typography variant="h5" sx={{ mt: 2, mb: 2 }}>
        {title}
      </Typography>

      {/* Mostrar error si existe */}
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* Rutina */}
      {!isEditing && (
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel shrink>Rutina</InputLabel>
          <Select
            label="Rutina"
            value={routine}
            onChange={(e) => setRoutine(e.target.value ? e.target.value : "")}
          >
            {routines?.map((r: Rutina) => (
              <MenuItem key={r.id} value={r.id}>
                {r.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* Frecuencia */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel shrink>Frecuencia</InputLabel>
        <Select
          label="Frecuencia"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
        >
          {frequencies.map((f) => (
            <MenuItem key={f} value={f}>
              {f}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Día + Hora */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <FormControl fullWidth>
          <InputLabel shrink>Día Semana</InputLabel>
          <Select
            label="Dia semana"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            disabled={frequency === "Diaria"}
          >
            {daysOfWeek.map((d) => (
              <MenuItem key={d} value={d}>
                {d}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Hora"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          InputLabelProps={{ shrink: true }}
          inputProps={{ step: 300 }}
          fullWidth
          InputProps={{
            endAdornment: <AccessTimeIcon />,
          }}
        />
      </Box>

      {/* Descripción */}
      <TextField
        label="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
        InputLabelProps={{ shrink: true }}
      />

      {/* Color */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <Typography>Color</Typography>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          style={{ width: "100%", height: "40px", border: "none" }}
        />
      </Box>

      {/* Sonido */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel shrink>Sonido</InputLabel>
        <Select
          label="Sonido"
          value={sound}
          onChange={(e) => setSound(e.target.value)}
        >
          {sounds.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Botón Guardar */}
      <Button
        variant="contained"
        fullWidth
        sx={{ bgcolor: "green", color: "white", fontSize: "16px" }}
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : "Guardar"}
      </Button>

      {/* Botón Eliminar */}
      {isEditing && (
        <Button
          variant="contained"
          fullWidth
          sx={{ bgcolor: "red", color: "white", fontSize: "16px", mt: 2 }}
          onClick={handleDelete}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Eliminar"}
        </Button>
      )}
    </Box>
  );
};

export default RecordatorioAdulto;
