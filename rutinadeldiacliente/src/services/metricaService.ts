import api from "./api";

// Interfaces para las métricas
export interface RendimientoProcesoDTO {
  infanteId: number;
  totalRutinas: number;
  rutinasCompletadas: number;
  rutinasCanceladas: number;
  rendimiento: number;
}

export interface RendimientoPeriodoDTO {
  periodo: string;
  rutinasCompletadas: number;
  rutinasCanceladas: number;
  rendimiento: number;
}

export interface RendimientoProgresionDTO {
  infanteId: number;
  tipo: string;
  periodos: RendimientoPeriodoDTO[];
}

export interface RachaDTO {
  infanteId: number;
  rachaActual: number;
  mejorRacha: number;
  ultimaCompletacion: string;
}

export interface RendimientoPorRutinaDTO {
  rutinaId: number;
  nombreRutina: string;
  vecesCompletada: number;
  vecesCancelada: number;
  rendimiento: number;
  ultimaCompletacion: string | null;
}

export interface TasaMejoraDTO {
  infanteId: number;
  periodoAnterior: number;
  periodoActual: number;
  mejora: number;
  tendencia: string;
  nombrePeriodoAnterior: string;
  nombrePeriodoActual: string;
}

// Obtener rendimiento de proceso (global del infante)
export const obtenerRendimientoProceso = async (
  infanteId: number
): Promise<RendimientoProcesoDTO> => {
  const response = await api.get<RendimientoProcesoDTO>(
    `/Metrica/rendimientoProceso/${infanteId}`
  );
  return response.data;
};

// Obtener rendimiento de progresión (semanal o mensual)
export const obtenerRendimientoProgresion = async (
  infanteId: number,
  tipo: "semanal" | "mensual" = "semanal"
): Promise<RendimientoProgresionDTO> => {
  const response = await api.get<RendimientoProgresionDTO>(
    `/Metrica/rendimientoProgresion/${infanteId}`,
    {
      params: { tipo },
    }
  );
  return response.data;
};

// Obtener racha de completaciones
export const obtenerRacha = async (
  infanteId: number
): Promise<RachaDTO> => {
  const response = await api.get<RachaDTO>(
    `/Metrica/racha/${infanteId}`
  );
  return response.data;
};

// Obtener rendimiento por rutina individual
export const obtenerRendimientoPorRutina = async (
  infanteId: number
): Promise<RendimientoPorRutinaDTO[]> => {
  const response = await api.get<RendimientoPorRutinaDTO[]>(
    `/Metrica/rendimientoPorRutina/${infanteId}`
  );
  return response.data;
};

// Obtener tasa de mejora
export const obtenerTasaMejora = async (
  infanteId: number,
  tipo: "semanal" | "mensual" = "semanal"
): Promise<TasaMejoraDTO> => {
  const response = await api.get<TasaMejoraDTO>(
    `/Metrica/tasaMejora/${infanteId}`,
    {
      params: { tipo },
    }
  );
  return response.data;
};