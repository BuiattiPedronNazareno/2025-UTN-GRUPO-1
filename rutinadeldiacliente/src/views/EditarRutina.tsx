import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { obtenerPasosPorRutina, eliminarPaso } from "../services/pasoService";
import { actualizarRutina, obtenerRutinaPorId } from "../services/rutinaService";
import { obtenerCategorias } from "../services/categoriaService";
import { obtenerInfantesPorUsuario } from "../services/infanteService";
import type { Paso } from "../services/pasoService";
import type { Rutina } from "../services/rutinaService";
import type { Categoria } from "../services/categoriaService";
import type { InfanteGetDTO } from "../services/UsuarioService";
import { useAppContext } from "../context/AppContext";
import "../styles/views/CrearRutina.scss";
import "../styles/views/EditarRutina.scss";

const EditarRutina: React.FC = () => {
  const { rutinaId } = useParams<{ rutinaId: string }>();
  const navigate = useNavigate();
  const { usuarioActivo } = useAppContext();

  const [rutina, setRutina] = useState<Rutina | null>(null);
  const [pasos, setPasos] = useState<Paso[]>([]);
  const [nombre, setNombre] = useState("");
  const [imagen, setImagen] = useState("");
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [infanteId, setInfanteId] = useState<number | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [infantes, setInfantes] = useState<InfanteGetDTO[]>([]);

  // Cargar rutina, pasos, categorías e infantes
  useEffect(() => {
    if (!rutinaId) return;

    obtenerRutinaPorId(Number(rutinaId))
      .then((data) => {
        setRutina(data);
        setNombre(data.nombre);
        setImagen(data.imagen);
        setCategoriaId(data.categoriaId ?? null);
        setInfanteId(data.infanteId ?? null);
      })
      .catch((err) => console.error("Error cargando rutina:", err));

    obtenerPasosPorRutina(Number(rutinaId))
      .then(setPasos)
      .catch((err) => console.error("Error cargando pasos:", err));

    obtenerCategorias()
      .then(setCategorias)
      .catch((err) => console.error("Error cargando categorías:", err));

    if (usuarioActivo) {
      obtenerInfantesPorUsuario(usuarioActivo.id)
        .then(setInfantes)
        .catch((err) => console.error("Error cargando infantes:", err));
    }
  }, [rutinaId, usuarioActivo]);

  const handleActualizarRutina = async () => {
    if (!rutinaId) return;

    try {
      const rutinaActualizada = await actualizarRutina(Number(rutinaId), {
        nombre,
        imagen,
        estado: rutina?.estado ?? "Activa",
        categoriaId: categoriaId ?? 0,
        infanteId: infanteId ?? undefined,
      });
      setRutina(rutinaActualizada);
      alert("Rutina actualizada con éxito");
      navigate("/adulto");
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

      {/* Nombre, Imagen, Categoría e Infante */}
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
            <option value="">-- Selecciona una imagen --</option>
            <option value="lavarse-las-manos.jpg">Lavarse las manos</option>
            <option value="comer.jpg">Comer</option>
            <option value="bañarse.jpg">Bañarse</option>
          </select>
        </div>

        <div className="form-group">
          <label>Categoría:</label>
          <select
            value={categoriaId ?? ""}
            onChange={(e) => setCategoriaId(Number(e.target.value))}
          >
            <option value="">-- Selecciona una categoría --</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.descripcion}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Infante:</label>
          <select
            value={infanteId ?? ""}
            onChange={(e) => setInfanteId(Number(e.target.value))}
          >
            <option value="">-- Selecciona un infante --</option>
            {infantes.map((i) => (
              <option key={i.id} value={i.id}>
                {i.nombre}
              </option>
            ))}
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
              <span>{p.descripcion}</span>
              <div className="paso-actions">
                <button
                  onClick={() => navigate(`/rutina/${rutinaId}/paso/${p.id}`)}
                >
                  Editar
                </button>
                <button onClick={() => handleEliminarPaso(p.id!)}>Eliminar</button>
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
