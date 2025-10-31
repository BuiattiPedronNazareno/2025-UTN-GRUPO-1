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