import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import logoSavia from 'figma:asset/e6586f9eafb686170ce2c11ae52fcf10db69c0a4.png';
import { Search, Copy, Edit, Trash2, ChevronDown, GripVertical } from 'lucide-react';
import { usePrograms } from '../context/ProgramsContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface Banner {
  id: string;
  nombre: string;
  catalogos: string[];
  inicio: string;
  deshabilitar: string;
  estado: 'Habilitado' | 'Deshabilitado';
}

export function BannersList() {
  const navigate = useNavigate();
  const { programs } = usePrograms();
  const { currentUser, logout } = useAuth();
  const { showSuccess } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [catalogoOpen, setCatalogoOpen] = useState(true);
  const [comunicacionesTransversalesOpen, setComunicacionesTransversalesOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Estados de filtros
  const [nombreFilter, setNombreFilter] = useState('');
  const [catalogosFilter, setCatalogosFilter] = useState('');
  const [inicioFilter, setInicioFilter] = useState('');
  const [deshabilitarFilter, setDeshabilitarFilter] = useState('');
  const [estadoFilter, setEstadoFilter] = useState<string>('Todos');

  // Datos de ejemplo
  const [banners, setBanners] = useState<Banner[]>([
    {
      id: '1',
      nombre: 'test 2',
      catalogos: ['Prueba (1040)'],
      inicio: '16-03-2026, 17:03',
      deshabilitar: '31-03-2026, 17:03',
      estado: 'Habilitado'
    },
    {
      id: '2',
      nombre: 'test 3',
      catalogos: ['Prueba (1040)'],
      inicio: '16-03-2026, 17:13',
      deshabilitar: '23-03-2026, 17:13',
      estado: 'Deshabilitado'
    },
    {
      id: '3',
      nombre: 'test 2',
      catalogos: ['Prueba (1040)'],
      inicio: '17-03-2026, 15:31',
      deshabilitar: '05-04-2026, 15:31',
      estado: 'Habilitado'
    }
  ]);

  // Cerrar menús al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDuplicate = (id: string) => {
    showSuccess('Banner duplicado exitosamente');
  };

  const handleEdit = (id: string) => {
    navigate(`/banners/editar/${id}`);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este banner?')) {
      setBanners(banners.filter(b => b.id !== id));
      showSuccess('Banner eliminado exitosamente');
    }
  };

  const limpiarFiltros = () => {
    setNombreFilter('');
    setCatalogosFilter('');
    setInicioFilter('');
    setDeshabilitarFilter('');
    setEstadoFilter('Todos');
  };

  // Filtrar banners
  const filteredBanners = banners.filter(banner => {
    if (nombreFilter && !banner.nombre.toLowerCase().includes(nombreFilter.toLowerCase())) return false;
    if (catalogosFilter && !banner.catalogos.some(c => c.toLowerCase().includes(catalogosFilter.toLowerCase()))) return false;
    if (inicioFilter && !banner.inicio.includes(inicioFilter)) return false;
    if (deshabilitarFilter && !banner.deshabilitar.includes(deshabilitarFilter)) return false;
    if (estadoFilter !== 'Todos' && banner.estado !== estadoFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      {/* Sidebar */}
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
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span>Programas</span>
          </button>

          {/* Participantes */}
          <button 
            onClick={() => navigate('/participantes')}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>Participantes</span>
          </button>

          {/* Administradores */}
          <button 
            onClick={() => navigate('/administradores')}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Administradores</span>
          </button>

          {/* Configuración */}
          <button 
            onClick={() => navigate('/configuracion')}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Configuración</span>
          </button>

          {/* Catálogo */}
          <div>
            <button 
              onClick={() => setCatalogoOpen(!catalogoOpen)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="flex-1 text-left">Catálogo</span>
              <svg 
                className={`w-4 h-4 transition-transform ${catalogoOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Submenú */}
            {catalogoOpen && (
              <div className="mt-1 ml-6 space-y-1">
                <button 
                  onClick={() => navigate('/catalogo')}
                  className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 rounded transition-colors"
                >
                  Categorías
                </button>
                <button 
                  className="w-full text-left px-3 py-1.5 text-xs bg-orange-500 text-white rounded transition-colors"
                >
                  Banners
                </button>
              </div>
            )}
          </div>

          {/* Comunicaciones Transversales */}
          <div>
            <button 
              onClick={() => setComunicacionesTransversalesOpen(!comunicacionesTransversalesOpen)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              <span className="flex-1 text-left">Comunicaciones Transversales</span>
              <svg 
                className={`w-4 h-4 transition-transform ${comunicacionesTransversalesOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Submenú de comunicaciones transversales */}
            {comunicacionesTransversalesOpen && (
              <div className="ml-6 mt-1 space-y-1">
                <button 
                  onClick={() => navigate('/comunicaciones-transversales/muro')}
                  className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 rounded transition-colors"
                >
                  Muro
                </button>
                <button 
                  className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 rounded transition-colors"
                >
                  Notificaciones Push
                </button>
                <button 
                  className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 rounded transition-colors"
                >
                  Emails
                </button>
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          {/* Contenedor central con buscador */}
          <div className="flex-1 flex items-center gap-4">
            {/* Buscador con dropdown de programas */}
            <div className="flex-1 max-w-md relative" ref={searchRef}>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between hover:border-gray-400 transition-colors bg-white"
              >
                <div className="flex items-center gap-2">
                  <svg 
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="11" cy="11" r="8" strokeWidth="2" />
                    <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span className="text-gray-500">Buscar programa...</span>
                </div>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown de programas */}
              {isSearchOpen && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-80 overflow-y-auto">
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      navigate('/home');
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium text-gray-900">Super Admin</span>
                  </button>
                  
                  {programs.length > 0 && (
                    <>
                      <div className="border-t border-gray-200 my-1"></div>
                      <div className="px-4 py-2 text-xs text-gray-500 uppercase tracking-wider">
                        Programas
                      </div>
                      {programs.map(prog => (
                        <button
                          key={prog.id}
                          onClick={() => {
                            setIsSearchOpen(false);
                            navigate(`/programa/${prog.id}`);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <div className="font-medium">{prog.name}</div>
                          <div className="text-xs text-gray-500">Código: {prog.code}</div>
                        </button>
                      ))}