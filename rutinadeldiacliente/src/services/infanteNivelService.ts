import api from "./api";

export interface InfanteNivelCreateDTO {
  descripcion: string;
}

export interface InfanteNivelGetDTO {
  id: number,  
  descripcion: string;
}

// Crear InfanteNivel
export const crearInfanteNivel = async (nivel: InfanteNivelCreateDTO): Promise<InfanteNivelCreateDTO> => {
  const response = await api.post<InfanteNivelCreateDTO>("/InfanteNivel/crear", nivel);
  return response.data;
};

// Obtener todos los InfanteNiveles
export const obtenerInfanteNiveles = async (): Promise<InfanteNivelGetDTO[]> => {
  const response = await api.get<InfanteNivelGetDTO[]>("/InfanteNivel");
  return response.data;
};

// Obtener InfanteNivel por id
export const obtenerInfanteNivelPorId = async (id: number): Promise<InfanteNivelGetDTO> => {
  const response = await api.get<InfanteNivelGetDTO>(`/InfanteNivel/${id}`);
  return response.data;
};