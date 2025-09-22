import api from "./api"; 

export const crearRutina = async (rutina) => {
  // rutina = { nombre: string, imagen: string (URL) }
  const response = await api.post("/Rutina/crearRutina", rutina);
  return response.data; // devuelve la rutina recién creada con su id
};

export const obtenerRutinas = async () => {
  const response = await api.get("/Rutina/obtenerRutinas");
  return response.data; 
};
