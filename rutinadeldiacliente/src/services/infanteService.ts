import api from "./api";

export interface InfanteCreateDTO {
  nombre: string;
  usuarioId: number;
  infanteNivelId: number;
  categoriaIds: number[];
}

export interface InfanteReadDTO {
  id: number;
  nombre: string;
  usuarioId: number;
  infanteNivelId: number;
}

// Agregar infante
export const agregarInfante = async (
  infante: InfanteCreateDTO
): Promise<{ mensaje: string; infanteId: number; rutinasGeneradas?: any[] }> => {
  try {
    const response = await api.post<{ mensaje: string; infanteId: number; rutinasGeneradas?: any[] }>(
      "/Infante/agregarInfante",
      infante
    );
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

// Obtener estado del tutorial para el infante
export const obtenerTutorialStatusInfante = async (infanteId: number): Promise<{ showInfantTutorial: boolean }> => {
  try {
    const response = await api.get<{ showInfantTutorial: boolean }>(`/Infante/tutorial-status/${infanteId}`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo estado de tutorial infante:", error);
    throw error;
  }
};

// Marcar tutorial infante como completado
export const completarTutorialInfante = async (infanteId: number): Promise<void> => {
  try {
    await api.post(`/Infante/tutorial-completed/${infanteId}`);
  } catch (error) {
    console.error("Error marcando tutorial infante como completado:", error);
    throw error;
  }
};
