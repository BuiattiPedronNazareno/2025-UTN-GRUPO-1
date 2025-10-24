"use client"

import React, { useState } from "react"
import { Button } from "@mui/material"
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import HelpModal from "./HelpModal"
import "../styles/components/HelpButton.scss"

interface HelpButtonProps {
  onClick?: () => void
}

const HelpButton: React.FC<HelpButtonProps> = ({ onClick }) => {
  const [open, setOpen] = useState(false)

  const handleClick = () => {
    setOpen(true)
  }
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
