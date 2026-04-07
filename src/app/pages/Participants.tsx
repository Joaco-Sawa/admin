import { UserPlus, ChevronDown, X, UploadCloud, MoreVertical, Pencil, Trash2, User, Phone, Calendar, Search, Mail } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { usePrograms } from '../context/ProgramsContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import logoSavia from 'figma:asset/e6586f9eafb686170ce2c11ae52fcf10db69c0a4.png';

// Función helper para formatear fechas en formato dd/mm/yyyy hh:mm
function formatDateTime(dateString: string | null): string {
  if (!dateString) return 'Nunca';
  
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export function Participants() {
  const navigate = useNavigate();
  const { programs, getAllParticipants, updateParticipant, deleteParticipant, getProgram } = usePrograms();
  const { currentUser, logout } = useAuth();
  const { showSuccess } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMagicLinkModal, setShowMagicLinkModal] = useState(false);
  const [selectedParticipantEmail, setSelectedParticipantEmail] = useState('');
  const [editingParticipant, setEditingParticipant] = useState<any>(null);
  const [supervisorSearch, setSupervisorSearch] = useState('');
  const [showSupervisorDropdown, setShowSupervisorDropdown] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [editedPhone, setEditedPhone] = useState('');
  const [editedBirthDate, setEditedBirthDate] = useState('');
  const [catalogoOpen, setCatalogoOpen] = useState(false);
  const [participantSearch, setParticipantSearch] = useState('');
  const [segmentacionesValues, setSegmentacionesValues] = useState<{[key: string]: string}>({});
  const [segmentacionesDropdownOpen, setSegmentacionesDropdownOpen] = useState<{[key: string]: boolean}>({});
  const [comunicacionesTransversalesOpen, setComunicacionesTransversalesOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const editModalRef = useRef<HTMLDivElement>(null);
  const supervisorSearchRef = useRef<HTMLDivElement>(null);

  // Obtener TODOS los participantes de TODOS los programas
  const allParticipants = getAllParticipants();

  // Filtrar participantes por búsqueda
  const filteredParticipants = allParticipants.filter(participant => {
    if (!participantSearch) return true;
    const searchLower = participantSearch.toLowerCase();
    return (
      participant.name.toLowerCase().includes(searchLower) ||
      participant.email.toLowerCase().includes(searchLower)
    );
  });

  // Cerrar menús al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (editModalRef.current && !editModalRef.current.contains(event.target as Node)) {
        setShowEditModal(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Limpiar estados al desmontar el componente
  useEffect(() => {
    return () => {
      setIsMenuOpen(false);
      setIsSearchOpen(false);
      setShowEditModal(false);
      setCatalogoOpen(false);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSuperAdmin = () => {
    navigate('/home');
  };

  const handleSendMagicLink = (email: string) => {
    setSelectedParticipantEmail(email);
    setShowMagicLinkModal(true);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
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

          {/* Participantes - Activo */}
          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-orange-500 text-white rounded transition-colors">
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
                  onClick={() => navigate('/banners')}
                  className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 rounded transition-colors"
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
              <ChevronDown className={`w-4 h-4 transition-transform ${comunicacionesTransversalesOpen ? 'rotate-180' : ''}`} />
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
                <svg 
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown de programas */}
              {isSearchOpen && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-80 overflow-y-auto">
                  <button
                    onClick={handleSuperAdmin}
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

                  {programs.length === 0 && (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      No hay programas disponibles
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Usuario con menú desplegable */}
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

            {/* Menú desplegable */}
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
        </header>

        {/* Contenido de la página */}
        <main className="flex-1 p-8 overflow-x-hidden">
          {/* Header de la sección */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl">Participantes</h1>
          </div>

          {/* Sección Todos los participantes */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Buscador dentro del contenedor */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o correo..."
                  value={participantSearch}
                  onChange={(e) => setParticipantSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Programa
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Onboard
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Último Acceso
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Saldo de Pts
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Habilitado
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredParticipants.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        {participantSearch ? 'No se encontraron participantes con ese criterio de búsqueda' : 'No hay participantes en ningún programa'}
                      </td>
                    </tr>
                  ) : (
                    filteredParticipants.map((participant) => {
                      const program = getProgram(participant.programId);
                      return (
                        <tr key={participant.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium text-gray-900">{participant.name}</div>
                              <div className="text-sm text-gray-500">{participant.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium text-gray-900">{program?.name || 'Desconocido'}</div>
                              <div className="text-xs text-gray-500">{program?.code || 'N/A'}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              participant.onboard ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {participant.onboard ? 'Completado' : 'No completado'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {formatDateTime(participant.lastAccess)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {participant.pointsBalance.toLocaleString()} pts
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-900">
                              {participant.enabled ? 'SI' : 'NO'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button 
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Editar"
                                onClick={() => {
                                  const freshParticipant = allParticipants.find(p => p.id === participant.id);
                                  setEditingParticipant(freshParticipant || participant);
                                  
                                  // Inicializar los valores editables
                                  setEditedName((freshParticipant || participant).name);
                                  setEditedEmail((freshParticipant || participant).email);
                                  setEditedPhone((freshParticipant || participant).phone || '');
                                  setEditedBirthDate((freshParticipant || participant).birthDate || '');
                                  
                                  // Inicializar el campo de búsqueda con el supervisor actual
                                  if (freshParticipant?.supervisorId) {
                                    const currentSupervisor = allParticipants.find(p => p.id === freshParticipant.supervisorId);
                                    setSupervisorSearch(currentSupervisor?.name || '');
                                  } else {
                                    setSupervisorSearch('');
                                  }
                                  
                                  // Inicializar las segmentaciones del participante
                                  const programData = getProgram((freshParticipant || participant).programId);
                                  if (programData?.segmentaciones) {
                                    const initialSegmentaciones: {[key: string]: string} = {};
                                    programData.segmentaciones.forEach(seg => {
                                      initialSegmentaciones[seg.nombre] = (freshParticipant || participant).segmentaciones?.[seg.nombre] || '';
                                    });
                                    setSegmentacionesValues(initialSegmentaciones);
                                  } else {
                                    setSegmentacionesValues({});
                                  }
                                  setSegmentacionesDropdownOpen({});
                                  
                                  setShowEditModal(true);
                                }}
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              {!participant.onboard && (
                                <button 
                                  className="flex items-center gap-1 px-2 py-1.5 text-gray-700 hover:bg-gray-100 rounded transition-colors"
                                  title="Enviar Magic Link"
                                  onClick={() => handleSendMagicLink(participant.email)}
                                >
                                  <Mail className="w-4 h-4" />
                                  <span className="text-xs font-medium">ML</span>
                                </button>
                              )}
                              <button 
                                className="p-1 hover:bg-red-100 rounded transition-colors"
                                title="Eliminar"
                                onClick={() => {
                                  if (confirm(`¿Estás seguro de eliminar a ${participant.name}?`)) {
                                    deleteParticipant(participant.id);
                                  }
                                }}
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Modal Editar Participante */}
      {showEditModal && editingParticipant && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.08)' }}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" ref={editModalRef}>
            {/* Header del modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-xl font-medium">Editar Participante</h2>
              <button 
                className="text-gray-400 hover:text-gray-600 transition-colors" 
                onClick={() => {
                  setShowEditModal(false);
                  setEditingParticipant(null);
                }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6 space-y-6">
              {/* Información del participante */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="space-y-3">
                      {/* Nombre */}
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Nombre</label>
                        <input
                          type="text"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          className="w-full px-3 py-2 text-base font-semibold border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      {/* Email */}
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Email</label>
                        <input
                          type="email"
                          value={editedEmail}
                          onChange={(e) => setEditedEmail(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        {/* Teléfono */}
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1.5">
                            <Phone className="w-3 h-3 inline mr-1" />
                            Teléfono
                          </label>
                          <input
                            type="tel"
                            value={editedPhone}
                            onChange={(e) => setEditedPhone(e.target.value)}
                            placeholder="+56912345678"
                            className="w-full px-3 py-2 text-sm border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        
                        {/* Fecha de nacimiento */}
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1.5">
                            <Calendar className="w-3 h-3 inline mr-1" />
                            Fecha de nacimiento
                          </label>
                          <input
                            type="text"
                            value={editedBirthDate}
                            onChange={(e) => setEditedBirthDate(e.target.value)}
                            placeholder="DD-MM-YYYY"
                            className="w-full px-3 py-2 text-sm border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Programa al que pertenece */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <p className="text-sm font-medium text-gray-500 mb-1">Programa</p>
                <p className="text-base font-semibold text-gray-900">
                  {getProgram(editingParticipant.programId)?.name || 'Desconocido'}
                </p>
                <p className="text-xs text-gray-500">
                  Código: {getProgram(editingParticipant.programId)?.code || 'N/A'}
                </p>
              </div>

              {/* Formulario de edición */}
              <div className="space-y-6">
                {/* Estado */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Estado</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {/* Onboard completado */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Onboard completado</p>
                        <p className="text-xs text-gray-500">Estado del proceso de incorporación</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateParticipant(editingParticipant.id, { onboard: !editingParticipant.onboard })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          editingParticipant.onboard ? 'bg-green-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            editingParticipant.onboard ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Habilitado */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Habilitado</p>
                        <p className="text-xs text-gray-500">Acceso a la plataforma</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateParticipant(editingParticipant.id, { enabled: !editingParticipant.enabled })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          editingParticipant.enabled ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            editingParticipant.enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Información adicional */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Información</h4>
                  
                  <div className="grid grid-cols-2 gap-6">
                    {/* Último acceso */}
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Último acceso</p>
                      <p className="text-base text-gray-900">
                        {formatDateTime(editingParticipant.lastAccess)}
                      </p>
                    </div>

                    {/* Saldo de puntos */}
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Saldo de puntos</p>
                      <p className="text-base text-gray-900 font-semibold">
                        {editingParticipant.pointsBalance.toLocaleString()} pts
                      </p>
                    </div>
                  </div>

                  {/* Fecha de creación */}
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Fecha de creación</p>
                    <p className="text-base text-gray-900">
                      {formatDateTime(editingParticipant.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Jerarquía */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Jerarquía</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {/* ¿Es supervisor? - Solo lectura */}
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">¿Es supervisor?</p>
                      <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                        {allParticipants.some(p => p.supervisorId === editingParticipant.id) ? 'Sí' : 'No'}
                      </div>
                    </div>

                    {/* Supervisor */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Supervisor
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Buscar supervisor"
                          value={supervisorSearch}
                          onChange={(e) => setSupervisorSearch(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          ref={supervisorSearchRef}
                          onFocus={() => setShowSupervisorDropdown(true)}
                          onBlur={() => setTimeout(() => setShowSupervisorDropdown(false), 200)}
                        />
                        {showSupervisorDropdown && (
                          <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto mt-1">
                            {allParticipants
                              .filter(p => 
                                p.programId === editingParticipant.programId && 
                                p.id !== editingParticipant.id && 
                                !allParticipants.some(x => x.supervisorId === p.id && x.id === editingParticipant.id)
                              )
                              .filter(p => 
                                p.name.toLowerCase().includes(supervisorSearch.toLowerCase()) ||
                                p.email.toLowerCase().includes(supervisorSearch.toLowerCase())
                              )
                              .map(supervisor => (
                                <div
                                  key={supervisor.id}
                                  className="px-3 py-2.5 cursor-pointer hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                                  onClick={() => {
                                    updateParticipant(editingParticipant.id, { supervisorId: supervisor.id });
                                    setSupervisorSearch(supervisor.name);
                                    setShowSupervisorDropdown(false);
                                  }}
                                >
                                  <div className="font-medium text-sm text-gray-900">{supervisor.name}</div>
                                  <div className="text-xs text-gray-500">{supervisor.email}</div>
                                </div>
                              ))
                            }
                            {allParticipants
                              .filter(p => 
                                p.programId === editingParticipant.programId && 
                                p.id !== editingParticipant.id && 
                                !allParticipants.some(x => x.supervisorId === p.id && x.id === editingParticipant.id)
                              )
                              .filter(p => 
                                p.name.toLowerCase().includes(supervisorSearch.toLowerCase()) ||
                                p.email.toLowerCase().includes(supervisorSearch.toLowerCase())
                              ).length === 0 && (
                                <div className="px-3 py-2.5 text-sm text-gray-500 text-center">
                                  No se encontraron participantes
                                </div>
                              )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Segmentaciones */}
                {(() => {
                  const programData = getProgram(editingParticipant.programId);
                  if (!programData?.segmentaciones || programData.segmentaciones.length === 0) {
                    return null;
                  }

                  return (
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Segmentaciones</h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        {programData.segmentaciones.map((segmentacion) => {
                          const currentValue = segmentacionesValues[segmentacion.nombre] || '';
                          const isDropdownOpen = segmentacionesDropdownOpen[segmentacion.nombre] || false;
                          
                          // Filtrar distribuciones por búsqueda
                          const filteredDistribuciones = segmentacion.distribuciones.filter(dist => 
                            dist.valor.toLowerCase().includes(currentValue.toLowerCase())
                          );

                          return (
                            <div key={segmentacion.id}>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                {segmentacion.nombre}
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  placeholder={`Buscar o crear ${segmentacion.nombre.toLowerCase()}...`}
                                  value={currentValue}
                                  onChange={(e) => {
                                    setSegmentacionesValues({
                                      ...segmentacionesValues,
                                      [segmentacion.nombre]: e.target.value
                                    });
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  onFocus={() => {
                                    setSegmentacionesDropdownOpen({
                                      ...segmentacionesDropdownOpen,
                                      [segmentacion.nombre]: true
                                    });
                                  }}
                                  onBlur={() => {
                                    setTimeout(() => {
                                      setSegmentacionesDropdownOpen({
                                        ...segmentacionesDropdownOpen,
                                        [segmentacion.nombre]: false
                                      });
                                    }, 200);
                                  }}
                                />
                                {isDropdownOpen && (
                                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto mt-1">
                                    {/* Opción "Vacío" */}
                                    <div
                                      className="px-3 py-2.5 cursor-pointer hover:bg-gray-100 border-b border-gray-100"
                                      onClick={() => {
                                        const updatedSegmentaciones = {
                                          ...(editingParticipant.segmentaciones || {}),
                                          [segmentacion.nombre]: null
                                        };
                                        updateParticipant(editingParticipant.id, {
                                          segmentaciones: updatedSegmentaciones
                                        });
                                        setSegmentacionesValues({
                                          ...segmentacionesValues,
                                          [segmentacion.nombre]: ''
                                        });
                                        setSegmentacionesDropdownOpen({
                                          ...segmentacionesDropdownOpen,
                                          [segmentacion.nombre]: false
                                        });
                                      }}
                                    >
                                      <div className="text-sm text-gray-500 italic">Vacío</div>
                                    </div>

                                    {/* Distribuciones existentes */}
                                    {filteredDistribuciones.length > 0 && (
                                      <>
                                        {filteredDistribuciones.map((dist, idx) => (
                                          <div
                                            key={idx}
                                            className="px-3 py-2.5 cursor-pointer hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                                            onClick={() => {
                                              const updatedSegmentaciones = {
                                                ...(editingParticipant.segmentaciones || {}),
                                                [segmentacion.nombre]: dist.valor
                                              };
                                              updateParticipant(editingParticipant.id, {
                                                segmentaciones: updatedSegmentaciones
                                              });
                                              setSegmentacionesValues({
                                                ...segmentacionesValues,
                                                [segmentacion.nombre]: dist.valor
                                              });
                                              setSegmentacionesDropdownOpen({
                                                ...segmentacionesDropdownOpen,
                                                [segmentacion.nombre]: false
                                              });
                                            }}
                                          >
                                            <div className="font-medium text-sm text-gray-900">{dist.valor}</div>
                                            <div className="text-xs text-gray-500">
                                              {dist.cantidad} participantes ({dist.porcentaje}%)
                                            </div>
                                          </div>
                                        ))}
                                      </>
                                    )}

                                    {/* Opción crear nueva distribución */}
                                    {currentValue.trim() && 
                                     !segmentacion.distribuciones.some(d => d.valor.toLowerCase() === currentValue.toLowerCase()) && (
                                      <div
                                        className="px-3 py-2.5 cursor-pointer hover:bg-gray-100 bg-blue-50 border-t border-blue-200"
                                        onClick={() => {
                                          const updatedSegmentaciones = {
                                            ...(editingParticipant.segmentaciones || {}),
                                            [segmentacion.nombre]: currentValue.trim()
                                          };
                                          updateParticipant(editingParticipant.id, {
                                            segmentaciones: updatedSegmentaciones
                                          });
                                          setSegmentacionesDropdownOpen({
                                            ...segmentacionesDropdownOpen,
                                            [segmentacion.nombre]: false
                                          });
                                          showSuccess(`Nueva distribución "${currentValue.trim()}" creada en ${segmentacion.nombre}`);
                                        }}
                                      >
                                        <div className="font-medium text-sm text-blue-700">
                                          Crear "{currentValue.trim()}"
                                        </div>
                                        <div className="text-xs text-blue-600">Nueva distribución</div>
                                      </div>
                                    )}

                                    {/* Mensaje de no resultados */}
                                    {filteredDistribuciones.length === 0 && !currentValue.trim() && (
                                      <div className="px-3 py-2.5 text-sm text-gray-500 text-center">
                                        No hay distribuciones disponibles
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* Botones de acción */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingParticipant(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      // Guardar todos los cambios
                      updateParticipant(editingParticipant.id, {
                        name: editedName,
                        email: editedEmail,
                        phone: editedPhone || null,
                        birthDate: editedBirthDate || null
                      });
                      showSuccess('Cambios guardados con éxito');
                      setShowEditModal(false);
                      setEditingParticipant(null);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Guardar cambios
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de Magic Link */}
      {showMagicLinkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h2 className="text-lg font-semibold mb-3">¿Estás seguro?</h2>
            <p className="text-sm text-gray-700 mb-6">
              ¿Quieres reenviar el magic link a <span className="font-medium">{selectedParticipantEmail}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowMagicLinkModal(false)}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShowMagicLinkModal(false);
                  showSuccess('Magic Link reenviado con éxito');
                }}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reenviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}