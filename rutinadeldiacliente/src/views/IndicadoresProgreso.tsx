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
} from "@mui/material";
import { ArrowBack, Person } from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAppContext } from "../context/AppContext";
import { obtenerInfantesPorUsuario } from "../services/infanteService";
import type { InfanteGetDTO } from "../services/UsuarioService";
import {
  obtenerRendimientoProceso,
  obtenerRendimientoProgresion,
  type RendimientoProcesoDTO,
  type RendimientoProgresionDTO,
} from "../services/metricaService";
import "../styles/views/IndicadoresProgreso.scss";

const IndicadoresProgreso: React.FC = () => {
  const navigate = useNavigate();
  const { usuarioActivo } = useAppContext();
  const [infantes, setInfantes] = useState<InfanteGetDTO[]>([]);
  const [infanteSeleccionado, setInfanteSeleccionado] = useState<number | null>(null);
  const [rendimientoProceso, setRendimientoProceso] = useState<RendimientoProcesoDTO | null>(null);
  const [rendimientoProgresion, setRendimientoProgresion] = useState<RendimientoProgresionDTO | null>(null);
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
        
        // Seleccionar automáticamente el primer infante si existe
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
        const [proceso, progresion] = await Promise.all([
          obtenerRendimientoProceso(infanteSeleccionado),
          obtenerRendimientoProgresion(infanteSeleccionado, tipoProgresion),
        ]);

        setRendimientoProceso(proceso);
        setRendimientoProgresion(progresion);
      } catch (err: any) {
        console.error("Error al cargar métricas:", err);
        
        // Manejar error 404 específicamente
        if (err.response?.status === 404) {
          setError("Este infante aún no tiene registros de rutinas.");
        } else {
          setError("No se pudieron cargar las métricas.");
        }
        
        setRendimientoProceso(null);
        setRendimientoProgresion(null);
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

  // Preparar datos para el gráfico
  const chartData = rendimientoProgresion?.periodos.map((periodo) => ({
    periodo: periodo.periodo,
    Completadas: periodo.rutinasCompletadas,
    Canceladas: periodo.rutinasCanceladas,
    Rendimiento: periodo.rendimiento,
  })) || [];

  return (
    <Box className="indicadores-progreso">
      {/* Header */}
      <Box className="header">
        <Box className="header-content">
          <IconButton
            className="back-button"
            onClick={() => navigate("/adulto")}
            sx={{ color: "#2C3E50" }}
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
              sx={{
                backgroundColor: "white",
                borderRadius: "25px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#4A90A4",
                },
              }}
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

        {/* Mostrar error si existe */}
        {error && (
          <Alert severity="info" sx={{ mb: 3, borderRadius: "15px" }}>
            {error}
          </Alert>
        )}

        {/* Loading */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress sx={{ color: "#4A90A4" }} />
          </Box>
        )}

        {/* Métricas generales */}
        {!loading && !error && rendimientoProceso && (
          <>
            <Card
              className="metric-card"
              sx={{
                backgroundColor: "#4A90A4",
                color: "white",
                borderRadius: "20px",
                mb: 3,
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              }}
            >
              <CardContent>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
                  Rendimiento General
                </Typography>
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
                sx={{
                  backgroundColor: "white",
                  borderRadius: "25px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <ToggleButton
                  value="semanal"
                  sx={{
                    borderRadius: "25px 0 0 25px",
                    px: 4,
                    "&.Mui-selected": {
                      backgroundColor: "#4A90A4",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#3A7A8A",
                      },
                    },
                  }}
                >
                  Semanal
                </ToggleButton>
                <ToggleButton
                  value="mensual"
                  sx={{
                    borderRadius: "0 25px 25px 0",
                    px: 4,
                    "&.Mui-selected": {
                      backgroundColor: "#4A90A4",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#3A7A8A",
                      },
                    },
                  }}
                >
                  Mensual
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* Gráfico de progresión */}
            {rendimientoProgresion && chartData.length > 0 && (
              <Card
                className="chart-card"
                sx={{
                  backgroundColor: "white",
                  borderRadius: "20px",
                  p: 3,
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                }}
              >
                <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", color: "#2C3E50" }}>
                  Progresión {tipoProgresion === "semanal" ? "Semanal" : "Mensual"}
                </Typography>
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
                    <Tooltip />
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
          </>
        )}
      </Container>
    </Box>
  );
};

export default IndicadoresProgreso;