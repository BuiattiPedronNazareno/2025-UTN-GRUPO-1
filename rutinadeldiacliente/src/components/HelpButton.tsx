"use client"

import React, { useState } from "react"
import { Button } from "@mui/material"
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import HelpModal from "./HelpModal"
import { sendHelp } from "../services/helpService"
import { useAppContext } from "../context/AppContext"
import "../styles/components/HelpButton.scss"

interface HelpButtonProps {
  routineId?: number;
}

const HelpButton: React.FC<HelpButtonProps> = ({ routineId }) => {
  const [open, setOpen] = useState(false);
  const { infanteActivo } = useAppContext();

  const handleClick = async () => {
    try {
      if (!infanteActivo) {
        console.error("❌ No hay infante activo en el contexto");
        alert("No se encontró el ID del niño.");
        return;
      }

      console.log("📤 Enviando solicitud de ayuda:", {
        infanteId: infanteActivo.id,
        infanteNombre: infanteActivo.nombre,
        routineId: routineId || 0
      });

      const response = await sendHelp(infanteActivo.id, routineId || 0);
      
      console.log("✅ Respuesta del servidor:", response.data);

      setOpen(true);
      
      setTimeout(() => {
        setOpen(false);
      }, 3000);
    } catch (err: any) {
      console.error("❌ Error al enviar ayuda:", err);
      console.error("Detalles del error:", err.response?.data);
      alert(err.response?.data || "Error al enviar la solicitud de ayuda.");
    }
  };

  return (
    <>
      <Button
        variant="contained"
        className="help-button"
        onClick={handleClick}
        startIcon={<PhoneAndroidIcon />}
        size="large"
      >
        Pedir ayuda
      </Button>

      <HelpModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}

export default HelpButton