import api from "./api";

export interface PasoIADTO {
  orden: number;
  descripcion: string;
  imagen: string;
}

export interface RutinaIARequest {
  idea: string;
  infanteId: number;
}

export interface RutinaIAResponse {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  infanteId: number;
  pasos: PasoIADTO[];
}

export const generarRutinaConIA = async (
  idea: string,
  infanteId: number
): Promise<RutinaIAResponse> => {
  const response = await api.post<RutinaIAResponse>("/api/rutinaIA/generar", {
    idea,
    infanteId,
  });
  return response.data;
};