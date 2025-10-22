import api from "./api";

export interface Rutina {
  id: number;
  nombre: string;
  imagen: string;
  estado?: string;
  fechaCreacion?: string;
  categoriaId?: number;
  infanteId?: number;
}

export const crearRutina = async (
  rutina: Omit<Rutina, "id" | "estado" | "fechaCreacion">
): Promise<Rutina> => {
  console.log("Creando rutina:", rutina);
  const response = await api.post<Rutina>("/Rutina/crearRutina", rutina);
  console.log("Respuesta de crearRutina:", response.data);
  return response.data;
};

export const obtenerRutinas = async (): Promise<Rutina[]> => {
  const response = await api.get<Rutina[]>("/Rutina/obtenerRutinas");
  return response.data;
};

export const obtenerRutinaPorId = async (id: number): Promise<Rutina> => {
  const response = await api.get<Rutina>(`/Rutina/obtenerRutina/${id}`);
  return response.data;
};

export const obtenerRutinaPorInfante = async (infanteId: number): Promise<Rutina[]> => {
  console.log("Obteniendo rutinas para infante ID:", infanteId);
  const response = await api.get<Rutina[]>(`/Rutina/obtenerRutinaInfante/${infanteId}`);
  return response.data;
};

export const obtenerRutinaPorUsuario = async (usuarioId: number): Promise<Rutina[]> => {
  console.log("Obteniendo rutinas para usuario ID:", usuarioId);
  const response = await api.get<Rutina[]>(`/Rutina/obtenerRutinaUsuario/${usuarioId}`);
  console.log("Respuesta de obtenerRutinaPorUsuario:", response.data);
  return response.data;
};

// Actualizar rutina
export const actualizarRutina = async (
  id: number,
  rutina: Omit<Rutina, "id" | "fechaCreacion">
): Promise<Rutina> => {
  const response = await api.put<Rutina>(`/Rutina/actualizarRutina/${id}`, rutina);
  return response.data;
};

export const cambiarVisibilidadRutina = async (
  id: number,
  rutina: Omit<Rutina, "id" | "fechaCreacion" | "nombre" | "imagen">
): Promise<Rutina> => {
  const response = await api.put<Rutina>(`/Rutina/cambiarVisibilidadRutina/${id}`, rutina);
  // console.log("Respuesta de cambiarVisibilidadRutina:", response.data);
  return response.data;
};
