import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import logoSavia from 'figma:asset/e6586f9eafb686170ce2c11ae52fcf10db69c0a4.png';
import { ChevronDown, Pencil, Mail, Trash2, Search, X } from 'lucide-react';
import { usePrograms } from '../context/ProgramsContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface Administrator {
  id: string;
  name: string;
  email: string;
  program: string; // Cambiado de membership
  onboardCompleted: boolean;
  onboardDate: string | null;
  avatar: string;
  avatarColor: string;
}

export function Administradores() {
  const navigate = useNavigate();
  const { programs } = usePrograms();
  const { currentUser, logout } = useAuth();
  const { showSuccess } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [catalogoOpen, setCatalogoOpen] = useState(false);
  const [comunicacionesTransversalesOpen, setComunicacionesTransversalesOpen] = useState(false);
  const [selectedAdmins, setSelectedAdmins] = useState<string[]>([]);
  const [showMagicLinkModal, setShowMagicLinkModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAdminEmail, setSelectedAdminEmail] = useState<string>('');
  const [selectedAdminName, setSelectedAdminName] = useState<string>('');
  const [editingAdmin, setEditingAdmin] = useState<Administrator | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNewAdminModal, setShowNewAdminModal] = useState(false);
  const [adminSearch, setAdminSearch] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const newAdminModalRef = useRef<HTMLDivElement>(null);

  // Lista de administradores
  const [administrators] = useState<Administrator[]>([
    {
      id: '1',
      name: 'Francisca León',
      email: 'admin@example.com',
      program: 'Super Admin',
      onboardCompleted: true,
      onboardDate: '19/02/2026 14:30',
      avatar: 'F',
      avatarColor: '#EC4899'
    },
    {
      id: '2',
      name: 'Matías Cerfogli',
      email: 'mcerfogli@sawa.cl',
      program: 'Super Admin',
      onboardCompleted: false,
      onboardDate: null,
      avatar: 'M',
      avatarColor: '#9CA3AF'
    },
    {
      id: '3',
      name: 'Cristóbal Jara',
      email: 'cristobaljara@sawa.cl',
      program: 'Super Admin',
      onboardCompleted: false,
      onboardDate: null,
      avatar: 'C',
      avatarColor: '#9CA3AF'
    },
    {
      id: '4',
      name: 'James Hughes',
      email: 'jhughes@sawa.cl',
      program: 'Super Admin',
      onboardCompleted: false,
      onboardDate: null,
      avatar: 'J',
      avatarColor: '#9CA3AF'
    }
  ]);

  // Cerrar el menú al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (newAdminModalRef.current && !newAdminModalRef.current.contains(event.target as Node)) {
        setShowNewAdminModal(false);
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

  // Ordenar administradores: usuario logueado primero
  const sortedAdministrators = [...administrators].sort((a, b) => {
    if (a.email === currentUser.email) return -1;
    if (b.email === currentUser.email) return 1;
    return 0;
  });

  // Filtrar administradores por búsqueda
  const filteredAdministrators = sortedAdministrators.filter(admin => {
    if (!adminSearch) return true;
    const searchLower = adminSearch.toLowerCase();
    return (
      admin.name.toLowerCase().includes(searchLower) ||
      admin.email.toLowerCase().includes(searchLower)
    );
  });

  const toggleAdmin = (adminId: string) => {
    if (selectedAdmins.includes(adminId)) {
      setSelectedAdmins(selectedAdmins.filter(id => id !== adminId));
    } else {
      setSelectedAdmins([...selectedAdmins, adminId]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedAdmins.length === filteredAdministrators.length && filteredAdministrators.length > 0) {
      setSelectedAdmins([]);
    } else {
      setSelectedAdmins(filteredAdministrators.map(a => a.id));
    }
  };

  const handleSendMagicLink = (email: string) => {
    setSelectedAdminEmail(email);
    setShowMagicLinkModal(true);
  };

  const handleDeleteAdmin = (name: string, email: string) => {
    setSelectedAdminName(name);
    setSelectedAdminEmail(email);
    setShowDeleteModal(true);
  };

  const handleEditAdmin = (admin: Administrator) => {
    setEditingAdmin(admin);
    setIsSuperAdmin(admin.program === 'Super Admin');
    setSelectedPrograms([]);
    setShowEditModal(true);
  };

  const toggleProgram = (programId: string) => {
    if (selectedPrograms.includes(programId)) {
      setSelectedPrograms(selectedPrograms.filter(id => id !== programId));
    } else {
      setSelectedPrograms([...selectedPrograms, programId]);
    }
  };

  const handleSaveEdit = () => {
    // Aquí iría la lógica para guardar los cambios
    showSuccess('Cambios guardados con éxito');
    setShowEditModal(false);
    setEditingAdmin(null);
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
          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-orange-500 text-white rounded transition-colors">
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
        {/* Header superior */}
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

          {/* Usuario */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded-lg transition-colors"
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

        {/* Área de contenido */}
        <main className="flex-1 overflow-y-auto p-8 overflow-x-hidden">
          {/* Header con título y botón */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl">Administradores</h1>
            <button 
              onClick={() => setShowNewAdminModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Nuevo Administrador
            </button>
          </div>

          {/* Tabla */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Buscador dentro del contenedor */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o correo..."
                  value={adminSearch}
                  onChange={(e) => setAdminSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left w-12">
                      <input
                        type="checkbox"
                        checked={filteredAdministrators.length > 0 && selectedAdmins.length === filteredAdministrators.length}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                      Nombre Administrador
                    </th>
                    <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                      Programa
                    </th>
                    <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        Onboard
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                      Fecha Onboarding
                    </th>
                    <th className="px-4 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAdministrators.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                        {adminSearch ? 'No se encontraron administradores con ese criterio de búsqueda' : 'No hay administradores disponibles'}
                      </td>
                    </tr>
                  ) : (
                    filteredAdministrators.map((admin) => (
                    <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedAdmins.includes(admin.id)}
                          onChange={() => toggleAdmin(admin.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                            style={{ backgroundColor: admin.avatarColor }}
                          >
                            {admin.avatar}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                            <div className="text-sm text-gray-500">{admin.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-900">{admin.program}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          admin.onboardCompleted 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {admin.onboardCompleted ? 'Completado' : 'No Completado'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-900">
                          {admin.onboardDate || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Editar"
                            onClick={() => handleEditAdmin(admin)}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          {!admin.onboardCompleted && (
                            <button 
                              className="flex items-center gap-1 px-2 py-1.5 text-gray-700 hover:bg-gray-100 rounded transition-colors"
                              title="Enviar Magic Link"
                              onClick={() => handleSendMagicLink(admin.email)}
                            >
                              <Mail className="w-4 h-4" />
                              <span className="text-xs font-medium">ML</span>
                            </button>
                          )}
                          {admin.email !== currentUser.email && (
                            <button 
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                              title="Eliminar"
                              onClick={() => handleDeleteAdmin(admin.name, admin.email)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
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

      {/* Modal de confirmación de Magic Link */}
      {showMagicLinkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h2 className="text-lg font-semibold mb-3">¿Estás seguro?</h2>
            <p className="text-sm text-gray-700 mb-6">
              ¿Quieres reenviar el magic link a <span className="font-medium">{selectedAdminEmail}</span>?
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
                  // Aquí iría la lógica para enviar el magic link
                }}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reenviar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de Eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h2 className="text-lg font-semibold mb-3">¿Estás seguro?</h2>
            <p className="text-sm text-gray-700 mb-6">
              ¿Deseas eliminar al usuario <span className="font-medium">{selectedAdminName}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  // Aquí iría la lógica para eliminar el administrador
                }}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edición */}
      {showEditModal && editingAdmin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Editar Administrador</h2>
              <button 
                className="text-gray-400 hover:text-gray-600 transition-colors" 
                onClick={() => {
                  setShowEditModal(false);
                  setEditingAdmin(null);
                }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulario */}
            <div className="px-6 py-6 space-y-6">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo
                </label>
                <input
                  type="text"
                  defaultValue={editingAdmin.name}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ingresa el nombre completo"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  defaultValue={editingAdmin.email}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="correo@ejemplo.com"
                />
              </div>

              {/* Super Admin Checkbox */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSuperAdmin}
                    onChange={(e) => setIsSuperAdmin(e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Super Admin</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Este usuario tendrá acceso completo a todas las membresías y configuraciones de la plataforma
                    </div>
                  </div>
                </label>
              </div>

              {/* Membresías - Solo visible si NO es Super Admin */}
              {!isSuperAdmin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Membresías asignadas
                  </label>
                  <div className="border border-gray-200 rounded-lg p-4 space-y-2 max-h-64 overflow-y-auto">
                    {programs.length > 0 ? (
                      programs.map((program) => (
                        <label 
                          key={program.id}
                          className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedPrograms.includes(program.id)}
                            onChange={() => toggleProgram(program.id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">{program.name}</div>
                            <div className="text-xs text-gray-500">{program.client}</div>
                          </div>
                        </label>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500 text-center py-4">
                        No hay programas creados aún
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Selecciona uno o más programas a los que este administrador tendrá acceso
                  </p>
                </div>
              )}

              {/* Info message si es Super Admin */}
              {isSuperAdmin && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="text-sm text-blue-800">
                      Como Super Admin, este usuario tendrá acceso automático a todos los programas existentes y futuros.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer con botones */}
            <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingAdmin(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Nuevo Administrador */}
      {showNewAdminModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto" ref={newAdminModalRef}>
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Nuevo Administrador</h2>
              <button 
                className="text-gray-400 hover:text-gray-600 transition-colors" 
                onClick={() => setShowNewAdminModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulario */}
            <div className="px-6 py-6 space-y-6">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ingresa el nombre completo"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="correo@ejemplo.com"
                />
              </div>

              {/* Super Admin Checkbox */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSuperAdmin}
                    onChange={(e) => setIsSuperAdmin(e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Super Admin</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Este usuario tendrá acceso completo a todas las membresías y configuraciones de la plataforma
                    </div>
                  </div>
                </label>
              </div>

              {/* Membresías - Solo visible si NO es Super Admin */}
              {!isSuperAdmin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Membresías asignadas
                  </label>
                  <div className="border border-gray-200 rounded-lg p-4 space-y-2 max-h-64 overflow-y-auto">
                    {programs.length > 0 ? (
                      programs.map((program) => (
                        <label 
                          key={program.id}
                          className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedPrograms.includes(program.id)}
                            onChange={() => toggleProgram(program.id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">{program.name}</div>
                            <div className="text-xs text-gray-500">{program.client}</div>
                          </div>
                        </label>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500 text-center py-4">
                        No hay programas creados aún
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Selecciona uno o más programas a los que este administrador tendrá acceso
                  </p>
                </div>
              )}

              {/* Info message si es Super Admin */}
              {isSuperAdmin && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="text-sm text-blue-800">
                      Como Super Admin, este usuario tendrá acceso automático a todos los programas existentes y futuros.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer con botones */}
            <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowNewAdminModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  showSuccess('Administrador creado con éxito');
                  setShowNewAdminModal(false);
                  setIsSuperAdmin(false);
                  setSelectedPrograms([]);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Crear Administrador
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}