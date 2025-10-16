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

// Obtener estado del tutorial para el adulto
export const obtenerTutorialStatus = async (usuarioId: number): Promise<{ showAdultTutorial: boolean }> => {
  try {
    const response = await api.get<{ showAdultTutorial: boolean }>(`/Usuario/tutorial-status/${usuarioId}`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo estado de tutorial adulto:", error);
    throw error;
  }
};

// Marcar tutorial adulto como completado
export const completarTutorial = async (usuarioId: number): Promise<void> => {
  try {
    await api.post(`/Usuario/tutorial-completed/${usuarioId}`);
  } catch (error) {
    console.error("Error marcando tutorial adulto como completado:", error);
    throw error;
  }
};