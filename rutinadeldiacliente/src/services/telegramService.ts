import api from "./api";

export async function iniciarVinculacionTelegram(userId: number): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.post("/usuario/initiate-telegram-link", { userId }); // body vacío
    return response.data;
  } catch (error: any) {
    console.error("Error al iniciar vinculación de Telegram:", error);
    return { success: false, message: error.response?.data?.message || "Error al iniciar vinculación." };
  }
}
