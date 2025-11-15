"use client"
import React from "react"
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import CloseIcon from '@mui/icons-material/Close'
import { Box, Typography, Button, IconButton } from "@mui/material"
import "../styles/components/ReminderNotification.scss"

type Props = {
    routineName: string
    description?: string
    color?: string
    time?: string
    onOpen?: () => void
    onClose?: () => void
    className?: string
}

const ReminderNotification: React.FC<Props> = ({
    routineName,
    description,
    color = '#ff0000',
    time,
    onOpen,
    onClose,
    className
}) => {
    return (
        <Box
            className={`reminder-notification ${className ?? ""}`}
            role="dialog"
            aria-live="polite"
            style={{ borderLeft: `6px solid ${color}` }}
        >
            <Box className="reminder-left">
                <Box className="reminder-icon" style={{ color: color }}>
                    <NotificationsActiveIcon fontSize="large" />
                </Box>
            </Box>
            <Box
                className="reminder-content"
                onClick={onOpen}
                role="button"
                tabIndex={0}
                style={{ cursor: 'pointer' }}
            >
                <Typography variant="subtitle1" className="reminder-title">
                    {routineName}
                </Typography>
                <Typography variant="body2" className="reminder-desc">
                    {description}
                </Typography>
                {time && (
                    <Typography variant="caption" className="reminder-time">
                        {time}
                    </Typography>
                )}
            </Box>
            <Box className="reminder-actions">
                <Button
                    size="small"
                    variant="contained"
                    className="reminder-action"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onOpen) onOpen();
                    }}
                    sx={{
                        minWidth: 'auto',
                        padding: '4px 12px',
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        whiteSpace: 'nowrap'
                    }}
                >
                    VER
                </Button>
                <IconButton
                    size="small"
                    className="reminder-close"
                    aria-label="cerrar"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onClose) onClose();
                    }}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>
        </Box>
    )
}

export default ReminderNotification
