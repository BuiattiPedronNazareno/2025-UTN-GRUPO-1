import api from "./api";

// Validar PIN
export const validarPinAdulto = async (usuarioId: number, pinIngresado: number): Promise<string> => {
  try {
    const response = await api.post<string>("/Adulto/validarPin", null, {
      params: {
        usuarioId,
        pinIngresado,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error validando PIN:", error.response?.data || error.message);
    throw error;
  }
};