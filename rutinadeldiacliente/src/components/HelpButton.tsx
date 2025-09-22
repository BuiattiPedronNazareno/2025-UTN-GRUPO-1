"use client"

import type React from "react"
import { Button } from "@mui/material"
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"
import "../styles/components/HelpButton.scss"

interface HelpButtonProps {
  onClick?: () => void
}

const HelpButton: React.FC<HelpButtonProps> = ({ onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      alert("¿Necesitas ayuda? Pide a un adulto que te ayude.")
    }
  }

  return (
    <Button
      variant="contained"
      className="help-button"
      onClick={handleClick}
      startIcon={<HelpOutlineIcon />}
      size="large"
    >
      Pedir ayuda
    </Button>
  )
}

export default HelpButton
