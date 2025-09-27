"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  IconButton,
} from "@mui/material";
import {
  ArrowBack,
  Edit,
  Delete,
  Schedule,
  NotificationsActive,
  AlarmOn,
} from "@mui/icons-material";
import "../styles/views/ListaRecordatorioAdulto.scss";
import {
  obtenerRecordatoriosPorRutina,
  obtenerRutinaPorId,
  eliminarRecordatorio,
} from "../services/recordatorioService";
import type { Rutina, Recordatorio } from "../services/recordatorioService";

// // 🔹 Tipos de datos
// interface Rutina {
//   id: number;
//   nombre: string;
//   imagen: string;
// }
//
// interface Recordatorio {
//   id: number;
//   rutinaId: number;
//   nombre: string;
//   descripcion: string;
//   hora: string;
//   diaSemana: string;
//   fechaCreacion: string;
// }
//
// // 🔹 Función para obtener recordatorios de una rutina específica
// const obtenerRecordatoriosPorRutina = async (
//   rutinaId: number,
// ): Promise<Recordatorio[]> => {
//   try {
//     const res = await fetch(
//       `http://localhost:5012/Recordatorio/porRutina/${rutinaId}`,
//     );
//     if (!res.ok) throw new Error("Error al obtener recordatorios");
//
//     const data = await res.json();
//     return Array.isArray(data) ? data : [];
//   } catch (error) {
//     console.error("Error obteniendo recordatorios:", error);
//     return [];
//   }
// };
//
// // 🔹 Función para obtener información de una rutina específica
// const obtenerRutinaPorId = async (rutinaId: number): Promise<Rutina | null> => {
//   try {
//     const res = await fetch(`http://localhost:5012/Rutina/${rutinaId}`);
//     if (!res.ok) throw new Error("Error al obtener rutina");
//
//     const data = await res.json();
//     return data;
//   } catch (error) {
//     console.error("Error obteniendo rutina:", error);
//     return null;
//   }
// };
//
// // 🔹 Función para eliminar recordatorio
// const eliminarRecordatorio = async (rutinaId: number): Promise<boolean> => {
//   try {
//     const res = await fetch(
//       `http://localhost:5012/Recordatorio/eliminarRecordatorio/${rutinaId}`,
//       {
//         method: "DELETE",
//       },
//     );
//     return res.ok;
//   } catch (error) {
//     console.error("Error eliminando recordatorio:", error);
//     return false;
//   }
// };

const ListaRecordatorioAdulto: React.FC = () => {
  const navigate = useNavigate();
  const { rutinaId } = useParams<{ rutinaId: string }>();
  const [recordatorios, setRecordatorios] = useState<Recordatorio[]>([]);
  const [rutina, setRutina] = useState<Rutina | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!rutinaId) {
        console.error("No se proporcionó ID de rutina");
        navigate("/adulto");
        return;
      }

      try {
        setLoading(true);
        const rutinaIdNum = parseInt(rutinaId);

        // Obtener información de la rutina y sus recordatorios en paralelo
        const [rutinaDatos, recordatoriosDatos] = await Promise.all([
          obtenerRutinaPorId(rutinaIdNum),
          obtenerRecordatoriosPorRutina(rutinaIdNum),
        ]);

        setRutina(rutinaDatos);
        // Validar y limpiar datos de recordatorios
        const recordatoriosValidados = recordatoriosDatos.map(
          (recordatorio) => ({
            ...recordatorio,
          }),
        );
        setRecordatorios(recordatoriosValidados);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [rutinaId, navigate]);

  const handleEditRecordatorio = (recordatorioId: number) => {
    navigate(`/editar-recordatorio-adulto/${recordatorioId}`);
  };

  const handleDeleteRecordatorio = async (recordatorioId: number) => {
    if (window.confirm("¿Estás seguro de eliminar este recordatorio?")) {
      const success = await eliminarRecordatorio(recordatorioId);
      if (success) {
        // Actualizar la lista localmente
        setRecordatorios((prev) =>
          prev.filter((recordatorio) => recordatorio.id !== recordatorioId),
        );
      } else {
        alert("Error al eliminar el recordatorio");
      }
    }
  };

  const handleCreateRecordatorio = () => {
    navigate(`/recordatorio-adulto`);
  };

  const handleBackToRutinas = () => {
    navigate("/adulto");
  };

  const formatHora = (hora: string) => {
    // Asume formato HH:MM o HH:MM:SS
    return hora.substring(0, 5);
  };

  if (loading) {
    return (
      <Box className="lista-recordatorios">
        <Container component="main" className="main-content" maxWidth="md">
          <Typography variant="h6" align="center" sx={{ mt: 4 }}>
            Cargando recordatorios...
          </Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box className="lista-recordatorios">
      {/* Header */}
      <Box className="header">
        <Box className="header-content">
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton className="back-button" onClick={handleBackToRutinas}>
              <ArrowBack fontSize="large" />
            </IconButton>
            <Box>
              <Typography variant="h4" component="h1" className="header-title">
                Recordatorios
              </Typography>
              {rutina && (
                <Typography variant="h6" className="rutina-subtitle">
                  {rutina.nombre}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        <Box className="stats">
          <Typography variant="body2" className="stats-text">
            TOTAL RECORDATORIOS: {recordatorios.length}
          </Typography>
        </Box>
      </Box>

      <Container component="main" className="main-content" maxWidth="md">
        {recordatorios.length === 0 ? (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <AlarmOn sx={{ fontSize: 80, color: "#ccc", mb: 2 }} />
            <Typography variant="h6" color="textSecondary">
              No hay recordatorios para esta rutina
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              {rutina
                ? `Crea recordatorios para "${rutina.nombre}"`
                : "Crea tu primer recordatorio"}
            </Typography>
          </Box>
        ) : (
          /* Recordatorio Cards */
          <Box
            className="recordatorios-container"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 4,
            }}
          >
            {recordatorios.map((recordatorio) => (
              <Card key={recordatorio.id} className={`recordatorio-card `}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <NotificationsActive className="notification-icon" />
                        <Typography
                          variant="h6"
                          component="h3"
                          className="recordatorio-title"
                        >
                          {recordatorio.nombre}
                        </Typography>
                      </Box>

                      {recordatorio.descripcion && (
                        <Typography
                          variant="body2"
                          className="recordatorio-descripcion"
                        >
                          {recordatorio.descripcion}
                        </Typography>
                      )}

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 1,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Schedule className="schedule-icon" />
                          <Typography variant="body2" className="hora-text">
                            {formatHora(recordatorio.hora)}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography variant="body2" className="dias-text">
                        📅 {recordatorio.diaSemana}
                      </Typography>
                    </Box>

                    <Box className="recordatorio-actions">
                      <IconButton
                        onClick={() => handleEditRecordatorio(recordatorio.id)}
                        className="action-button"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() =>
                          handleDeleteRecordatorio(recordatorio.id)
                        }
                        className="action-button"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        {/* Action Buttons */}
        <Box className="action-buttons" sx={{ mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            className="create-recordatorio-button"
            onClick={handleCreateRecordatorio}
          >
            Crear Recordatorio
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ListaRecordatorioAdulto;
