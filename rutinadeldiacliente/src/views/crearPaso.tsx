import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { crearPaso, obtenerPasosPorRutina } from "../services/pasoService";
import type { Paso } from "../services/pasoService";
import "../styles/views/CrearPaso.scss"; // estilos SCSS

const CrearPaso: React.FC = () => {
  const { id: rutinaId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState("");
  const [audio, setAudio] = useState("");
  const [pasos, setPasos] = useState<Paso[]>([]);

  const audios = ["audio1.mp3", "audio2.mp3", "audio3.mp3"];

  // cargar pasos existentes
  useEffect(() => {
    if (rutinaId) {
      obtenerPasosPorRutina(Number(rutinaId))
        .then(setPasos)
        .catch((err) => console.error("Error obteniendo pasos:", err));
    }
  }, [rutinaId]);

  const handleGuardar = async (volverInicio: boolean) => {
    if (!rutinaId) return;

    try {
      const nuevoPaso: Paso = {
        descripcion,
        imagen,
        audio,
        rutinaId: Number(rutinaId),
      };

      const pasoCreado = await crearPaso(nuevoPaso);
      setPasos([...pasos, pasoCreado]);

      if (volverInicio) {
        navigate("/adulto"); 
      } else {
        setDescripcion("");
        setImagen("");
        setAudio("");
      }
    } catch (error) {
      console.error("Error al guardar paso:", error);
    }
  };

  return (
    <div className="crear-paso-container">
      <h2>Crear Paso</h2>

      {/* Descripción */}
      <div className="form-group">
        <label>Descripción:</label>
        <input
          type="text"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Escribe la descripción del paso"
        />
      </div>

      {/* Imagen */}
      <div className="form-group">
        <label>Seleccionar Imagen:</label>
        <select value={imagen} onChange={(e) => setImagen(e.target.value)}>
          <option value="">-- Selecciona una imagen --</option>
          <option value="jabon.jpg">Cepillo</option>
          <option value="toalla.jpg">Toalla</option>
          <option value="plato.jpg">Plato</option>
        </select>
      </div>

      {/* Audio */}
      <div className="form-group">
        <label>Seleccionar Audio:</label>
        <select value={audio} onChange={(e) => setAudio(e.target.value)}>
          <option value="">-- Selecciona un audio --</option>
          {audios.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      {/* Botones */}
      <div className="botones-accion">
        <button onClick={() => handleGuardar(true)}>Guardar y volver al inicio</button>
        <button onClick={() => handleGuardar(false)}>Guardar y crear otro</button>
      </div>

      {/* Lista de pasos agregados */}
      <div className="pasos-agregados">
        <h3>Pasos agregados:</h3>
        <ul>
          {pasos.map((p) => (
            <li key={p.id}>
              {p.descripcion} ({p.imagen}, {p.audio})
            </li>
          ))}
          {pasos.length === 0 && <p className="empty">Todavía no hay pasos</p>}
        </ul>
      </div>
    </div>
  );
};

export default CrearPaso;
