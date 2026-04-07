import { useNavigate } from 'react-router';
import logoSavia from 'figma:asset/e6586f9eafb686170ce2c11ae52fcf10db69c0a4.png';

interface SuperAdminSidebarProps {
  activeMenu?: string;
}

export function SuperAdminSidebar({ activeMenu }: SuperAdminSidebarProps) {
  const navigate = useNavigate();

  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo SAWA */}
      <div className="p-4 border-b border-gray-200">
        <img src={logoSavia} alt="SAVIA" className="h-8 w-auto object-contain" />
      </div>

      {/* Navegación */}
      <nav className="flex-1 p-3 space-y-1">
        {/* Programas */}
        <button 
          onClick={() => navigate('/home')}
          className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded transition-colors ${
            activeMenu === 'programas' 
              ? 'bg-gray-100 text-gray-900' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span>Programas</span>
        </button>

        {/* Participantes */}
        <button 
          onClick={() => navigate('/participantes')}
          className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded transition-colors ${
            activeMenu === 'participantes' 
              ? 'bg-gray-100 text-gray-900' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span>Participantes</span>
        </button>

        {/* Administradores */}
        <button 
          onClick={() => navigate('/administradores')}
          className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded transition-colors ${
            activeMenu === 'administradores' 
              ? 'bg-gray-100 text-gray-900' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>Administradores</span>
        </button>

        {/* Configuración */}
        <button 
          onClick={() => navigate('/configuracion')}
          className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded transition-colors ${
            activeMenu === 'configuracion' 
              ? 'bg-gray-100 text-gray-900' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Configuración</span>
        </button>

        {/* Comunicaciones Transversales */}
        <div>
          <button 
            className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded transition-colors ${
              activeMenu === 'comunicaciones-transversales'
                ? 'bg-orange-500 text-white'
                : 'bg-orange-500 text-white'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
            <span className="flex-1 text-left">Comunicaciones</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}
