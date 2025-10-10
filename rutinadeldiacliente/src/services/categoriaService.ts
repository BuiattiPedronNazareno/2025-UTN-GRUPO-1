import api from "./api";

// DTOs
export interface CategoriaReadDTO {
  id: number;
  descripcion: string;
}

export interface CategoriaCreateDTO {
  descripcion: string;
}

export interface Categoria {
  id: number;
  descripcion: string;
}

// Obtener todas las categorías
export const obtenerCategorias = async (): Promise<CategoriaReadDTO[]> => {
  const response = await api.get<CategoriaReadDTO[]>("/Categoria/obtenerCategorias");
  return response.data;
};

// Obtener categoría por id
export const obtenerCategoriaPorId = async (id: number): Promise<CategoriaReadDTO> => {
  const response = await api.get<CategoriaReadDTO>(`/Categoria/obtenerCategoria/${id}`);
  return response.data;
};

// Crear nueva categoría
export const crearCategoria = async (
  categoria: CategoriaCreateDTO
): Promise<CategoriaReadDTO> => {
  console.log("Creando categoría:", categoria);
  const response = await api.post<CategoriaReadDTO>("/Categoria/crearCategoria", categoria);
  console.log("Respuesta de crearCategoria:", response.data);
  return response.data;
};
