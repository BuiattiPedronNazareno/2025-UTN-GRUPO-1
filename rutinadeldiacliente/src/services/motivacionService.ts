import api from "./api";

export interface MotivacionReadDTO {
  id: number;
  descripcion: string;
  fecha: string;
}

export interface MotivacionCreateDTO {
  rutinaId: number;
  infanteId: number;
}

export interface MotivacionResponseDTO {
  motivacion: MotivacionReadDTO;
  totalMotivaciones: number;
  subioNivel: boolean;
  nuevoNivel: string;
}


// POST: Crear motivación
export const crearMotivacion = async (
  motivacion: MotivacionCreateDTO
): Promise<MotivacionResponseDTO> => {
  console.log("Creando motivación:", motivacion);
  const response = await api.post<MotivacionResponseDTO>("/Motivacion/crearMotivacion", motivacion);
  console.log("Respuesta de crearMotivacion:", response.data);
  return response.data;
};

// GET: Motivaciones de un infante
export const obtenerMotivacionesPorInfante = async (
  infanteId: number
): Promise<MotivacionReadDTO[]> => {
  const response = await api.get<MotivacionReadDTO[]>(`/Motivacion/obtenerMotivacionesInfante/${infanteId}`);
  return response.data;
};

