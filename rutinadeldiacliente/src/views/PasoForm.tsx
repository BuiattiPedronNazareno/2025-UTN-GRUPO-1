import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  crearPaso,
  actualizarPaso,
  obtenerPasosPorRutina,
} from "../services/pasoService";
import type { Paso } from "../services/pasoService";
import "../styles/views/CrearPaso.scss";

const PasoForm: React.FC = () => {
  const { rutinaId, pasoId } = useParams<{ rutinaId: string; pasoId?: string }>();
  const navigate = useNavigate();

  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState("");
  const [audio, setAudio] = useState("");

  const audios = ["audio1.mp3", "audio2.mp3", "audio3.mp3"];

  useEffect(() => {
    if (rutinaId && pasoId) {
      obtenerPasosPorRutina(Number(rutinaId))
        .then((lista) => {
          const paso = lista.find((p) => p.id === Number(pasoId));
          if (paso) {
            setDescripcion(paso.descripcion);
            setImagen(paso.imagen);
            setAudio(paso.audio || "");
          }
        })
        .catch((err) => console.error("Error cargando paso:", err));
    }
  }, [rutinaId, pasoId]);

  const handleGuardar = async () => {
    if (!rutinaId) return;
    try {
      if (pasoId) {
        await actualizarPaso(Number(pasoId), { descripcion, imagen, audio, estado: "Activo" });
        alert("Paso actualizado con éxito");
      } else {
        await crearPaso({ descripcion, imagen, audio, rutinaId: Number(rutinaId) });
        alert("Paso creado con éxito");
      }
      navigate(`/editar-rutina/${rutinaId}`);
    } catch (error) {
      console.error("Error guardando paso:", error);
    }
  };

  return (
    <div className="crear-paso-container">
      <h2>{pasoId ? "Editar Paso" : "Crear Paso"}</h2>

      <div className="form-group">
        <label>Descripción</label>
        <input
          type="text"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Escribe la descripción del paso"
        />
      </div>

      <div className="form-group">
        <label>Imagen</label>
        <select value={imagen} onChange={(e) => setImagen(e.target.value)}>
          <option value="">-- Selecciona una imagen --</option>
          <option value="jabon.jpg">Cepillo</option>
          <option value="toalla.jpg">Toalla</option>
          <option value="plato.jpg">Plato</option>
        </select>
      </div>

      <div className="form-group">
        <label>Audio</label>
        <select value={audio} onChange={(e) => setAudio(e.target.value)}>
          <option value="">-- Selecciona un audio --</option>
          {audios.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <div className="botones-accion">
        <button onClick={handleGuardar}>
          {pasoId ? "Guardar cambios" : "Guardar Paso"}
        </button>
        <button onClick={() => navigate(`/editar-rutina/${rutinaId}`)}>
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default PasoForm;
