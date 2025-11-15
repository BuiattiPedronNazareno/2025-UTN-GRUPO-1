import api from "./api";

// --- INTERFACES ---
export interface Cancelacion {
  id: number;
  fechaHora: string;
  rutinaID: number;

  // Estos se agregan porque el backend los enviará si los incluís en el DTO
  nombreInfante?: string;
  nombreRutina?: string;
}

// --- CREAR CANCELACIÓN (desde el botón de cancelar rutina) ---
export async function crearCancelacion(c: Omit<Cancelacion, "id" | "nombreInfante" | "nombreRutina">) {
  const response = await api.post("/cancelacion/crearCancelacion", c);
  return response.data;
}

// --- CANCELAR RUTINA (endpoint nuevo que notifica por Telegram) ---
export async function cancelarRutina(rutinaId: number, infanteId: number) {
  return api.post("/cancelacion/cancelar-rutina", {
    rutinaId,
    infanteId,
  });
}

// --- OBTENER HISTORIAL COMPLETO POR USUARIO ---
export async function obtenerCancelacionesPorUsuario(usuarioId: number): Promise<Cancelacion[]> {
  const res = await api.get(`/cancelacion/obtenerCancelacionesPorUsuario/${usuarioId}`);
  return res.data;
}

// --- OBTENER HISTORIAL POR INFANTE ---
export async function obtenerCancelacionesPorInfante(infanteId: number): Promise<Cancelacion[]> {
  const res = await api.get(`/cancelacion/obtenerCancelacionesPorInfante/${infanteId}`);
  return res.data;
}

// -----------------------------------------------------------------------
// --- FUNCIONALIDAD DE "LEÍDAS / NO LEÍDAS" (solo front, usa localStorage)
// -----------------------------------------------------------------------

export function marcarCancelacionesComoLeidas(usuarioId: number) {
  localStorage.setItem(`cancelaciones_leidas_${usuarioId}`, Date.now().toString());
}

export function hayCancelacionesSinLeer(usuarioId: number, cancelaciones: Cancelacion[]) {
  const lastRead = Number(localStorage.getItem(`cancelaciones_leidas_${usuarioId}`) || "0");

  return cancelaciones.some((c) => {
    const fecha = new Date(c.fechaHora).getTime();
    return fecha > lastRead;
  });
}
