import api from "./api";

export interface UsuarioCreateDTO {
  email: string;
  clave: string;
  telefono: string;
  pin: number;
}

export interface UsuarioLoginDTO {
  email: string;
  clave: string;
}

export interface UsuarioGetDTO {
  id: number
  email: string
  telefono: string
  pinAdulto: number
  infantes: InfanteGetDTO[]
}

export interface InfanteGetDTO {
  id: number
  nombre: string
  infanteNivelId: number
}

// Crear usuario
export const registrarUsuario = async (usuario: UsuarioCreateDTO): Promise<UsuarioGetDTO> => {
  try {
    const response = await api.post<UsuarioGetDTO>("/Usuario/registrarUsuario", usuario);
    return response.data;
  } catch (error) {
    console.error("Error registrando usuario:", error);
    throw error;
  }
};

// Obtener usuario por id
export const obtenerUsuarioPorId = async (id: number): Promise<UsuarioGetDTO> => {
  try {
    const response = await api.get<UsuarioGetDTO>(`/Usuario/obtenerUsuario/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo usuario:", error);
    throw error;
  }
};

// Login
export const loginUsuario = async (login: UsuarioLoginDTO): Promise<UsuarioGetDTO> => {
  try {
    const response = await api.post<UsuarioGetDTO>("/Usuario/login", login);
    return response.data;
  } catch (error) {
    console.error("Error en login:", error);
    throw error;
  }
};