import api from "./api";

export async function iniciarVinculacionTelegram(userId: number): Promise<{ success: boolean; message: string; codigo?: string }> {
  try {
    const response = await api.post("/usuario/initiate-telegram-link", { userId });
    return response.data;
  } catch (error: any) {
    console.error("Error al generar código de verificación:", error);
    return { success: false, message: error.response?.data?.message || "Error al iniciar vinculación." };
  }
}

export async function verificarCodigo(userId: number, codigo: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.post("/usuario/verificar-codigo", { usuarioId: userId, codigoIngresado: codigo });
    return response.data;
  } catch (error: any) {
    console.error("Error al verificar código:", error);
    return { success: false, message: error.response?.data?.message || "Error al verificar código." };
  }
}
