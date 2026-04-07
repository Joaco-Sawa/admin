import { UserPlus, ChevronDown, X, UploadCloud, MoreVertical, Pencil, Trash2, User, Phone, Calendar, Search, Mail } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { usePrograms } from '../context/ProgramsContext';
import { useToast } from '../context/ToastContext';
import { ProgramSidebar } from '../components/ProgramSidebar';
import { ProgramHeader } from '../components/ProgramHeader';

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

export function ProgramParticipants() {
  const navigate = useNavigate();
  const { programId } = useParams();
  const { getProgram, addParticipant, getParticipantsByProgram, updateParticipant, deleteParticipant } = usePrograms();
  const { showSuccess } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMuroOpen, setIsMuroOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMagicLinkModal, setShowMagicLinkModal] = useState(false);
  const [selectedParticipantEmail, setSelectedParticipantEmail] = useState('');
  const [editingParticipant, setEditingParticipant] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [supervisorSearch, setSupervisorSearch] = useState('');
  const [showSupervisorDropdown, setShowSupervisorDropdown] = useState(false);
  const [participantSearch, setParticipantSearch] = useState('');
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [editedPhone, setEditedPhone] = useState('');
  const [editedBirthDate, setEditedBirthDate] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const uploadModalRef = useRef<HTMLDivElement>(null);
  const editModalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supervisorSearchRef = useRef<HTMLDivElement>(null);

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

  // Obtener el programa actual desde el contexto
  const program = getProgram(programId || '');

  // Obtener participantes del programa actual
  const participants = getParticipantsByProgram(programId || '');

  // Filtrar participantes por búsqueda
  const filteredParticipants = participants.filter(participant => {
    if (!participantSearch) return true;
    const searchLower = participantSearch.toLowerCase();
    return (
      participant.name.toLowerCase().includes(searchLower) ||
      participant.email.toLowerCase().includes(searchLower)
    );
  });

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
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowAddModal(false);
      }
      if (uploadModalRef.current && !uploadModalRef.current.contains(event.target as Node)) {
        setShowUploadModal(false);
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

  const handleCargaPuntos = () => {
    navigate(`/programa/${programId}/carga-puntos`);
  };

  const handleDesafios = () => {
    navigate(`/programa/${programId}/desafios`);
  };

  const handleConfiguracion = () => {
    navigate(`/programa/${programId}/configuracion`);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      {/* Sidebar */}
      <ProgramSidebar activeMenu="participantes" />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <ProgramHeader />

        {/* Contenido de la página */}
        <main className="flex-1 p-8">
          {/* Header de la sección */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl">Participantes</h1>
            <div className="flex items-center gap-3">
              {/* Botón Carga masiva CSV */}
              <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors" onClick={() => setShowUploadModal(true)}>
                <UploadCloud className="w-4 h-4" />
                <span>Carga masiva CSV</span>
              </button>
              {/* Botón Añadir participante */}
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors text-sm" onClick={() => setShowAddModal(true)}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>Añadir Participante</span>
              </button>
            </div>
          </div>

          {/* Sección Todos los participantes */}
          <div className="bg-white rounded-lg shadow-sm">
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
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Nombre
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
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        {participantSearch ? 'No se encontraron participantes con ese criterio de búsqueda' : 'No hay participantes que coincidan con los filtros'}
                      </td>
                    </tr>
                  ) : (
                    filteredParticipants.map((participant) => (
                      <tr key={participant.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">{participant.name}</div>
                            <div className="text-sm text-gray-500">{participant.email}</div>
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
                                // Obtener datos frescos del participante
                                const freshParticipant = participants.find(p => p.id === participant.id);
                                setEditingParticipant(freshParticipant || participant);
                                
                                // Inicializar los valores editables
                                setEditedName((freshParticipant || participant).name);
                                setEditedEmail((freshParticipant || participant).email);
                                setEditedPhone((freshParticipant || participant).phone || '');
                                setEditedBirthDate((freshParticipant || participant).birthDate || '');
                                
                                // Inicializar el campo de búsqueda con el supervisor actual
                                if (freshParticipant?.supervisorId) {
                                  const currentSupervisor = participants.find(p => p.id === freshParticipant.supervisorId);
                                  setSupervisorSearch(currentSupervisor?.name || '');
                                } else {
                                  setSupervisorSearch('');
                                }
                                
                                setShowEditModal(true);
                              }}
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            {!participant.onboard && (
                              <button 
                                className="flex items-center gap-1 px-2 py-1.5 text-gray-700 hover:bg-gray-100 rounded transition-colors"
                                title="Enviar Magic Link"
                                onClick={() => {
                                  setSelectedParticipantEmail(participant.email);
                                  setShowMagicLinkModal(true);
                                }}
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Modal Añadir Participante */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.08)' }}>
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md" ref={modalRef}>
            {/* Header del modal */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium">Añadir Participante</h2>
              <button 
                className="text-gray-400 hover:text-gray-600 transition-colors" 
                onClick={() => {
                  setShowAddModal(false);
                  setEmail('');
                  setNombre('');
                }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulario */}
            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              
              // Crear nuevo participante
              const newParticipant = {
                id: `part-${Date.now()}`,
                programId: programId || '',
                email: email,
                name: nombre || email.split('@')[0],
                phone: null,
                birthDate: null,
                onboard: false,
                lastAccess: null,
                pointsBalance: 0,
                enabled: true,
                isSupervisor: false,
                supervisorId: null,
                createdAt: new Date().toISOString()
              };
              
              // Agregar participante al contexto
              addParticipant(newParticipant);
              
              // Mostrar notificación de éxito
              showSuccess('Cambios guardados con éxito');
              
              // Cerrar modal y limpiar campos
              setShowAddModal(false);
              setEmail('');
              setNombre('');
            }}>
              {/* Campo Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Campo Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Nombre del participante"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>

              {/* Botones */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEmail('');
                    setNombre('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Añadir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Carga Masiva CSV */}
      {showUploadModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.08)' }}>
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl" ref={uploadModalRef}>
            {/* Header del modal */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-medium mb-1">Carga masiva</h2>
                <p className="text-sm text-gray-600">Sube un archivo en formato <span className="font-semibold">CSV</span>.</p>
              </div>
              <div className="flex items-center gap-2">
                {/* Botón Descargar ejemplo CSV */}
                <button 
                  type="button"
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  onClick={() => {
                    // Lógica para descargar ejemplo CSV
                    console.log('Descargar ejemplo CSV');
                  }}
                >
                  Descargar ejemplo CSV
                </button>
                <button 
                  className="text-gray-400 hover:text-gray-600 transition-colors" 
                  onClick={() => {
                    setShowUploadModal(false);
                    setDragActive(false);
                  }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Área de carga de archivo */}
            <div 
              className={`border-2 border-dashed rounded-lg p-12 mb-6 transition-colors ${
                dragActive ? 'border-orange-400 bg-orange-50' : 'border-orange-400 bg-white'
              }`}
              onDragEnter={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragActive(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragActive(false);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragActive(false);
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  // Aquí se manejaría el archivo
                  console.log('Archivo cargado:', e.dataTransfer.files[0]);
                }
              }}
            >
              <div className="flex flex-col items-center justify-center text-center">
                <UploadCloud className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-700 mb-2">Arrastra y suelta tu archivo aquí</p>
                <p className="text-gray-400 text-sm mb-4">o</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Elegir archivo
                </button>
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      // Aquí se manejaría el archivo
                      console.log('Archivo seleccionado:', e.target.files[0]);
                    }
                  }}
                />
              </div>
            </div>

            {/* Consideraciones */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-1">
                <span>▼▼</span> Consideraciones
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>• Se requiere una única fila por usuario, identificado por <span className="font-semibold">Email</span>.</p>
                <p>• Los nombres de columna deben coincidir con los campos del sistema. Tildes, mayúsculas y minúsculas no importan.</p>
                <p>• Los campos que se suban vacíos quedarán vacíos.</p>
                <p>• Campos permitidos: <span className="font-semibold">email</span> (requerido), <span className="font-semibold">name</span>, <span className="font-semibold">rut</span>, <span className="font-semibold">phone</span>, <span className="font-semibold">birth_date</span>.</p>
                <p>• Formato del archivo: <span className="font-semibold">CSV</span> con separador ";".</p>
                <p className="text-gray-500">Formatos permitidos: .csv</p>
              </div>
            </div>
          </div>
        </div>
      )}

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
                        {participants.some(p => p.supervisorId === editingParticipant.id) ? 'Sí' : 'No'}
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
                            {participants
                              .filter(p => p.id !== editingParticipant.id && !participants.some(x => x.supervisorId === p.id && x.id === editingParticipant.id))
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
                            {participants
                              .filter(p => p.id !== editingParticipant.id && !participants.some(x => x.supervisorId === p.id && x.id === editingParticipant.id))
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