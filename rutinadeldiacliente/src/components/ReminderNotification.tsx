"use client"

import React from "react"
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import CloseIcon from '@mui/icons-material/Close'
import { Box, Typography, Button, IconButton } from "@mui/material"
import "../styles/components/ReminderNotification.scss"

type Props = {
    title?: string
    description?: string
    color?: string
    time?: string
    onOpen?: () => void
    onClose?: () => void
    className?: string
}

const ReminderNotification: React.FC<Props> = ({
    title = "Recordatorio: Hora de la rutina",
    description = "Es momento de realizar la rutina. Toca para ver los pasos.",
    color = '#ff0000',
    time,
    onOpen,
    onClose,
    className
}) => {
    return (
        <Box className={`reminder-notification ${className ?? ""}`} role="dialog" aria-live="polite" style={{ borderLeft: `6px solid ${color}` }}>
            <Box className="reminder-left">
                <Box className="reminder-icon" style={{ color: color }}>
                    <NotificationsActiveIcon fontSize="large" />
                </Box>
            </Box>

            <Box className="reminder-content" onClick={onOpen} role="button" tabIndex={0}>
                <Typography variant="subtitle1" className="reminder-title">{title}</Typography>
                <Typography variant="body2" className="reminder-desc">{description}</Typography>
                {time && <Typography variant="caption" className="reminder-time">{time}</Typography>}
            </Box>

            <Box className="reminder-actions">
                <Button size="small" className="reminder-action" onClick={(e) => { e.stopPropagation(); if (onOpen) onOpen(); }}>Ver</Button>
                <IconButton size="small" className="reminder-close" aria-label="cerrar" onClick={(e) => { e.stopPropagation(); if (onClose) onClose(); }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>
        </Box>
    )
}

export default ReminderNotification
