import api from "./api";

// Interface de paso
export interface Cancelacion {
  id?: number;
  fechaHora?: Date;
  rutinaID: number;
}

// Crear paso (orden e id no se envían, los genera el backend)
export const crearCancelacion = async (c: Omit<Cancelacion, "id" >): Promise<Cancelacion> => {
  const response = await api.post<Cancelacion>("/Cancelacion/crearCancelacion", c);
  return response.data;
};

