import { Construction, Home as HomeIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { usePrograms } from '../context/ProgramsContext';
import { ProgramSidebar } from '../components/ProgramSidebar';
import { ProgramHeader } from '../components/ProgramHeader';

interface WorkInProgressProps {
  activeMenu?: 'inicio' | 'participantes' | 'puntos' | 'desafios' | 'muro-noticias' | 'reconocimientos' | 'reportes' | 'configuracion';
  title?: string;
}

export function WorkInProgress({ activeMenu, title = 'Esta sección' }: WorkInProgressProps) {
  const navigate = useNavigate();
  const { programId } = useParams();
  const { getProgram } = usePrograms();

  const program = getProgram(programId || '');

  // Si no existe el programa, redirigir al home
  if (!program && programId) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Programa no encontrado</h1>
          <button 
            onClick={() => navigate('/home')}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Volver a Super Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      {/* Sidebar */}
      <ProgramSidebar activeMenu={activeMenu} />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <ProgramHeader />

        {/* Contenido de la página */}
        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center max-w-md">
            {/* Icono de construcción */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 mb-6">
              <Construction className="w-10 h-10 text-orange-500" />
            </div>

            {/* Título */}
            <h1 className="text-3xl font-semibold text-gray-900 mb-4">
              Work in Progress
            </h1>

            {/* Descripción */}
            <p className="text-gray-600 mb-8">
              {title} está actualmente en desarrollo. Pronto estará disponible con todas sus funcionalidades.
            </p>

            {/* Botón para volver */}
            <button 
              onClick={() => navigate(`/programa/${programId}`)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <HomeIcon className="w-4 h-4" />
              Volver al inicio
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
