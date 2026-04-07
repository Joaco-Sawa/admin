import { Calendar, Download, Eye, Trash2, Edit, Copy, MoreVertical, BarChart3, CheckCircle, Search, X, Upload, Users, Trophy, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { usePrograms } from '../context/ProgramsContext';
import { CreateChallengeModal } from '../components/CreateChallengeModal';
import { UploadProgressModal } from '../components/UploadProgressModal';
import { ProgramSidebar } from '../components/ProgramSidebar';
import { ProgramHeader } from '../components/ProgramHeader';

export function ProgramChallenges() {
  const navigate = useNavigate();
  const { programId } = useParams();
  const { getProgram, addChallenge, getChallengesByProgram, deleteChallenge } = usePrograms();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMuroOpen, setIsMuroOpen] = useState(false);
  const [noticiasOpen, setNoticiasOpen] = useState(false);
  const [reconocimientosOpen, setReconocimientosOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);

  // Estados de filtros
  const [filterCode, setFilterCode] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Estado para controlar qué filtro está abierto
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const [filterPosition, setFilterPosition] = useState({ top: 0, left: 0 });

  // Función para abrir filtro y calcular posición
  const handleOpenFilter = (filterName: string, event: React.MouseEvent<HTMLButtonElement>) => {
    if (openFilter === filterName) {
      setOpenFilter(null);
    } else {
      const rect = event.currentTarget.getBoundingClientRect();
      setFilterPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX
      });
      setOpenFilter(filterName);
    }
  };

  // Obtener el programa actual desde el contexto
  const program = getProgram(programId || '');

  // Obtener desafíos del programa actual
  const programChallenges = getChallengesByProgram(programId || '');

  // Aplicar filtros a los desafíos
  const filteredChallenges = programChallenges.filter(challenge => {
    // Filtro por código
    if (filterCode && !challenge.code.toLowerCase().includes(filterCode.toLowerCase())) {
      return false;
    }

    // Filtro por nombre
    if (filterName && !challenge.name.toLowerCase().includes(filterName.toLowerCase())) {
      return false;
    }

    // Filtro por tipo
    if (filterType && challenge.type !== filterType) {
      return false;
    }

    // Filtro por fecha inicio
    if (filterStartDate && challenge.startDate < filterStartDate) {
      return false;
    }

    // Filtro por fecha término
    if (filterEndDate && challenge.endDate > filterEndDate) {
      return false;
    }

    // Filtro por estado
    if (filterStatus && challenge.status !== filterStatus) {
      return false;
    }

    return true;
  });

  // Calcular estadísticas
  const activeChallenges = programChallenges.filter(c => c.status === 'Activo').length;
  const finishedChallenges = programChallenges.filter(c => c.status === 'Finalizado').length;
  const totalParticipants = programChallenges.reduce((sum, c) => sum + c.participants, 0);

  // Función para formatear fecha
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Función para formatear hora
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Función para obtener el color del estado
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Activo': return 'bg-green-100 text-green-800';
      case 'Programado': return 'bg-blue-100 text-blue-800';
      case 'Borrador': return 'bg-gray-100 text-gray-800';
      case 'Finalizado': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Handlers
  const handleLogout = () => {
    navigate('/');
  };

  const handleSuperAdmin = () => {
    navigate('/home');
  };

  const handleProgramDetail = () => {
    navigate(`/programa/${programId}`);
  };

  const handleParticipantes = () => {
    navigate(`/programa/${programId}/participantes`);
  };

  const handleCargaPuntos = () => {
    navigate(`/programa/${programId}/carga-puntos`);
  };

  const handleConfiguracion = () => {
    navigate(`/programa/${programId}/configuracion`);
  };

  // Si no existe el programa, redirigir al home
  if (!program) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Programa no encontrado</h1>
          <button 
            onClick={handleSuperAdmin}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Volver a Super Admin
          </button>
        </div>
      </div>
    );
  }

  // Cerrar menús al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setActionMenuOpen(null);
      }
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setOpenFilter(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      {/* Sidebar */}
      <ProgramSidebar activeMenu="desafios" />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <ProgramHeader />

        {/* Contenido de la página */}
        <main className="flex-1 p-8 overflow-y-auto">
          {/* Header de la sección */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl">Desafíos</h1>
            <div className="flex gap-3">
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="px-4 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Carga Avances
              </button>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Crear Desafío
              </button>
            </div>
          </div>

          {/* Tarjetas de estadísticas */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Desafíos activos */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">Desafíos activos</span>
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="text-4xl font-semibold text-gray-900">{activeChallenges}</div>
            </div>

            {/* Total participantes */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">Total participantes</span>
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="text-4xl font-semibold text-gray-900">{totalParticipants}</div>
            </div>

            {/* Desafíos finalizados */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">Desafíos finalizados</span>
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <div className="text-4xl font-semibold text-gray-900">{finishedChallenges}</div>
            </div>
          </div>

          {/* Tabla de desafíos */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header de la tabla con botón Limpiar Filtros */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Todos los desafíos</h2>
              {(filterCode || filterName || filterType || filterStartDate || filterEndDate || filterStatus) && (
                <button
                  onClick={() => {
                    setFilterCode('');
                    setFilterName('');
                    setFilterType('');
                    setFilterStartDate('');
                    setFilterEndDate('');
                    setFilterStatus('');
                  }}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Limpiar Filtros
                </button>
              )}
            </div>

            {/* Tabla */}
            <div>
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {/* Código */}
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 relative">
                      <button
                        onClick={(e) => handleOpenFilter('code', e)}
                        className="flex items-center gap-1 hover:text-gray-900"
                      >
                        Código
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      {openFilter === 'code' && (
                        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-[100]">
                          <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              type="text"
                              value={filterCode}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value.length <= 50) {
                                  setFilterCode(value);
                                }
                              }}
                              placeholder="Buscar..."
                              maxLength={50}
                              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                          </div>
                        </div>
                      )}
                    </th>
                    
                    {/* Nombre */}
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 relative">
                      <button
                        onClick={(e) => handleOpenFilter('name', e)}
                        className="flex items-center gap-1 hover:text-gray-900"
                      >
                        Nombre
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      {openFilter === 'name' && (
                        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-[100]">
                          <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              type="text"
                              value={filterName}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value.length <= 50) {
                                  setFilterName(value);
                                }
                              }}
                              placeholder="Buscar..."
                              maxLength={50}
                              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                          </div>
                        </div>
                      )}
                    </th>
                    
                    {/* Tipo */}
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 relative">
                      <button
                        onClick={(e) => handleOpenFilter('type', e)}
                        className="flex items-center gap-1 hover:text-gray-900"
                      >
                        Tipo
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      {openFilter === 'type' && (
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[100]">
                          <button
                            onClick={() => {
                              setFilterType('');
                              setOpenFilter(null);
                            }}
                            className={`w-full px-4 py-2 text-left text-sm ${filterType === '' ? 'text-blue-600 font-medium' : 'text-gray-700'} hover:bg-gray-100 transition-colors`}
                          >
                            Todos
                          </button>
                          <button
                            onClick={() => {
                              setFilterType('Meta');
                              setOpenFilter(null);
                            }}
                            className={`w-full px-4 py-2 text-left text-sm ${filterType === 'Meta' ? 'text-blue-600 font-medium' : 'text-gray-700'} hover:bg-gray-100 transition-colors`}
                          >
                            Meta
                          </button>
                          <button
                            onClick={() => {
                              setFilterType('Ranking');
                              setOpenFilter(null);
                            }}
                            className={`w-full px-4 py-2 text-left text-sm ${filterType === 'Ranking' ? 'text-blue-600 font-medium' : 'text-gray-700'} hover:bg-gray-100 transition-colors`}
                          >
                            Ranking
                          </button>
                          <button
                            onClick={() => {
                              setFilterType('PxQ');
                              setOpenFilter(null);
                            }}
                            className={`w-full px-4 py-2 text-left text-sm ${filterType === 'PxQ' ? 'text-blue-600 font-medium' : 'text-gray-700'} hover:bg-gray-100 transition-colors`}
                          >
                            PxQ
                          </button>
                        </div>
                      )}
                    </th>
                    
                    {/* Fecha inicio */}
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 relative">
                      <button
                        onClick={(e) => handleOpenFilter('startDate', e)}
                        className="flex items-center gap-1 hover:text-gray-900"
                      >
                        Fecha inicio
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      {openFilter === 'startDate' && (
                        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-[100]">
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Fecha</label>
                              <input
                                type="date"
                                value={filterStartDate.split('T')[0] || ''}
                                onChange={(e) => {
                                  const time = filterStartDate.split('T')[1] || '12:00';
                                  setFilterStartDate(e.target.value ? `${e.target.value}T${time}` : '');
                                }}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Hora</label>
                              <input
                                type="time"
                                value={filterStartDate.split('T')[1] || '12:00'}
                                onChange={(e) => {
                                  const date = filterStartDate.split('T')[0] || new Date().toISOString().split('T')[0];
                                  setFilterStartDate(`${date}T${e.target.value}`);
                                }}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </th>
                    
                    {/* Fecha término */}
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 relative">
                      <button
                        onClick={(e) => handleOpenFilter('endDate', e)}
                        className="flex items-center gap-1 hover:text-gray-900"
                      >
                        Fecha término
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      {openFilter === 'endDate' && (
                        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-[100]">
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Fecha</label>
                              <input
                                type="date"
                                value={filterEndDate.split('T')[0] || ''}
                                onChange={(e) => {
                                  const time = filterEndDate.split('T')[1] || '12:00';
                                  setFilterEndDate(e.target.value ? `${e.target.value}T${time}` : '');
                                }}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Hora</label>
                              <input
                                type="time"
                                value={filterEndDate.split('T')[1] || '12:00'}
                                onChange={(e) => {
                                  const date = filterEndDate.split('T')[0] || new Date().toISOString().split('T')[0];
                                  setFilterEndDate(`${date}T${e.target.value}`);
                                }}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </th>
                    
                    {/* Participantes */}
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-600">Part.</th>
                    
                    {/* Estado */}
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 relative">
                      <button
                        onClick={(e) => handleOpenFilter('status', e)}
                        className="flex items-center gap-1 hover:text-gray-900"
                      >
                        Estado
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      {openFilter === 'status' && (
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[100]">
                          <button
                            onClick={() => {
                              setFilterStatus('');
                              setOpenFilter(null);
                            }}
                            className={`w-full px-4 py-2 text-left text-sm ${filterStatus === '' ? 'text-blue-600 font-medium' : 'text-gray-700'} hover:bg-gray-100 transition-colors`}
                          >
                            Todos
                          </button>
                          <button
                            onClick={() => {
                              setFilterStatus('Borrador');
                              setOpenFilter(null);
                            }}
                            className={`w-full px-4 py-2 text-left text-sm ${filterStatus === 'Borrador' ? 'text-blue-600 font-medium' : 'text-gray-700'} hover:bg-gray-100 transition-colors`}
                          >
                            Borrador
                          </button>
                          <button
                            onClick={() => {
                              setFilterStatus('Programado');
                              setOpenFilter(null);
                            }}
                            className={`w-full px-4 py-2 text-left text-sm ${filterStatus === 'Programado' ? 'text-blue-600 font-medium' : 'text-gray-700'} hover:bg-gray-100 transition-colors`}
                          >
                            Programado
                          </button>
                          <button
                            onClick={() => {
                              setFilterStatus('Activo');
                              setOpenFilter(null);
                            }}
                            className={`w-full px-4 py-2 text-left text-sm ${filterStatus === 'Activo' ? 'text-blue-600 font-medium' : 'text-gray-700'} hover:bg-gray-100 transition-colors`}
                          >
                            Activo
                          </button>
                          <button
                            onClick={() => {
                              setFilterStatus('Finalizado');
                              setOpenFilter(null);
                            }}
                            className={`w-full px-4 py-2 text-left text-sm ${filterStatus === 'Finalizado' ? 'text-blue-600 font-medium' : 'text-gray-700'} hover:bg-gray-100 transition-colors`}
                          >
                            Finalizado
                          </button>
                        </div>
                      )}
                    </th>
                    
                    {/* Estadísticas */}
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-600">Estadísticas</th>
                    
                    {/* Acciones */}
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-600">Acciones</th>
                    
                    {/* Cierre */}
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-600">Cierre</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredChallenges.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-6 py-16">
                        <div className="flex flex-col items-center justify-center gap-4">
                          <p className="text-gray-500 text-sm">No hay desafíos registrados</p>
                          <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                          >
                            + Crear primer desafío
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredChallenges.map(challenge => (
                      <tr key={challenge.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-3 py-3 text-xs text-gray-900">{challenge.code}</td>
                        <td className="px-3 py-3">
                          <div className="text-xs text-gray-900 font-medium">{challenge.name}</div>
                          <div className="text-xs text-gray-500">{challenge.category}</div>
                        </td>
                        <td className="px-3 py-3 text-xs text-gray-900">{challenge.type}</td>
                        <td className="px-3 py-3">
                          <div className="text-xs text-gray-900">{formatDate(challenge.startDate)}</div>
                          <div className="text-xs text-gray-500">{formatTime(challenge.startDate)}</div>
                        </td>
                        <td className="px-3 py-3">
                          <div className="text-xs text-gray-900">{formatDate(challenge.endDate)}</div>
                          <div className="text-xs text-gray-500">{formatTime(challenge.endDate)}</div>
                        </td>
                        <td className="px-3 py-3 text-xs text-gray-900 text-center">{challenge.participants}</td>
                        <td className="px-3 py-3">
                          <span className={`inline-flex px-2 py-0.5 text-xs font-medium ${getStatusColor(challenge.status)}`}>
                            {challenge.status}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <div className="text-center">
                            <div className="text-xs text-gray-900">{challenge.winnersPercentage}% ganadores</div>
                            <div className="text-xs text-gray-500">{challenge.pointsDelivered} pts entregados</div>
                          </div>
                        </td>
                        <td className="px-3 py-3 relative">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => setActionMenuOpen(actionMenuOpen === challenge.id ? null : challenge.id)}
                              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            
                            {/* Menú contextual */}
                            {actionMenuOpen === challenge.id && (
                              <div 
                                ref={actionMenuRef}
                                className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                              >
                                <button
                                  onClick={() => {
                                    setIsUploadModalOpen(true);
                                    setActionMenuOpen(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                                >
                                  <Upload className="w-3.5 h-3.5" />
                                  Cargar avance
                                </button>
                                <button className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2">
                                  <Edit className="w-3.5 h-3.5" />
                                  Editar desafío
                                </button>
                                <button className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2">
                                  <Copy className="w-3.5 h-3.5" />
                                  Clonar desafío
                                </button>
                                <div className="border-t border-gray-200 my-1"></div>
                                <button className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2">
                                  <Trash2 className="w-3.5 h-3.5" />
                                  Borrar desafío
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center justify-center">
                            <button className="px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Cerrar
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

        {/* Modal de crear desafío */}
        <CreateChallengeModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={(data) => {
            // Generar ID único para el desafío
            const challengeId = `chal-${Date.now()}`;
            
            // Mapear el tipo de desafío
            let challengeType = 'Meta';
            if (data.type === 'ranking') challengeType = 'Ranking';
            if (data.type === 'pxq') challengeType = 'PxQ';
            
            // Determinar el estado basado en las fechas
            const now = new Date();
            const startDateTime = new Date(`${data.startDate}T${data.startTime}`);
            const endDateTime = new Date(`${data.endDate}T${data.endTime}`);
            
            let status: 'Borrador' | 'Programado' | 'Activo' | 'Finalizado' = 'Borrador';
            if (startDateTime > now) {
              status = 'Programado';
            } else if (startDateTime <= now && endDateTime >= now) {
              status = 'Activo';
            } else if (endDateTime < now) {
              status = 'Finalizado';
            }
            
            // Crear el nuevo desafío
            const newChallenge = {
              id: challengeId,
              programId: programId || '',
              code: `#${String(getChallengesByProgram(programId || '').length + 1).padStart(4, '0')}`,
              name: data.name,
              category: data.description.substring(0, 50), // Usar parte de la descripción como categoría
              type: challengeType,
              startDate: `${data.startDate}T${data.startTime}`,
              endDate: `${data.endDate}T${data.endTime}`,
              participants: 0,
              status: status,
              winnersPercentage: 0,
              pointsDelivered: 0,
              createdAt: new Date().toISOString()
            };
            
            // Guardar en el contexto
            addChallenge(newChallenge);
            
            // Cerrar el modal
            setIsCreateModalOpen(false);
          }}
        />

        {/* Modal de carga de avances */}
        <UploadProgressModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          challengeName="Desafío Pólizas"
          onUpload={(file) => {
            console.log('Archivo cargado:', file);
            setIsUploadModalOpen(false);
          }}
          onDelete={() => {
            console.log('Avances eliminados');
            setIsUploadModalOpen(false);
          }}
        />
      </div>
    </div>
  );
}