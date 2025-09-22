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
