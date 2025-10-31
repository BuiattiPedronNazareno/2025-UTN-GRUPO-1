import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const RequireAuth: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const { usuarioActivo } = useAppContext();
    const location = useLocation();

    if (!usuarioActivo) {
        // No hay usuario activo: redirigir a /login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default RequireAuth;
