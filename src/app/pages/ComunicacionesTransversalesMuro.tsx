import { Search, Edit, Copy, Trash2, Plus, ChevronDown, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { usePrograms } from '../context/ProgramsContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CreateCommunicationModalTransversal } from '../components/CreateCommunicationModalTransversal';
import logoSavia from 'figma:asset/e6586f9eafb686170ce2c11ae52fcf10db69c0a4.png';

// Componente para mostrar programas destino con hover
function ProgramasDestinoCell({ programas }: { programas: any[] }) {
  const [showAll, setShowAll] = useState(false);
  
  if (programas.length === 0) return <span>—</span>;
  
  const first5 = programas.slice(0, 5);
  const remaining = programas.slice(5);
  
  return (
    <div className="text-gray-900">
      {first5.map((prog, index) => (
        <span key={prog.id}>
          {prog.name}
          {index < first5.length - 1 && ', '}
        </span>
      ))}
      {remaining.length > 0 && (
        <span className="relative inline-block">
          <span 
            className="cursor-help text-gray-500"
            onMouseEnter={() => setShowAll(true)}
            onMouseLeave={() => setShowAll(false)}
          >
            ...
          </span>
          {showAll && (
            <div 
              className="absolute left-0 top-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-10 whitespace-nowrap"
              onMouseEnter={() => setShowAll(true)}
              onMouseLeave={() => setShowAll(false)}
            >
              {remaining.map((prog, index) => (
                <div key={prog.id} className="text-sm text-gray-700">
                  {prog.name}
                </div>
              ))}
            </div>
          )}
        </span>
      )}
    </div>
  );
}

export function ComunicacionesTransversalesMuro() {
  const navigate = useNavigate();
  const { programs, comunicacionesTransversales = [], deleteComunicacionTransversal, cloneComunicacionTransversal, deleteComunicacion, comunicaciones } = usePrograms();
  const { currentUser, logout } = useAuth();
  const { showSuccess } = useToast();

  // Estados para filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [contentFilter, setContentFilter] = useState('Todos los contenidos');
  const [statusFilter, setStatusFilter] = useState('Todos los estados');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [catalogoOpen, setCatalogoOpen] = useState(false);
  const [comunicacionesTransversalesOpen, setComunicacionesTransversalesOpen] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [showNewCommunicationModal, setShowNewCommunicationModal] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

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

  // Función para formatear fechas
  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  // Función para obtener el color del estado
  const getStatusColor = (estado: string) => {
    switch(estado) {
      case 'Borrador': return 'bg-gray-100 text-gray-700';
      case 'Programada': return 'bg-blue-50 text-blue-700';
      case 'Publicada': return 'bg-green-50 text-green-700';
      case 'Despublicada': return 'bg-red-50 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Función para calcular programas destino
  const getProgramasDestino = (comunicacion: any) => {
    if (!comunicacion.segmentacionGlobal) return [];
    
    let programasDestino: any[] = [];
    
    if (comunicacion.segmentacionGlobal.tipo === 'all') {
      // Todos los programas activos
      programasDestino = programs.filter(p => p.status === 'Activa');
    } else if (comunicacion.segmentacionGlobal.tipo === 'manual' && comunicacion.segmentacionGlobal.programasSeleccionados) {
      // Programas seleccionados manualmente
      const programasIds = comunicacion.segmentacionGlobal.programasSeleccionados;
      programasDestino = programs.filter(p => programasIds.includes(p.id));
    } else if (comunicacion.segmentacionGlobal.tipo === 'csvGlobal') {
      // Todos los programas activos
      programasDestino = programs.filter(p => p.status === 'Activa');
    }
    
    // Ordenar alfabéticamente por nombre
    return programasDestino.sort((a, b) => a.name.localeCompare(b.name));
  };

  // Función para manejar eliminación
  const handleDelete = (item: any) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      // Eliminar la comunicación transversal
      deleteComunicacionTransversal(itemToDelete.id);
      
      // Eliminar también las copias en los programas
      const comunicacionesVinculadas = comunicaciones.filter(
        (c: any) => c.transversalId === itemToDelete.id
      );
      comunicacionesVinculadas.forEach((c: any) => {
        deleteComunicacion(c.id);
      });
      
      showSuccess('Comunicación transversal eliminada exitosamente');
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const handleClone = (item: any) => {
    const newId = cloneComunicacionTransversal(item.id);
    if (newId) {
      showSuccess('Comunicación transversal clonada exitosamente');
      navigate(`/comunicaciones-transversales/clonar/${item.id}?tipo=${item.contenido}`);
    }
  };

  const handleEdit = (item: any) => {
    navigate(`/comunicaciones-transversales/editar/${item.id}?tipo=${item.contenido}`);
  };

  // Filtrar comunicaciones
  const filteredComunicaciones = comunicacionesTransversales.filter((item: any) => {
    const matchesSearch = item.titulo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesContent = contentFilter === 'Todos los contenidos' || item.contenido === contentFilter;
    const matchesStatus = statusFilter === 'Todos los estados' || item.estado === statusFilter;
    return matchesSearch && matchesContent && matchesStatus;
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
              <ChevronDown className={`w-4 h-4 transition-transform ${catalogoOpen ? 'rotate-180' : ''}`} />
            </button>

            {catalogoOpen && (
              <div className="ml-6 mt-1 space-y-1">
                <button 
                  onClick={() => navigate('/catalogo')}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors"
                >
                  <span>Categorías</span>
                </button>
              </div>
            )}
          </div>

          {/* Comunicaciones Transversales */}
          <div>
            <button 
              onClick={() => setComunicacionesTransversalesOpen(!comunicacionesTransversalesOpen)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-orange-500 text-white rounded transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              <span className="flex-1 text-left">Comunicaciones Transversales</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${comunicacionesTransversalesOpen ? 'rotate-180' : ''}`} />
            </button>

            {comunicacionesTransversalesOpen && (
              <div className="ml-6 mt-1 space-y-1">
                <button 
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded transition-colors"
                >
                  <span>Muro</span>
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
          <div className="flex-1 flex items-center gap-4">
            <div className="flex-1 max-w-md relative" ref={searchRef}>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between hover:border-gray-400 transition-colors bg-white"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" strokeWidth="2" />
                    <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span className="text-gray-500">Buscar programa...</span>
                </div>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

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
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Usuario */}
          <div className="flex items-center gap-4">
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
              >
                <div className="text-right">
                  <div className="text-sm text-gray-900">{currentUser.name}</div>
                  <div className="text-xs text-gray-500">{currentUser.role}</div>
                </div>
                <div className="w-10 h-10 bg-pink-400 rounded-full flex items-center justify-center font-semibold text-white">
                  {currentUser.initials}
                </div>
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate('/mi-cuenta');
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Mi Cuenta
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Contenido de la página */}
        <main className="flex-1 p-8">
          {/* Título */}
          <h1 className="text-2xl mb-6">Muro</h1>

          {/* Contenedor de la tabla con filtros */}
          <div className="bg-white rounded-lg shadow-sm">
            {/* Barra de búsqueda, filtros y botón */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-4">
              {/* Buscador - más largo */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por título..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Filtro de contenido */}
              <select
                value={contentFilter}
                onChange={(e) => setContentFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                <option>Todos los contenidos</option>
                <option>Noticia</option>
                <option>Pop-up</option>
              </select>

              {/* Filtro de estado */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                <option>Todos los estados</option>
                <option>Borrador</option>
                <option>Programada</option>
                <option>Publicada</option>
                <option>Despublicada</option>
              </select>

              {/* Botón Nueva comunicación */}
              <button 
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm whitespace-nowrap"
                onClick={() => setShowNewCommunicationModal(true)}
              >
                <Plus className="w-4 h-4" />
                Nueva comunicación
              </button>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm text-gray-600">TÍTULO</th>
                    <th className="px-6 py-3 text-left text-sm text-gray-600">CONTENIDO</th>
                    <th className="px-6 py-3 text-left text-sm text-gray-600">ESTADO</th>
                    <th className="px-6 py-3 text-left text-sm text-gray-600">FECHA CREACIÓN</th>
                    <th className="px-6 py-3 text-left text-sm text-gray-600">FECHA PUBLICACIÓN</th>
                    <th className="px-6 py-3 text-left text-sm text-gray-600">PROGRAMAS DESTINO</th>
                    <th className="px-6 py-3 text-left text-sm text-gray-600">ACCIONES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredComunicaciones.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                        No hay comunicaciones transversales disponibles
                      </td>
                    </tr>
                  ) : (
                    filteredComunicaciones.map((item: any) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-gray-900">{item.titulo}</td>
                        <td className="px-6 py-4 text-gray-600">{item.contenido}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(item.estado)}`}>
                            {item.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{formatDate(item.fechaCreacion)}</td>
                        <td className="px-6 py-4 text-gray-600">{formatDate(item.fechaPublicacion)}</td>
                        <td className="px-6 py-4 text-gray-900 font-semibold">
                          <ProgramasDestinoCell programas={getProgramasDestino(item)} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleEdit(item)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleClone(item)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                              title="Clonar"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item)}
                              className="text-gray-400 hover:text-red-600 transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">Confirmar eliminación</h3>
              <p className="text-gray-600 mb-6">
                ¿Estás seguro de que deseas eliminar esta comunicación transversal? Esta acción no se puede deshacer y eliminará el contenido de todos los programas vinculados.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setItemToDelete(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de nueva comunicación */}
      {showNewCommunicationModal && (
        <CreateCommunicationModalTransversal
          onClose={() => setShowNewCommunicationModal(false)}
        />
      )}
    </div>
  );
}