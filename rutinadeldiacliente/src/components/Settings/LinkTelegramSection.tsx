import React, { useState } from "react";
import { Button, Typography, Alert } from "@mui/material";
import { iniciarVinculacionTelegram } from "../../services/telegramService"; // Ajusta la ruta
import { useAppContext } from "../../context/AppContext"; 

const LinkTelegramSection: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const { usuarioActivo } = useAppContext();

  const handleInitiateLink = async () => {
    setLoading(true);
    setMessage(null);
    try {
      if (!usuarioActivo) throw new Error("Usuario no activo");
      const result = await iniciarVinculacionTelegram(usuarioActivo.id);
      if (result.success) {
        setMessage({ type: "success", text: result.message });
      } else {
        setMessage({ type: "error", text: result.message });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error inesperado al intentar vincular Telegram." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="link-telegram-section">
      <Typography variant="h6">Vincular Telegram</Typography>
      <Typography variant="body2" color="textSecondary">
        Recibe notificaciones directamente en Telegram.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleInitiateLink}
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? "Enviando..." : "Iniciar Vinculación"}
      </Button>
      {message && (
        <Alert severity={message.type} sx={{ mt: 2 }}>
          {message.text}
        </Alert>
      )}
      <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
        <strong>Instrucciones:</strong> 1. Revisa tu teléfono. Deberías recibir un SMS con un código. 2. Abre Telegram. 3. Busca a @TuBotDeTelegram. 4. Envía el código que recibiste por SMS.
      </Typography>
    </div>
  );
};

export default LinkTelegramSection;