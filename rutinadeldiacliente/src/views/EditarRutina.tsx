import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { obtenerPasosPorRutina, eliminarPaso } from "../services/pasoService";
import { actualizarRutina, obtenerRutinaPorId } from "../services/rutinaService";
import type { Paso } from "../services/pasoService";
import type { Rutina } from "../services/rutinaService";
import "../styles/views/CrearRutina.scss";

const EditarRutina: React.FC = () => {
  const { rutinaId } = useParams<{ rutinaId: string }>();
  const navigate = useNavigate();

  const [rutina, setRutina] = useState<Rutina | null>(null);
  const [pasos, setPasos] = useState<Paso[]>([]);
  const [nombre, setNombre] = useState("");
  const [imagen, setImagen] = useState("");

  // Cargar rutina simulada y pasos
  useEffect(() => {
  if (!rutinaId) return;

  obtenerRutinaPorId(Number(rutinaId))
    .then((data) => {
      setRutina(data);
      setNombre(data.nombre);
      setImagen(data.imagen);
    })
    .catch((err) => console.error("Error cargando rutina:", err));

  obtenerPasosPorRutina(Number(rutinaId))
    .then(setPasos)
    .catch((err) => console.error("Error cargando pasos:", err));
}, [rutinaId]);

  const handleActualizarRutina = async () => {
    if (!rutinaId) return;
    try {
      const rutinaActualizada = await actualizarRutina(Number(rutinaId), {
        nombre,
        imagen,
        estado: rutina?.estado ?? "Activo", // 👈 lo que corresponda
      });
      setRutina(rutinaActualizada);
      alert("Rutina actualizada con éxito");
    } catch (error) {
      console.error("Error al actualizar rutina:", error);
    }
  };

  const handleEliminarPaso = async (id: number) => {
    if (!rutinaId) return;
    try {
      await eliminarPaso(id);
      setPasos(pasos.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error al eliminar paso:", error);
    }
  };

  return (
    <div className="crear-rutina-container">
      <h2>Editar Rutina</h2>

      {/* Nombre e Imagen */}
      <div className="form-row">
        <div className="form-group">
          <label>Nombre de la Rutina:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Imagen:</label>
          <select value={imagen} onChange={(e) => setImagen(e.target.value)}>
            <option value="lavarse-las-manos.jpg">Lavarse las manos</option>
            <option value="comer.jpg">Comer</option>
            <option value="bañarse.jpg">Bañarse</option>
          </select>
        </div>
      </div>

      <div className="action-buttons">
        <button className="volver-btn" onClick={() => navigate("/adulto")}>
          Volver
        </button>
        <button className="crear-paso-btn" onClick={handleActualizarRutina}>
          Guardar Rutina
        </button>
      </div>

      {/* Lista de pasos */}
      <div className="pasos-agregados">
        <h3>Pasos:</h3>
        <ul>
          {pasos.map((p) => (
            <li key={p.id}>
              {p.descripcion} ({p.imagen}, {p.audio})
              <div>
                <button
                  onClick={() =>
                    navigate(`/rutina/${rutinaId}/paso/${p.id}`)
                  }
                >
                  Editar
                </button>
                <button onClick={() => handleEliminarPaso(p.id!)}>
                  Eliminar
                </button>
              </div>
            </li>
          ))}
          {pasos.length === 0 && <p className="empty">No hay pasos aún</p>}
        </ul>
        <button
          onClick={() => navigate(`/rutina/${rutinaId}/paso`)}
          className="crear-paso-btn"
        >
          Crear Paso Nuevo
        </button>
      </div>
    </div>
  );
};

export default EditarRutina;
