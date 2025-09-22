import { createBrowserRouter } from "react-router-dom"
import InicioInfante from "../views/InicioInfante"
import AjustesInfante from "../views/AjustesInfante"
import LogrosInfante from "../views/LogrosInfante"
import InicioAdulto from "../views/InicioAdulto"
import AjustesAdulto from "../views/AjustesAdulto"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <InicioInfante />,
  },
  {
    path: "/inicio",
    element: <InicioInfante />,
  },
  {
    path: "/ajustes",
    element: <AjustesInfante />,
  },
  {
    path: "/logros",
    element: <LogrosInfante />,
  },
  {
    path: "/adulto",
    element: <InicioAdulto />,
  },
  {
    path: "/ajustes-adulto",
    element: <AjustesAdulto />,
  }
])
