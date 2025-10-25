"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"
import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material"
import { ArrowBack, Settings } from "@mui/icons-material"
import FlashOnIcon from "@mui/icons-material/FlashOn"
import "../styles/components/NavBar.scss"

interface NavBarProps {
  title: string
  showBackButton?: boolean
  onBackClick?: () => void
  showSettingsButton?: boolean
  onSettingsClick?: () => void
  alignLevel?: "left" | "right"
}

const NavBar: React.FC<NavBarProps> = ({
  title,
  showBackButton = false,
  onBackClick,
  showSettingsButton = false,
  onSettingsClick,
  alignLevel = "left",
}) => {
  const navigate = useNavigate()

  const handleBackClick = () => {
    if (onBackClick) onBackClick()
    else navigate("/")
  }

  const handleSettingsClick = () => {
    if (onSettingsClick) onSettingsClick()
    else navigate("/ajustes")
  }

  return (
    <AppBar position="static" className="navbar" sx={{ backgroundColor: "#4A90A4" }}>
      <Toolbar className="navbar-content">
        
        <Box className="navbar-left">
          {showBackButton && (
            <IconButton edge="start" color="inherit" onClick={handleBackClick} className="navbar-button back-button">
              <ArrowBack />
            </IconButton>
          )}
          {alignLevel === "left" && (
            <>
              <FlashOnIcon className="navbar-icon" />
              <Typography variant="caption" className="navbar-subtitle" sx={{ fontWeight: "bold" }}>
                PRINCIPIANTE
              </Typography>
            </>
          )}
        </Box>

        <Box className="navbar-center">
          <Typography variant="h5" component="h1" className="navbar-title">
            {title}
          </Typography>
        </Box>

        <Box className="navbar-right">
          {alignLevel === "right" && (
            <>
              <FlashOnIcon className="navbar-icon" />
              <Typography variant="caption" className="navbar-subtitle" sx={{ fontWeight: "bold" }}>
                PRINCIPIANTE
              </Typography>
            </>
          )}
          {showSettingsButton && (
            <IconButton edge="end" color="inherit" onClick={handleSettingsClick} className="navbar-button">
              <Settings />
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default NavBar
