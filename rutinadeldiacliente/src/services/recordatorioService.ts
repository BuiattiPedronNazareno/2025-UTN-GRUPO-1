import api from "./api";

export interface RecordatorioRutina {
  id: number;
  descripcion: string;
  frecuencia: string;
  hora: string;
  diaSemana: string;
  sonido: string;
  color: string;
  rutinaId: number;
  rutinaNombre: string;
}

export interface Rutina {
  id: number;
  nombre: string;
  imagen: string;
}

export interface Recordatorio {
  id: number;
  descripcion: string;
  frecuencia: string;
  hora: string;
  diaSemana: string;
  color: string;
  sonido: string;
}

// 🔹 Obtener recordatorios de una rutina específica
export const obtenerRecordatoriosPorRutina = async (
  rutinaId: number,
): Promise<RecordatorioRutina[]> => {
  try {
    const res = await api.get<RecordatorioRutina[]>(
      `/Recordatorio/porRutina/${rutinaId}`,
    );
    return res.data;
  } catch (error) {
    console.error("Error obteniendo recordatorios:", error);
    return [];
  }
};

// 🔹 Obtener información de una rutina específica
export const obtenerRutinaPorId = async (
  rutinaId: number,
): Promise<Rutina | null> => {
  try {
    const res = await api.get<Rutina>(`/Rutina/${rutinaId}`);
    return res.data;
  } catch (error) {
    console.error("Error obteniendo rutina:", error);
    return null;
  }
};

// 🔹 Eliminar recordatorio
export const eliminarRecordatorio = async (
  recordatorioId: number,
): Promise<boolean> => {
  try {
    const res = await api.delete(
      `/Recordatorio/eliminarRecordatorio/${recordatorioId}`,
    );
    return res.status === 200 || res.status === 204;
  } catch (error) {
    console.error("Error eliminando recordatorio:", error);
    return false;
  }
};

// 🔹 Verificar si una rutina tiene al menos un recordatorio
export const verificarRecordatorio = async (
  rutinaId: number,
): Promise<boolean> => {
  try {
    const res = await api.get<RecordatorioRutina[]>(
      `/Recordatorio/porRutina/${rutinaId}`,
    );
    return Array.isArray(res.data) && res.data.length > 0;
  } catch (error) {
    console.error("Error verificando recordatorio:", error);
    return false;
  }
};

export const obtenerRecordatorio = async (
  id: number,
): Promise<RecordatorioRutina> => {
  const response = await api.get<RecordatorioRutina>(`/Recordatorio/${id}`);
  return response.data;
};

export const crearRecordatorio = async (
  recordatorio: Omit<Recordatorio, 'id'>,
): Promise<RecordatorioRutina> => {
  const response = await api.post<RecordatorioRutina>(
    "/Recordatorio/crearRecordatorio",
    recordatorio,
  );
  return response.data;
};

export const actualizarRecordatorio = async (
  id: number,
  recordatorio: Omit<Recordatorio, 'id'>,
): Promise<RecordatorioRutina> => {
  const response = await api.put<RecordatorioRutina>(
    `/Recordatorio/actualizarRecordatorio/${id}`,
    recordatorio,
  );
  return response.data;
};