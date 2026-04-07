import { Home as HomeIcon, Users, Upload, Trophy, Megaphone, Award, FileText, Settings, ChevronDown, Coins } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import logoSavia from 'figma:asset/e6586f9eafb686170ce2c11ae52fcf10db69c0a4.png';

interface ProgramSidebarProps {
  activeMenu?: 'inicio' | 'participantes' | 'puntos' | 'desafios' | 'comunicaciones-muro' | 'reconocimientos' | 'reportes' | 'configuracion';
}

export function ProgramSidebar({ activeMenu }: ProgramSidebarProps) {
  const navigate = useNavigate();
  const { programId } = useParams();
  const [comunicacionesOpen, setComunicacionesOpen] = useState(activeMenu === 'comunicaciones-muro');

  const handleNavigate = (path: string) => {
    navigate(`/programa/${programId}${path}`);
  };

  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo SAWA */}
      <div className="p-4 border-b border-gray-200">
        <img src={logoSavia} alt="SAWA" className="h-8 w-auto object-contain" />
      </div>

      {/* Navegación */}
      <nav className="flex-1 p-3 space-y-1">
        {/* Inicio */}
        <button 
          onClick={() => handleNavigate('')}
          className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded transition-colors ${
            activeMenu === 'inicio' 
              ? 'bg-orange-500 text-white' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <HomeIcon className="w-4 h-4" />
          <span>Inicio</span>
        </button>

        {/* Participantes */}
        <button 
          onClick={() => handleNavigate('/participantes')}
          className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded transition-colors ${
            activeMenu === 'participantes' 
              ? 'bg-orange-500 text-white' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Participantes</span>
        </button>

        {/* Puntos */}
        <button 
          onClick={() => handleNavigate('/puntos')}
          className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded transition-colors ${
            activeMenu === 'puntos' 
              ? 'bg-orange-500 text-white' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>Puntos</span>
        </button>

        {/* Desafíos */}
        <button 
          onClick={() => handleNavigate('/desafios')}
          className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded transition-colors ${
            activeMenu === 'desafios' 
              ? 'bg-orange-500 text-white' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Desafíos</span>
        </button>

        {/* Comunicaciones (con dropdown) */}
        <div>
          <button 
            onClick={() => setComunicacionesOpen(!comunicacionesOpen)}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded transition-colors ${
              activeMenu === 'comunicaciones-muro'
                ? 'bg-orange-500 text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4" />
              <span>Comunicaciones</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${comunicacionesOpen ? 'rotate-180' : ''}`} />
          </button>
          {comunicacionesOpen && (
            <div className="ml-6 mt-1 space-y-1">
              <button 
                onClick={() => handleNavigate('/comunicaciones/muro')}
                className={`w-full flex items-center px-3 py-1.5 text-sm rounded transition-colors ${
                  activeMenu === 'comunicaciones-muro'
                    ? 'bg-white text-gray-900 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>Muro</span>
              </button>
            </div>
          )}
        </div>

        {/* Reconocimientos */}
        <button 
          onClick={() => handleNavigate('/reconocimientos')}
          className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded transition-colors ${
            activeMenu === 'reconocimientos' 
              ? 'bg-orange-500 text-white' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Reconocimientos</span>
        </button>

        {/* Reportes */}
        <button 
          onClick={() => handleNavigate('/reportes')}
          className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded transition-colors ${
            activeMenu === 'reportes' 
              ? 'bg-orange-500 text-white' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Reportes</span>
        </button>

        {/* Configuración */}
        <button 
          onClick={() => handleNavigate('/configuracion')}
          className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded transition-colors ${
            activeMenu === 'configuracion' 
              ? 'bg-orange-500 text-white' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Configuración</span>
        </button>
      </nav>
    </aside>
  );
}