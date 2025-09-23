import React, { createContext, useContext, useState } from "react";
import type { UsuarioGetDTO, InfanteGetDTO } from "../services/UsuarioService";

interface AppContextProps {
  usuarioActivo: UsuarioGetDTO | null;
  infanteActivo: InfanteGetDTO | null;
  tipoUsuario: "adulto" | "infante" | null;
  setUsuarioActivo: (usuario: UsuarioGetDTO) => void;
  setInfanteActivo: (infante: InfanteGetDTO | null) => void;
  setTipoUsuario: (tipo: "adulto" | "infante" | null) => void;
}

const AppContext = createContext<AppContextProps>({} as AppContextProps);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuarioActivo, setUsuarioActivo] = useState<UsuarioGetDTO | null>(null);
  const [infanteActivo, setInfanteActivo] = useState<InfanteGetDTO | null>(null);
  const [tipoUsuario, setTipoUsuario] = useState<"adulto" | "infante" | null>(null);

  return (
    <AppContext.Provider
      value={{
        usuarioActivo,
        infanteActivo,
        tipoUsuario,
        setUsuarioActivo,
        setInfanteActivo,
        setTipoUsuario,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
