"use client";

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { obtenerRutinaPorUsuario } from "../services/rutinaService";
import type { Rutina } from "../services/rutinaService";
import {
  obtenerRecordatorio,
  crearRecordatorio,
  actualizarRecordatorio,
  eliminarRecordatorio,
} from "../services/recordatorioService";
import { useAppContext } from "../context/AppContext";
import "../styles/views/RecordatorioAdulto.scss";

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
  const { usuarioActivo } = useAppContext();

  // Redirigir si no hay usuario activo
  useEffect(() => {
    if (!usuarioActivo) {
      navigate("/login");
    }
  }, [usuarioActivo, navigate]);

  // Determinar si estamos editando basándonos en la URL
  const isEditing = location.pathname.startsWith("/editar-recordatorio-adulto");
  const idURL = params.id;

  const title = isEditing ? "Editar Recordatorio" : "Agregar Recordatorio";

  // Función para obtener datos del recordatorio
  const fetchRecordatorio = async (id: string) => {
    if (!usuarioActivo?.id) {
      setError("No hay un usuario activo.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const rec = await obtenerRecordatorio(Number(usuarioActivo.id));
      console.log("Recordatorio data:", rec);

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
      if (!usuarioActivo?.id) return;

      const data = await obtenerRutinaPorUsuario(Number(usuarioActivo.id));
      setRoutines(data);
    } catch (err) {
      console.error("Error fetching all routines:", err);
    }
  };

  useEffect(() => {
    if (isEditing && idURL) {
      fetchRecordatorio(idURL);
    }
    if (!isEditing) {
      fetchAllRoutines();
    }
  }, [isEditing, idURL, usuarioActivo]);

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      if (isEditing) {
        const updateData = {
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
        const createData = {
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
      <div className="loading-container">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="recordatorio-adulto-container">
      <h2>{title}</h2>

      {/* Mostrar error si existe */}
      {error && <div className="error-message">{error}</div>}

      <div className="form-row">
        {/* Rutina - Solo en modo crear */}
        {!isEditing && (
          <div className="form-group">
            <label>Rutina:</label>
            <select
              value={routine}
              onChange={(e) => setRoutine(e.target.value)}
            >
              <option value="">-- Selecciona una rutina --</option>
              {routines?.map((r: Rutina) => (
                <option key={r.id} value={r.id}>
                  {r.nombre}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Frecuencia */}
        <div className="form-group">
          <label>Frecuencia:</label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          >
            {frequencies.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        {/* Día */}
        <div className="form-group">
          <label>Día de la Semana:</label>
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            disabled={frequency === "Diaria"}
          >
            {daysOfWeek.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Hora */}
        <div className="form-group">
          <label>Hora:</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
      </div>

      <div className="form-row">
        {/* Descripción */}
        <div className="form-group full-width">
          <label>Descripción:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Escribe una descripción"
          />
        </div>
      </div>

      <div className="form-row">
        {/* Color */}
        <div className="form-group">
          <label>Color:</label>
          <div className="color-picker-wrapper">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="color-picker"
            />
            <span className="color-value">{color}</span>
          </div>
        </div>

        {/* Sonido */}
        <div className="form-group">
          <label>Sonido:</label>
          <select value={sound} onChange={(e) => setSound(e.target.value)}>
            {sounds.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="action-buttons">
        <button
          className="volver-btn"
          onClick={() => navigate("/adulto")}
          disabled={loading}
        >
          Volver
        </button>
        <button
          className="guardar-btn"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : "Guardar"}
        </button>
        {isEditing && (
          <button
            className="eliminar-btn"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : "Eliminar"}
          </button>
        )}
      </div>
    </div>
  );
};

export default RecordatorioAdulto;