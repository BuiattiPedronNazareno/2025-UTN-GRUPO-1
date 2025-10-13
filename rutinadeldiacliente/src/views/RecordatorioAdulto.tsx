"use client";

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import DeleteIcon from "@mui/icons-material/Delete";
import { obtenerRutinas } from "../services/rutinaService";
import type { Rutina } from "../services/rutinaService";
import {
  obtenerRecordatorio,
  crearRecordatorio,
  actualizarRecordatorio,
  eliminarRecordatorio,
} from "../services/recordatorioService";
import "../styles/views/RecordatorioAdulto.scss";
import ChevronRight from "@mui/icons-material/ChevronRight";


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
  const [color, setColor] = useState("#4A90A4");
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
      setColor(rec.color || "#4A90A4");
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
    <Box className="recordatorio-adulto-container">

      <button className="volver-btn-superior" onClick={() => navigate("/adulto")}>
        <ChevronLeft className="volver-icon" />
        <span className="volver-text">Volver</span>
      </button>

      <h2 className="add-reminder-title">Agregar Recordatorio</h2>

      {/* Mostrar error si existe */}
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* Rutina */}
      {!isEditing && (
        <div className="form-group">
          <label>Seleccionar Rutina</label>
          <select
            value={routine}
            onChange={(e) => setRoutine(e.target.value)}
          >
            <option value="">-- Selecciona una rutina --</option>
            {routines.map((r) => (
              <option key={r.id} value={r.id}>{r.nombre}</option>
            ))}
          </select>
        </div>
      )}

      {/* Frecuencia */}
      <div className="form-group">
        <label>Frecuencia</label>
        <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
          {frequencies.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>

      {/* Día y Hora */}
      <div className="form-row">
        <div className="form-group">
          <label>Día de la semana</label>
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            disabled={frequency === "Diaria"}
          >
            {daysOfWeek.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Hora</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
      </div>

      {/* Descripción */}
      <div className="form-group">
        <label>Descripción</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Escribe una descripción"
        />
      </div>

      {/* Color */}
      <div className="form-group color-picker">
        <label>Color</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </div>

      {/* Sonido */}
      <div className="form-group">
        <label>Sonido</label>
        <select value={sound} onChange={(e) => setSound(e.target.value)}>
          {sounds.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Botón Guardar */}
      <button className="guardar-btn" onClick={handleSave} disabled={loading}>
        <span className="guardar-text">{loading ? "Guardando..." : "Guardar"}</span>
        {!loading && <ChevronRight className="guardar-icon" />}
      </button>

      {/* Botón Eliminar */}
      {isEditing && (
        <button className="eliminar-btn" onClick={handleDelete} disabled={loading}>
          <span className="eliminar-text">{loading ? "Eliminando..." : "Eliminar"}</span>
          {!loading && <DeleteIcon className="eliminar-icon" />}
        </button>
      )}
    </Box>
  );
};

export default RecordatorioAdulto;
