import React, { createContext, useContext, useState, useEffect } from "react";
import type { UsuarioGetDTO, InfanteGetDTO } from "../services/UsuarioService";
import { obtenerInfanteNivelPorId } from "../services/infanteNivelService";
import type { InfanteNivelGetDTO } from "../services/infanteNivelService";

interface AppContextProps {
  usuarioActivo: UsuarioGetDTO | null;
  infanteActivo: InfanteGetDTO | null;
  tipoUsuario: "adulto" | "infante" | null;
  nivelDescripcion: string;
  // ahora acepta null para permitir logout
  setUsuarioActivo: (usuario: UsuarioGetDTO | null) => void;
  setInfanteActivo: (infante: InfanteGetDTO | null) => void;
  setTipoUsuario: (tipo: "adulto" | "infante" | null) => void;
  actualizarNivelInfante: (nuevoNivelId: number, nuevaDescripcion?: string) => void;
}

const AppContext = createContext<AppContextProps>({} as AppContextProps);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inicializar desde localStorage para mantener sesión tras reload
  const [usuarioActivo, setUsuarioActivoState] = useState<UsuarioGetDTO | null>(() => {
    try {
      if (typeof window === "undefined") return null;
      const raw = localStorage.getItem("usuarioActivo");
      return raw ? (JSON.parse(raw) as UsuarioGetDTO) : null;
    } catch (error) {
      console.error("Error leyendo usuarioActivo desde localStorage:", error);
      return null;
    }
  });

  // Wrapper para actualizar estado y persistir en localStorage
  const setUsuarioActivo = (usuario: UsuarioGetDTO | null) => {
    setUsuarioActivoState(usuario);
    try {
      if (typeof window === "undefined") return;
      if (usuario) {
        localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
      } else {
        localStorage.removeItem("usuarioActivo");
      }
    } catch (error) {
      console.error("Error guardando usuarioActivo en localStorage:", error);
    }
  };
  // Inicializar infante activo desde localStorage si existe
  const [infanteActivo, setInfanteActivoState] = useState<InfanteGetDTO | null>(() => {
    try {
      if (typeof window === "undefined") return null;
      const raw = localStorage.getItem("infanteActivo");
      return raw ? (JSON.parse(raw) as InfanteGetDTO) : null;
    } catch (error) {
      console.error("Error leyendo infanteActivo desde localStorage:", error);
      return null;
    }
  });

  const setInfanteActivo = (infante: InfanteGetDTO | null) => {
    setInfanteActivoState(infante);
    try {
      if (typeof window === "undefined") return;
      if (infante) {
        localStorage.setItem("infanteActivo", JSON.stringify(infante));
      } else {
        localStorage.removeItem("infanteActivo");
      }
    } catch (error) {
      console.error("Error guardando infanteActivo en localStorage:", error);
    }
  };
  const [tipoUsuario, setTipoUsuario] = useState<"adulto" | "infante" | null>(null);
  const [nivelDescripcion, setNivelDescripcion] = useState<string>("PRINCIPIANTE");

  // Cargar el nivel cuando cambia el infante activo
  useEffect(() => {
    const fetchNivel = async () => {
      if (!infanteActivo) {
        setNivelDescripcion("PRINCIPIANTE");
        return;
      }

      try {
        console.log(`🔍 Obteniendo nivel para infante ${infanteActivo.nombre}, nivelId: ${infanteActivo.infanteNivelId}`);
        const nivel: InfanteNivelGetDTO = await obtenerInfanteNivelPorId(infanteActivo.infanteNivelId);
        console.log(`✅ Nivel obtenido: ${nivel.descripcion}`);
        setNivelDescripcion(nivel.descripcion);
      } catch (error) {
        console.error("❌ Error al obtener el nivel del infante:", error);
        setNivelDescripcion("PRINCIPIANTE");
      }
    };

    fetchNivel();
  }, [infanteActivo]);

  // Función para actualizar el nivel del infante
  const actualizarNivelInfante = (nuevoNivelId: number, nuevaDescripcion?: string) => {
    if (!infanteActivo) {
      console.warn("⚠️ No hay infante activo para actualizar");
      return;
    }

    console.log(`📈 Actualizando nivel de ${infanteActivo.nombre}:`, {
      nivelAnterior: infanteActivo.infanteNivelId,
      nuevoNivelId,
      descripcion: nuevaDescripcion
    });

    // Actualizar el infante activo con el nuevo nivel
    setInfanteActivo({
      ...infanteActivo,
      infanteNivelId: nuevoNivelId,
    });

    // Si se proporciona la descripción, actualizarla directamente
    if (nuevaDescripcion) {
      setNivelDescripcion(nuevaDescripcion);
    }
    // Si no, el useEffect lo cargará automáticamente
  };

  return (
    <AppContext.Provider
      value={{
        usuarioActivo,
        infanteActivo,
        tipoUsuario,
        nivelDescripcion,
        setUsuarioActivo,
        setInfanteActivo,
        setTipoUsuario,
        actualizarNivelInfante,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
