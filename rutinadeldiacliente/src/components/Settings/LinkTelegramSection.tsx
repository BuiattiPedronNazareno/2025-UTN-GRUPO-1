import React, { useState, useEffect } from "react";
import { Button, Typography, Alert } from "@mui/material";
import { iniciarVinculacionTelegram } from "../../services/telegramService";
import { useAppContext } from "../../context/AppContext";

const LinkTelegramSection: React.FC = () => {
  const { usuarioActivo } = useAppContext();
  const [codigoGenerado, setCodigoGenerado] = useState<string | undefined>(undefined);
  const [mensaje, setMensaje] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState<number>(0); // en segundos

  const handleGenerarCodigo = async () => {
    if (!usuarioActivo) return;
    setLoading(true);
    setMensaje(null);
    try {
      const result = await iniciarVinculacionTelegram(usuarioActivo.id);
      if (result.success && result.codigo) {
        setCodigoGenerado(result.codigo);
        setTiempoRestante(30); 
        setMensaje({ type: "success", text: "Envía este código al bot de Telegram antes de que expire." });
      } else {
        setMensaje({ type: "error", text: result.message });
      }
    } catch {
      setMensaje({ type: "error", text: "Error inesperado al generar código" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tiempoRestante <= 0) return;

    const interval = setInterval(() => {
      setTiempoRestante((prev) => {
        if (prev <= 1) {
          setCodigoGenerado(undefined);
          setMensaje({ type: "error", text: "El código ha expirado. Genera uno nuevo." });
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [tiempoRestante]);

  const formatTiempo = (segundos: number) => {
    const min = Math.floor(segundos / 60);
    const sec = segundos % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="link-telegram-section">
      <Typography variant="h5">Vincular Telegram</Typography>
      <Typography variant="h6" sx={{color: "red"}}>¡Antes busca @RutinaDelDia_bot en Telegram!</Typography>
      <Typography variant="h6" sx={{color: "red"}}>¡A él le debes enviar el código!</Typography>

      {!codigoGenerado ? (
        <Button variant="contained" onClick={handleGenerarCodigo} disabled={loading} sx={{ mt: 2, borderRadius: 99, boder: "4px solid black", color: "black", backgroundColor: "#3E8596", fontSize: "1rem" }}>
          {loading ? "Generando..." : "Generar Código"}
        </Button>
      ) : (
        <>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Tu código de verificación es: <strong>{codigoGenerado}</strong>
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Expira en: {formatTiempo(tiempoRestante)}
          </Typography>
        </>
      )}

      {mensaje && (
        <Alert severity={mensaje.type} sx={{ mt: 2 }}>
          {mensaje.text}
        </Alert>
      )}
    </div>
  );
};

export default LinkTelegramSection;
