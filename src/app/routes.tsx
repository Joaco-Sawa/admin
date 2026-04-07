import { createBrowserRouter } from "react-router";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { ProgramDetail } from "./pages/ProgramDetail";
import { ProgramParticipants } from "./pages/ProgramParticipants";
import { ProgramPointsLoad } from "./pages/ProgramPointsLoad";
import { ProgramConfiguration } from "./pages/ProgramConfiguration";
import { ProgramChallenges } from "./pages/ProgramChallenges";
import { CreateChallengeModal } from "./components/CreateChallengeModal";
import { ProgramNoticias } from "./pages/ProgramNoticias";
import { CreateNoticia } from "./pages/CreateNoticia";
import { EditNoticia } from "./pages/EditNoticia";
import { CloneNoticia } from "./pages/CloneNoticia";
import { CreatePopup } from "./pages/CreatePopup";
import { EditPopup } from "./pages/EditPopup";
import { ClonePopup } from "./pages/ClonePopup";
import { ProgramReconocimientos } from "./pages/ProgramReconocimientos";
import { ProgramReportes } from "./pages/ProgramReportes";
import { Configuracion } from "./pages/Configuracion";
import { Catalogo } from "./pages/Catalogo";
import { Banners } from "./pages/Banners";
import { BannersCrear } from "./pages/BannersCrear";
import { BannersEditar } from "./pages/BannersEditar";
import { Administradores } from "./pages/Administradores";
import { Participants } from "./pages/Participants";
import { MiCuenta } from "./pages/MiCuenta";
import { ComunicacionesTransversalesMuro } from "./pages/ComunicacionesTransversalesMuro";
import { CreateComunicacionTransversal } from "./pages/CreateComunicacionTransversal";
import { EditComunicacionTransversal } from "./pages/EditComunicacionTransversal";
import { CloneComunicacionTransversal } from "./pages/CloneComunicacionTransversal";
import { ProgramsProvider } from './context/ProgramsContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Outlet } from 'react-router';

// Root layout component that wraps all routes with providers
// Updated: Added route for /programa/:programId/carga-puntos
function RootLayout() {
  console.log('🏗️ RootLayout: Renderizando...');
  
  return (
    <AuthProvider>
      <ToastProvider>
        <ProgramsProvider>
          <Outlet />
        </ProgramsProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        Component: Login,
      },
      {
        path: "/home",
        Component: Home,
      },
      {
        path: "/participantes",
        Component: Participants,
      },
      {
        path: "/programa/:programId",
        Component: ProgramDetail,
      },
      {
        path: "/programa/:programId/participantes",
        Component: ProgramParticipants,
      },
      {
        path: "/programa/:programId/puntos",
        Component: ProgramPointsLoad,
      },
      {
        path: "/programa/:programId/carga-puntos",
        Component: ProgramPointsLoad,
      },
      {
        path: "/programa/:programId/configuracion",
        Component: ProgramConfiguration,
      },
      {
        path: "/programa/:programId/desafios",
        Component: ProgramChallenges,
      },
      {
        path: "/programa/:programId/comunicaciones/muro",
        Component: ProgramNoticias,
      },
      {
        path: "/programa/:programId/comunicaciones/crear-noticia",
        Component: CreateNoticia,
      },
      {
        path: "/programa/:programId/comunicaciones/muro/editar/:noticiaId",
        Component: EditNoticia,
      },
      {
        path: "/programa/:programId/comunicaciones/muro/clonar/:noticiaId",
        Component: CloneNoticia,
      },
      {
        path: "/programa/:programId/comunicaciones/crear-popup",
        Component: CreatePopup,
      },
      {
        path: "/programa/:programId/comunicaciones/muro/editar-popup/:noticiaId",
        Component: EditPopup,
      },
      {
        path: "/programa/:programId/comunicaciones/muro/clonar-popup/:noticiaId",
        Component: ClonePopup,
      },
      {
        path: "/programa/:programId/reconocimientos",
        Component: ProgramReconocimientos,
      },
      {
        path: "/programa/:programId/reportes",
        Component: ProgramReportes,
      },
      {
        path: "/configuracion",
        Component: Configuracion,
      },
      {
        path: "/catalogo",
        Component: Catalogo,
      },
      {
        path: "/banners",
        Component: Banners,
      },
      {
        path: "/banners/crear",
        Component: BannersCrear,
      },
      {
        path: "/banners/editar/:bannerId",
        Component: BannersEditar,
      },
      {
        path: "/administradores",
        Component: Administradores,
      },
      {
        path: "/mi-cuenta",
        Component: MiCuenta,
      },
      {
        path: "/comunicaciones-transversales/muro",
        Component: ComunicacionesTransversalesMuro,
      },
      {
        path: "/comunicaciones-transversales/crear",
        Component: CreateComunicacionTransversal,
      },
      {
        path: "/comunicaciones-transversales/editar/:noticiaId",
        Component: EditComunicacionTransversal,
      },
      {
        path: "/comunicaciones-transversales/clonar/:noticiaId",
        Component: CloneComunicacionTransversal,
      },
      {
        path: "/comunicaciones",
        loader: () => {
          // Redirect old /comunicaciones to /banners
          window.location.href = "/banners";
          return null;
        },
      },
    ]
  }
]);