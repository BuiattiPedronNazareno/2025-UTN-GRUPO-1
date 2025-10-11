"use client"

import React from "react"
import { useNavigate } from "react-router-dom"
import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material"
import { ArrowBack, Settings } from "@mui/icons-material"
import "../styles/components/NavBarAdulto.scss"

interface NavBarAdultoProps {
  title: string
  showBackButton?: boolean
  onBackClick?: () => void
  showSettingsButton?: boolean
  onSettingsClick?: () => void
}

const NavBarAdulto: React.FC<NavBarAdultoProps> = ({
  title,
  showBackButton = false,
  onBackClick,
  showSettingsButton = false,
  onSettingsClick,
}) => {
  const navigate = useNavigate()

  const handleBackClick = () => {
    if (onBackClick) onBackClick()
    else navigate("/adulto")
  }

  const handleSettingsClick = () => {
    if (onSettingsClick) onSettingsClick()
    else navigate("/ajustes-adulto")
  }

  return (
    <AppBar position="static" className="navbar-adulto" sx={{ backgroundColor: "#BFDBD8", boxShadow: "none" }}>
      <Toolbar className="navbar-adulto-content">
        <Box className="header-content">
            {showBackButton && (
                <IconButton edge="start" color="inherit" onClick={handleBackClick} className="navbar-button back-button">
                    <ArrowBack />
                </IconButton>
            )}
            <Typography variant="h4" component="h1" className="header-title">
                {title}
            </Typography>

            {showSettingsButton && (
                <IconButton
                className="settings-button"
                onClick={handleSettingsClick}
                sx={{ color: "#2C3E50" }}
                >
                <Settings fontSize="large" />
                </IconButton>
            )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default NavBarAdulto
