import { createBrowserRouter, Outlet } from "react-router-dom";
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
import CrearRutina from "../views/CrearRutina";
import CrearPaso from "../views/CrearPaso";
import RutinaDetalleInfante from "../views/RutinaDetalle";
import RecordatorioAdulto from "../views/RecordatorioAdulto";
import RecordatorioDetalleInfante from "../views/RecordatorioDetalleInfante";
import ListaRecordatorioAdulto from "../views/ListaRecordatorioAdulto";
import EditarRutina from "../views/EditarRutina";
import PasoForm from "../views/PasoForm";
import CrearRutinaPrecargada from "../views/CrearRutinaPrecargada";
import IndicadoresProgreso from "../views/IndicadoresProgreso";
import RequireAuth from "../components/RequireAuth";
import HistorialCancelacion from "../views/HistorialCancelacion";

export const router = createBrowserRouter([
  // Rutas públicas
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },

  // Rutas protegidas por RequireAuth
  {
    path: "/",
    element: (
      <RequireAuth>
        <Outlet />
      </RequireAuth>
    ),
    children: [
      { path: "/", element: <InicioInfante /> },
      { path: "/inicio", element: <InicioInfante /> },
      { path: "/ajustes", element: <AjustesInfante /> },
      { path: "/logros", element: <LogrosInfante /> },
      { path: "/adulto", element: <InicioAdulto /> },
      { path: "/ajustes-adulto", element: <AjustesAdulto /> },
      { path: "/seleccionperfil", element: <SeleccionPerfil /> },
      { path: "/agregar-infante", element: <AgregarInfante /> },
      { path: "/validar-pin-adulto", element: <ValidarPinAdulto /> },
      { path: "/crear-rutina", element: <CrearRutina /> },
      { path: "/crear-paso/:id", element: <CrearPaso /> },
      { path: "/editar-rutina/:rutinaId", element: <EditarRutina /> },
      { path: "/rutina/:rutinaId/paso", element: <PasoForm /> },
      { path: "/rutina/:rutinaId/paso/:pasoId?", element: <PasoForm /> },
      { path: "/rutina/:rutinaId/pasos", element: <RutinaDetalleInfante /> },
      { path: "/lista-recordatorio-adulto/:rutinaId", element: <ListaRecordatorioAdulto /> },
      { path: "/recordatorio-infante/:rutinaId", element: <RecordatorioDetalleInfante /> },
      { path: "/recordatorio-adulto", element: <RecordatorioAdulto /> },
      { path: "/editar-recordatorio-adulto/:id", element: <RecordatorioAdulto /> },
      { path: "/crear-rutina-precargada", element: <CrearRutinaPrecargada /> },
      { path: "/indicadores-progreso", element: <IndicadoresProgreso /> },
      { path: "/historial-cancelacion", element: <HistorialCancelacion /> },
    ],
  },
]);
