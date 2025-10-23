import { createBrowserRouter } from "react-router-dom";
import InicioInfante from "../views/InicioInfante";
import AjustesInfante from "../views/AjustesInfante";
import LogrosInfante from "../views/LogrosInfante";
import InicioAdulto from "../views/InicioAdulto";
import AjustesAdulto from "../views/AjustesAdulto";
import Register from "../views/Register";
import Login from "../views/Login";
import SeleccionPerfil from "../views/SeleccionPerfil";
import AgregarInfante from "../views/AgregarInfante";
import ValidarPinAdulto from "../views/ValidarPinAdulto";
import CrearRutina from "../views/crearRutina";
import CrearPaso from "../views/crearPaso";
import RutinaDetalleInfante from "../views/RutinaDetalle";
import RecordatorioAdulto from "../views/RecordatorioAdulto";
import RecordatorioDetalleInfante from "../views/RecordatorioDetalleInfante";
import ListaRecordatorioAdulto from "../views/ListaRecordatorioAdulto";
import EditarRutina from "../views/EditarRutina";
import PasoForm from "../views/PasoForm";
import CrearRutinaPrecargada from "../views/crearRutinaPrecargada";


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
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/seleccionperfil",
    element: <SeleccionPerfil />,
  },
  {
    path: "/agregar-infante",
    element: <AgregarInfante />,
  },
  {
    path: "/validar-pin-adulto",
    element: <ValidarPinAdulto />,
  },
  { path: "/crear-rutina", element: <CrearRutina /> },
  { path: "/crear-paso/:id", element: <CrearPaso /> },

  { path: "/editar-rutina/:rutinaId", element: <EditarRutina /> },
  { path: "/rutina/:rutinaId/paso", element: <PasoForm /> },
  { path: "/rutina/:rutinaId/paso/:pasoId?", element: <PasoForm /> },

  {
    path: "/rutina/:rutinaId/pasos",
    element: <RutinaDetalleInfante />,
  },
  {
    path: "/lista-recordatorio-adulto/:rutinaId",
    element: <ListaRecordatorioAdulto />,
  },
  {
    path: "/recordatorio-infante/:rutinaId",
    element: <RecordatorioDetalleInfante />,
  },
  {
    path: "/recordatorio-adulto",
    element: <RecordatorioAdulto />,
  },
  {
    path: "/editar-recordatorio-adulto/:id",
    element: <RecordatorioAdulto />,
  },
  {
    path: "/crear-rutina-precargada",
    element: <CrearRutinaPrecargada />
  },

]);
