import api from "./api";

export interface Rutina {
  id: number;
  nombre: string;
  imagen: string;
  estado?: string;
  fechaCreacion?: string;
}

export const crearRutina = async (
  rutina: Omit<Rutina, "id" | "estado" | "fechaCreacion">
): Promise<Rutina> => {
  const response = await api.post<Rutina>("/Rutina/crearRutina", rutina);
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

// Actualizar rutina
export const actualizarRutina = async (
  id: number,
  rutina: Omit<Rutina, "id" | "fechaCreacion" >
): Promise<Rutina> => {
  const response = await api.put<Rutina>(`/Paso/actualizarPaso/${id}`, rutina);
  return response.data;
};