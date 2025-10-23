"use client";

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    CircularProgress,
    Box,
    Typography,
    Card,
    CardContent,
    IconButton,
} from "@mui/material";
import { ArrowBack, NotificationsActive, Schedule, AlarmOn } from "@mui/icons-material";
import {
    obtenerRecordatoriosPorRutina,
    obtenerRutinaPorId,
    type RecordatorioRutina,
    type Rutina,
} from "../services/recordatorioService";
import NavBar from "../components/NavBar";
import "../styles/views/RecordatorioDetalleInfante.scss";

const RecordatorioDetalleInfante: React.FC = () => {
    const { rutinaId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [recordatorios, setRecordatorios] = useState<RecordatorioRutina[]>([]);
    const [rutina, setRutina] = useState<Rutina | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetch = async () => {
            if (!rutinaId) return;
            try {
                setLoading(true);
                const id = Number(rutinaId);
                const [rutinaDatos, recs] = await Promise.all([
                    obtenerRutinaPorId(id),
                    obtenerRecordatoriosPorRutina(id),
                ] as const);

                setRutina(rutinaDatos as Rutina | null);

                setRecordatorios(recs);
            } catch (err) {
                console.error(err);
                setError("No se pudo cargar los recordatorios.");
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [rutinaId]);

    const handleBack = () => navigate("/inicio");

    const formatHora = (hora: string) => {
        return hora ? hora.substring(0, 5) : "";
    };

    return (
        <Box className="recordatorio-detalle">
            <NavBar title="Recordatorios" showSettingsButton={false} onSettingsClick={() => navigate('/inicio')} />

            <Box className="header" sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
                <IconButton onClick={handleBack} aria-label="volver">
                    <ArrowBack />
                </IconButton>
                <Box>
                    <Typography variant="h5">Volver</Typography>
                </Box>
            </Box>

            <Box sx={{ padding: 2 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : recordatorios.length === 0 ? (
                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                        <AlarmOn sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
                        <Typography variant="h6" color="textSecondary">
                            No hay recordatorios para esta rutina
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                            {rutina ? `Crea recordatorios para "${rutina.nombre}"` : 'Crea tu primer recordatorio'}
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        {recordatorios.map((rec) => (
                            <Card key={rec.id} className="recordatorio-card" sx={{ backgroundColor: rec.color || undefined, color: rec.color ? '#fff' : undefined }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                                            <NotificationsActive />
                                            <Box>
                                                <Typography variant="h6">{rec.rutinaNombre || 'Recordatorio'}</Typography>
                                                {rec.descripcion && (
                                                    <Typography variant="body2" sx={{ mb: 1 }}>{rec.descripcion}</Typography>
                                                )}

                                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                                    <Schedule sx={{ fontSize: 18 }} />
                                                    <Typography variant="body2">{formatHora(rec.hora)}</Typography>
                                                    <Typography variant="body2">· {rec.frecuencia == "Semanal" ? rec.diaSemana : '—'}</Typography>
                                                </Box>
                                            </Box>
                                        </Box>

                                        <Box sx={{ textAlign: 'right', minWidth: 140 }}>
                                            <Typography variant="body2">Frecuencia: {rec.frecuencia || '—'}</Typography>
                                            <Typography variant="body2">Sonido: {rec.sonido || '—'}</Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default RecordatorioDetalleInfante;
