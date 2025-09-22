import api from "./api";

// Interface de paso
export interface Paso {
  id?: number;
  descripcion: string;
  imagen: string;
  audio?: string;
  rutinaId: number;
}

// Crear paso
export const crearPaso = async (paso: Paso): Promise<Paso> => {
  const response = await api.post<Paso>("/Paso/crearPaso", paso);
  return response.data;
};

// Obtener pasos por rutina
export const obtenerPasosPorRutina = async (rutinaId: number): Promise<Paso[]> => {
  const response = await api.get<Paso[]>(`/Paso/obtenerPasosPorRutina/${rutinaId}`);
  return response.data;
};
