import api from "./api";

// Interface de paso
export interface Paso {
  id?: number;
  orden?: number;
  descripcion: string;
  estado?: string;
  imagen: string;
  audio?: string;
  rutinaId: number;
}

// Crear paso (orden e id no se envían, los genera el backend)
export const crearPaso = async (paso: Omit<Paso, "id" | "orden" | "estado">): Promise<Paso> => {
  const response = await api.post<Paso>("/Paso/crearPaso", paso);
  return response.data;
};

// Obtener pasos por rutina
export const obtenerPasosPorRutina = async (rutinaId: number): Promise<Paso[]> => {
  const response = await api.get<Paso[]>(`/Paso/porRutina/${rutinaId}`);
  return response.data;
};

// Actualizar paso
export const actualizarPaso = async (
  id: number,
  paso: Omit<Paso, "id" | "orden" | "rutinaId">
): Promise<Paso> => {
  const response = await api.put<Paso>(`/Paso/actualizarPaso/${id}`, paso);
  return response.data;
};

// Eliminar paso
export const eliminarPaso = async (id: number): Promise<void> => {
  await api.delete(`/Paso/eliminarPaso/${id}`);
};