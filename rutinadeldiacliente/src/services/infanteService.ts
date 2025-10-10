import api from "./api";

export interface InfanteCreateDTO {
  nombre: string;
  usuarioId: number;
  infanteNivelId: number;
}

export interface InfanteReadDTO {
  id: number;
  nombre: string;
  usuarioId: number;
  infanteNivelId: number;
}

// Agregar infante
export const agregarInfante = async (infante: InfanteCreateDTO): Promise<{ mensaje: string; infanteId: number }> => {
  try {
    const response = await api.post<{ mensaje: string; infanteId: number }>("/Infante/agregarInfante", infante);
    return response.data;
  } catch (error) {
    console.error("Error agregando infante:", error);
    throw error;
  }
};

// Obtener todos los infantes de un usuario
export const obtenerInfantesPorUsuario = async (usuarioId: number): Promise<InfanteReadDTO[]> => {
  try {
    const response = await api.get<InfanteReadDTO[]>(`/Infante/obtenerInfantesPorUsuario/${usuarioId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener infantes para el usuario ${usuarioId}:`, error);
    throw error;
  }
};
