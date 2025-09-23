import api from "./api";

export interface InfanteCreateDTO {
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