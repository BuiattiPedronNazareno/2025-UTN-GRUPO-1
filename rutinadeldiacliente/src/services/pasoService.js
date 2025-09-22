import api from "./api";

export const crearPaso = async (paso) => {
  // paso = { descripcion: string, imagen: string (URL), audio: string (URL), rutinaId: number }
  const response = await api.post("/Paso/crearPaso", paso);
  return response.data; // devuelve el paso creado
};

export const obtenerPasosPorRutina = async (rutinaId) => {
  const response = await api.get(`/Paso/obtenerPasosPorRutina/${rutinaId}`);
  return response.data; // devuelve un array de pasos
};
