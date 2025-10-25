import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { crearRutina } from "../services/rutinaService";
import { obtenerCategorias } from "../services/categoriaService";
import type { Categoria } from "../services/categoriaService";
import "../styles/views/CrearRutina.scss";
import ChevronRight from "@mui/icons-material/ChevronRight";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import DeleteIcon from "@mui/icons-material/Delete";

const crearRutinaPrecargada: React.FC = () => {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [imagen, setImagen] = useState("");
  const [categoriaId, setCategoriaId] = useState<number | "">("");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [dia, setDia] = useState("");
  const [hora, setHora] = useState("");
  const [programaciones, setProgramaciones] = useState<{ dia: string; hora: string }[]>([]);

  const dias = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];
  const horas = [
    "07:30","08:00","08:30","09:00","09:30","10:00","10:30","11:00",
    "11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00",
    "15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00",
    "19:30","20:00","20:30","21:00","21:30","22:00","22:30"
  ];

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const cats = await obtenerCategorias();
        setCategorias(cats);
      } catch (error) {
        console.error("Error cargando categorías:", error);
      }
    };

    fetchCategorias();
  }, []);

  const agregarProgramacion = () => {
    if (dia && hora) {
      setProgramaciones([...programaciones, { dia, hora }]);
      setDia("");
      setHora("");
    }
  };

  const eliminarProgramacion = (index: number) => {
    setProgramaciones(programaciones.filter((_, i) => i !== index));
  };

  const handleCrearPaso = async () => {
    try {
      const nuevaRutina = await crearRutina({
        nombre,
        imagen,
        categoriaId: categoriaId === "" ? undefined : categoriaId,
        infanteId: undefined // siempre undefined para rutinas precargadas
      });
      navigate(`/crear-paso/${nuevaRutina.id}`);
    } catch (error) {
      console.error("Error al crear rutina:", error);
    }
  };

  return (
    <div className="crear-rutina-container">
      
      <button
        className="volver-btn"
        onClick={() => navigate("/adulto")}
      >
        <ChevronLeft className="volver-icon" />
        Volver
      </button>
      
      <h2 className="create-routine-title">Crear Rutina</h2>

      <div className="form-row">
        <div className="form-group">
          <label>Nombre de la Rutina:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Escribe el nombre"
          />
        </div>

        <div className="form-group">
          <label>Seleccionar Imagen:</label>
          <select value={imagen} onChange={(e) => setImagen(e.target.value)}>
            <option value="">-- Selecciona una imagen --</option>
            <option value="lavarse-las-manos.jpg">Lavarse las manos</option>
            <option value="comer.jpg">Comer</option>
            <option value="bañarse.jpg">Bañarse</option>
          </select>
        </div>

        <div className="form-group">
          <label>Seleccionar Categoría:</label>
          <select value={categoriaId} onChange={(e) => setCategoriaId(Number(e.target.value))}>
            <option value="">-- Selecciona una categoría --</option>
            {categorias.map(c => (
              <option key={c.id} value={c.id}>{c.descripcion}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Programar activación:</label>
        <div className="programacion-inputs">
          <select value={dia} onChange={(e) => setDia(e.target.value)}>
            <option value="">Día</option>
            {dias.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={hora} onChange={(e) => setHora(e.target.value)}>
            <option value="">Hora</option>
            {horas.map((h) => <option key={h} value={h}>{h}</option>)}
          </select>
          <button type="button" onClick={agregarProgramacion}>+</button>
        </div>

        <div className="programaciones-list">
          {programaciones.length === 0 && <p className="empty">Sin programaciones</p>}
          {programaciones.map((p, index) => (
            <div key={index} className="programacion-item">
              <span>{p.hora} hs - {p.dia}</span>
              <button
                className="trash-btn"
                onClick={() => eliminarProgramacion(index)}
                aria-label="Eliminar programación"
              >
                <DeleteIcon />
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        className="crear-paso-btn-inferior"
        onClick={handleCrearPaso}
      >
        Crear Paso
        <ChevronRight className="crear-paso-icon"/>
      </button>
    </div>
  );
};

export default crearRutinaPrecargada;
