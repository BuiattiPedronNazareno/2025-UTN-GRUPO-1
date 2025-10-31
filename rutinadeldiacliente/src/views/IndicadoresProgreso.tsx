"use client";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
  Tooltip,
} from "@mui/material";
import Grid from "@mui/material/Grid"; // Importar Grid2 en lugar de Grid
import { ArrowBack, Person, TrendingUp, TrendingDown, TrendingFlat, EmojiEvents, WhatshotOutlined, InfoOutlined } from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { useAppContext } from "../context/AppContext";
import { obtenerInfantesPorUsuario } from "../services/infanteService";
import type { InfanteGetDTO } from "../services/UsuarioService";
import {
  obtenerRendimientoProceso,
  obtenerRendimientoProgresion,
  obtenerRacha,
  obtenerRendimientoPorRutina,
  obtenerTasaMejora,
  type RendimientoProcesoDTO,
  type RendimientoProgresionDTO,
  type RachaDTO,
  type RendimientoPorRutinaDTO,
  type TasaMejoraDTO,
} from "../services/metricaService";
import "../styles/views/IndicadoresProgreso.scss";

const IndicadoresProgreso: React.FC = () => {
  const navigate = useNavigate();
  const { usuarioActivo } = useAppContext();
  const [infantes, setInfantes] = useState<InfanteGetDTO[]>([]);
  const [infanteSeleccionado, setInfanteSeleccionado] = useState<number | null>(null);
  const [rendimientoProceso, setRendimientoProceso] = useState<RendimientoProcesoDTO | null>(null);
  const [rendimientoProgresion, setRendimientoProgresion] = useState<RendimientoProgresionDTO | null>(null);
  const [racha, setRacha] = useState<RachaDTO | null>(null);
  const [rendimientoPorRutina, setRendimientoPorRutina] = useState<RendimientoPorRutinaDTO[]>([]);
  const [tasaMejora, setTasaMejora] = useState<TasaMejoraDTO | null>(null);
  const [tipoProgresion, setTipoProgresion] = useState<"semanal" | "mensual">("semanal");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar infantes al montar el componente
  useEffect(() => {
    const fetchInfantes = async () => {
      if (!usuarioActivo) {
        console.warn("No hay usuario activo");
        return;
      }

      try {
        console.log("Cargando infantes del usuario:", usuarioActivo.id);
        const data = await obtenerInfantesPorUsuario(usuarioActivo.id);
        
        if (!Array.isArray(data) || data.length === 0) {
          console.warn("El usuario no tiene infantes registrados");
          setError("No tienes infantes registrados.");
          return;
        }

        setInfantes(data);
        
        if (data.length > 0) {
          setInfanteSeleccionado(data[0].id);
        }
      } catch (err) {
        console.error("Error al cargar infantes:", err);
        setError("No se pudieron cargar los infantes.");
      }
    };

    fetchInfantes();
  }, [usuarioActivo]);

  // Cargar métricas cuando cambia el infante seleccionado o el tipo de progresión
  useEffect(() => {
    const fetchMetricas = async () => {
      if (!infanteSeleccionado) return;

      setLoading(true);
      setError(null);

      try {
        const [proceso, progresion, rachaData, rutinas, mejora] = await Promise.allSettled([
          obtenerRendimientoProceso(infanteSeleccionado),
          obtenerRendimientoProgresion(infanteSeleccionado, tipoProgresion),
          obtenerRacha(infanteSeleccionado),
          obtenerRendimientoPorRutina(infanteSeleccionado),
          obtenerTasaMejora(infanteSeleccionado, tipoProgresion),
        ]);

        setRendimientoProceso(proceso.status === "fulfilled" ? proceso.value : null);
        setRendimientoProgresion(progresion.status === "fulfilled" ? progresion.value : null);
        setRacha(rachaData.status === "fulfilled" ? rachaData.value : null);
        setRendimientoPorRutina(rutinas.status === "fulfilled" ? rutinas.value : []);
        setTasaMejora(mejora.status === "fulfilled" ? mejora.value : null);

        if (proceso.status === "rejected" && progresion.status === "rejected") {
          setError("Este infante aún no tiene registros de rutinas.");
        }
      } catch (err: any) {
        console.error("Error al cargar métricas:", err);
        setError("No se pudieron cargar las métricas.");
      } finally {
        setLoading(false);
      }
    };

    fetchMetricas();
  }, [infanteSeleccionado, tipoProgresion]);

  const handleInfanteChange = (event: any) => {
    setInfanteSeleccionado(event.target.value as number);
  };

  const handleTipoProgresionChange = (_event: React.MouseEvent<HTMLElement>, newTipo: "semanal" | "mensual" | null) => {
    if (newTipo !== null) {
      setTipoProgresion(newTipo);
    }
  };

  // Preparar datos para el gráfico de progresión
  const chartData = rendimientoProgresion?.periodos.map((periodo) => ({
    periodo: periodo.periodo,
    Completadas: periodo.rutinasCompletadas,
    Canceladas: periodo.rutinasCanceladas,
    Rendimiento: periodo.rendimiento,
  })) || [];

  // Preparar datos para el gráfico de rutinas
  const chartRutinasData = rendimientoPorRutina.map((rutina) => ({
    nombre: rutina.nombreRutina.length > 15 ? rutina.nombreRutina.substring(0, 15) + "..." : rutina.nombreRutina,
    rendimiento: rutina.rendimiento,
    completadas: rutina.vecesCompletada,
    canceladas: rutina.vecesCancelada,
  }));

  // Icono de tendencia
  const getTendenciaIcon = () => {
    if (!tasaMejora) return null;
    if (tasaMejora.tendencia === "Mejorando") return <TrendingUp sx={{ color: "white" }} />;
    if (tasaMejora.tendencia === "Descendiendo") return <TrendingDown sx={{ color: "white" }} />;
    return <TrendingFlat sx={{ color: "white" }} />;
  };

  const getTendenciaColor = () => {
    if (!tasaMejora) return "#4A90A4";
    if (tasaMejora.tendencia === "Mejorando") return "#7FB069";
    if (tasaMejora.tendencia === "Descendiendo") return "#E74C3C";
    return "#F39C12";
  };

  return (
    <Box className="indicadores-progreso">
      <Box className="header">
        <Box className="header-content">
          <IconButton
            className="back-button"
            onClick={() => navigate("/adulto")}
          >
            <ArrowBack fontSize="large" />
          </IconButton>
          <Typography variant="h4" component="h1" className="header-title">
            Indicadores de Progreso
          </Typography>
        </Box>
      </Box>

      <Container component="main" className="main-content" maxWidth="md">
        {/* Selector de infante */}
        <Box sx={{ mb: 4 }}>
          <FormControl fullWidth>
            <InputLabel id="infante-select-label">Seleccionar Infante</InputLabel>
            <Select
              labelId="infante-select-label"
              value={infanteSeleccionado || ""}
              onChange={handleInfanteChange}
              label="Seleccionar Infante"
            >
              {infantes.map((infante) => (
                <MenuItem key={infante.id} value={infante.id}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Person />
                    {infante.nombre}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {error && (
          <Alert severity="info" sx={{ mb: 3, borderRadius: "15px" }}>
            {error}
          </Alert>
        )}

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress sx={{ color: "#4A90A4" }} />
          </Box>
        )}

        {!loading && !error && rendimientoProceso && (
          <>
            {/* Racha y Tasa de Mejora */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {racha ? (
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card className="metric-card" sx={{ backgroundColor: "#F39C12", position: "relative", minHeight: "300px" }}>
                    <CardContent>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <WhatshotOutlined fontSize="large" sx={{ color: "white" }} />
                          <Typography variant="h5" sx={{ fontWeight: "bold", color: "white" }}>
                            Racha Actual
                          </Typography>
                        </Box>
                        <Tooltip 
                          title="La racha cuenta los días consecutivos en los que se ha completado al menos una rutina. ¡Mantén tu racha activa completando rutinas todos los días!"
                          arrow
                          placement="top"
                        >
                          <IconButton size="small" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                            <InfoOutlined />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      <Typography variant="h2" sx={{ fontWeight: "bold", mb: 1, color: "white" }}>
                        {racha.rachaActual} {racha.rachaActual === 1 ? "día" : "días"}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
                        <EmojiEvents sx={{ color: "white" }} />
                        <Typography variant="body1" sx={{ color: "white" }}>
                          Mejor racha: {racha.mejorRacha} {racha.mejorRacha === 1 ? "día" : "días"}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ) : (
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card className="metric-card" sx={{ backgroundColor: "#BDBDBD", position: "relative", minHeight: "200px" }}>
                    <CardContent>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <WhatshotOutlined fontSize="large" sx={{ color: "white" }} />
                          <Typography variant="h5" sx={{ fontWeight: "bold", color: "white" }}>
                            Racha Actual
                          </Typography>
                        </Box>
                        <Tooltip 
                          title="La racha cuenta los días consecutivos en los que se ha completado al menos una rutina. ¡Mantén tu racha activa completando rutinas todos los días!"
                          arrow
                          placement="top"
                        >
                          <IconButton size="small" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                            <InfoOutlined />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      <Typography variant="body1" sx={{ color: "white", fontStyle: "italic", mt: 3 }}>
                        Completa rutinas para empezar tu racha
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {tasaMejora ? (
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card className="metric-card" sx={{ backgroundColor: getTendenciaColor(), position: "relative", minHeight: "200px" }}>
                    <CardContent>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          {getTendenciaIcon()}
                          <Typography variant="h5" sx={{ fontWeight: "bold", color: "white" }}>
                            Tendencia
                          </Typography>
                        </Box>
                        <Tooltip 
                          title={`La tendencia compara el rendimiento entre dos períodos (${tipoProgresion === "semanal" ? "semanas" : "meses"}). Muestra si tu desempeño está mejorando, descendiendo o se mantiene estable.`}
                          arrow
                          placement="top"
                        >
                          <IconButton size="small" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                            <InfoOutlined />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      <Typography variant="h2" sx={{ fontWeight: "bold", mb: 1, color: "white" }}>
                        {tasaMejora.mejora > 0 ? "+" : ""}{tasaMejora.mejora}%
                      </Typography>
                      <Chip
                        label={tasaMejora.tendencia}
                        sx={{
                          backgroundColor: "rgba(255, 255, 255, 0.3)",
                          color: "white",
                          fontWeight: "bold",
                        }}
                      />
                      <Typography variant="body2" sx={{ mt: 2, opacity: 0.9, color: "white" }}>
                        {tasaMejora.nombrePeriodoAnterior} → {tasaMejora.nombrePeriodoActual}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ) : (
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card className="metric-card" sx={{ 
                    backgroundColor: "#9E9E9E", 
                    position: "relative",
                    minHeight: "300px"
                  }}>
                    <CardContent>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <TrendingFlat fontSize="large" sx={{ color: "white" }} />
                          <Typography variant="h5" sx={{ fontWeight: "bold", color: "white" }}>
                            Tendencia
                          </Typography>
                        </Box>
                        <Tooltip 
                          title={`La tendencia compara el rendimiento entre dos períodos (${tipoProgresion === "semanal" ? "semanas" : "meses"}). Muestra si tu desempeño está mejorando, descendiendo o se mantiene estable.`}
                          arrow
                          placement="top"
                        >
                          <IconButton size="small" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                            <InfoOutlined />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      <Box sx={{ 
                        display: "flex", 
                        flexDirection: "column", 
                        py: 2
                      }}>
                        <Typography variant="h6" sx={{ color: "white", fontWeight: "500", mb: 1 }}>
                          Datos insuficientes
                        </Typography>
                        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "0.85rem" }}>
                          Se necesitan al menos dos {tipoProgresion === "semanal" ? "semanas" : "meses"} con rutinas completadas
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>

            {/* Métricas generales */}
            <Card className="metric-card" sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    Rendimiento General
                  </Typography>
                  <Tooltip 
                    title="Resumen estadístico de todas las rutinas del infante. El rendimiento se calcula como el porcentaje de rutinas completadas sobre el total de rutinas realizadas."
                    arrow
                    placement="top"
                  >
                    <IconButton size="small">
                      <InfoOutlined />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box className="metrics-grid">
                  <Box className="metric-item">
                    <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                      {rendimientoProceso.rendimiento}%
                    </Typography>
                    <Typography variant="body1">Rendimiento</Typography>
                  </Box>
                  <Box className="metric-item">
                    <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                      {rendimientoProceso.totalRutinas}
                    </Typography>
                    <Typography variant="body1">Total Rutinas</Typography>
                  </Box>
                  <Box className="metric-item">
                    <Typography variant="h3" sx={{ fontWeight: "bold", color: "#7FB069" }}>
                      {rendimientoProceso.rutinasCompletadas}
                    </Typography>
                    <Typography variant="body1">Completadas</Typography>
                  </Box>
                  <Box className="metric-item">
                    <Typography variant="h3" sx={{ fontWeight: "bold", color: "#E74C3C" }}>
                      {rendimientoProceso.rutinasCanceladas}
                    </Typography>
                    <Typography variant="body1">Canceladas</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Selector de tipo de progresión */}
            <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
              <ToggleButtonGroup
                value={tipoProgresion}
                exclusive
                onChange={handleTipoProgresionChange}
              >
                <ToggleButton value="semanal">Semanal</ToggleButton>
                <ToggleButton value="mensual">Mensual</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* Gráfico de progresión */}
            {rendimientoProgresion && chartData.length > 0 && (
              <Card className="chart-card" sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: "bold", color: "#2C3E50" }}>
                    Progresión {tipoProgresion === "semanal" ? "Semanal" : "Mensual"}
                  </Typography>
                  <Tooltip 
                    title={`Muestra la evolución ${tipoProgresion === "semanal" ? "semana a semana" : "mes a mes"} del número de rutinas completadas, canceladas y el porcentaje de rendimiento general.`}
                    arrow
                    placement="top"
                  >
                    <IconButton size="small">
                      <InfoOutlined />
                    </IconButton>
                  </Tooltip>
                </Box>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="periodo"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="Completadas"
                      stroke="#7FB069"
                      strokeWidth={3}
                      name="Rutinas Completadas"
                    />
                    <Line
                      type="monotone"
                      dataKey="Canceladas"
                      stroke="#E74C3C"
                      strokeWidth={3}
                      name="Rutinas Canceladas"
                    />
                    <Line
                      type="monotone"
                      dataKey="Rendimiento"
                      stroke="#4A90A4"
                      strokeWidth={3}
                      name="Rendimiento (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            )}

            {/* Gráfico de rendimiento por rutina */}
            {rendimientoPorRutina.length > 0 && (
              <Card className="chart-card">
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: "bold", color: "#2C3E50" }}>
                    Rendimiento por Rutina ({rendimientoPorRutina.length} {rendimientoPorRutina.length === 1 ? "rutina" : "rutinas"})
                  </Typography>
                  <Tooltip 
                    title="Detalle del rendimiento individual de cada rutina, mostrando el porcentaje de éxito, cantidad de veces completada y cancelada."
                    arrow
                    placement="top"
                  >
                    <IconButton size="small">
                      <InfoOutlined />
                    </IconButton>
                  </Tooltip>
                </Box>
                <ResponsiveContainer width="100%" height={Math.max(400, rendimientoPorRutina.length * 60)}>
                  <BarChart data={chartRutinasData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis 
                      dataKey="nombre" 
                      type="category"
                      width={150}
                      style={{ fontSize: "11px" }}
                    />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="rendimiento" fill="#4A90A4" name="Rendimiento %" />
                    <Bar dataKey="completadas" fill="#7FB069" name="Completadas" />
                    <Bar dataKey="canceladas" fill="#E74C3C" name="Canceladas" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default IndicadoresProgreso;