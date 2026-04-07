import { Home, Users, Upload, Trophy, MessageSquare, Award, FileText, Settings, ChevronDown, Image, Shield, Bold, Italic, List, AlignLeft, AlignCenter, AlignRight, Grid3x3, Trash2, Plus, Search } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import logoSavia from 'figma:asset/e6586f9eafb686170ce2c11ae52fcf10db69c0a4.png';
import { usePrograms } from '../context/ProgramsContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { CollapsibleSection } from '../components/CollapsibleSection';

export function ProgramConfiguration() {
  console.log('⚙️ ProgramConfiguration: Renderizando componente...');
  
  const navigate = useNavigate();
  const { programId } = useParams();
  const { programs, getProgram } = usePrograms();
  const { currentUser, logout } = useAuth();
  const { showSuccess } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMuroOpen, setIsMuroOpen] = useState(false);
  const [noticiasOpen, setNoticiasOpen] = useState(false);
  const [reconocimientosOpen, setReconocimientosOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  console.log('⚙️ ProgramConfiguration: programId =', programId);
  
  // Obtener el programa actual desde el contexto PRIMERO
  const program = getProgram(programId || '');
  
  console.log('⚙️ ProgramConfiguration: program =', program);

  // Estados del formulario
  const [codigoPrograma, setCodigoPrograma] = useState(program?.code || 'no configurado');
  const [subdominios, setSubdominios] = useState(`www.${program?.code || 'programa'}.sawa.cl`);
  const [nombrePrograma, setNombrePrograma] = useState(program?.name || '');
  const [colorBanner, setColorBanner] = useState('#000000');
  const [moduloEngagement, setModuloEngagement] = useState(true);
  const [moduloGamification, setModuloGamification] = useState(true);
  const [moduloReconocimiento, setModuloReconocimiento] = useState(false);
  const [vencimientoPuntos, setVencimientoPuntos] = useState(true);
  const [mesesVencimiento, setMesesVencimiento] = useState('24');
  const [limitePuntos, setLimitePuntos] = useState(program?.pointsLimit?.toString() || '0');
  const [codigoCatalogo, setCodigoCatalogo] = useState('1234567890');
  const [centroCostos, setCentroCostos] = useState('1234567890');
  const [diasMagicLink, setDiasMagicLink] = useState('7');
  const [estadoMembresia, setEstadoMembresia] = useState('Activa');
  const [terminosCondiciones, setTerminosCondiciones] = useState('porDefecto');
  const [esMigracion, setEsMigracion] = useState(false);
  const [etapaPrograma, setEtapaPrograma] = useState('En régimen');
  
  // Segmentaciones
  const [segmentaciones, setSegmentaciones] = useState([
    { id: 1, nombre: 'Area', esFija: true, distribuciones: [
      { valor: 'Ventas', cantidad: 45, porcentaje: 45 },
      { valor: 'Marketing', cantidad: 30, porcentaje: 30 },
      { valor: 'Operaciones', cantidad: 25, porcentaje: 25 },
    ]},
    { id: 2, nombre: 'Cargo', esFija: true, distribuciones: [
      { valor: 'Gerente', cantidad: 20, porcentaje: 20 },
      { valor: 'Supervisor', cantidad: 35, porcentaje: 35 },
      { valor: 'Ejecutivo', cantidad: 45, porcentaje: 45 },
    ]},
  ]);
  const [segmentacionSeleccionada, setSegmentacionSeleccionada] = useState<number | null>(1);
  const [modalNuevaSegmentacion, setModalNuevaSegmentacion] = useState(false);
  const [nombreNuevaSegmentacion, setNombreNuevaSegmentacion] = useState('');
  const [errorNombreSegmentacion, setErrorNombreSegmentacion] = useState('');
  const [busquedaDistribucion, setBusquedaDistribucion] = useState('');
  const [mostrarInputNuevaSegmentacion, setMostrarInputNuevaSegmentacion] = useState(false);
  const [modalEliminarSegmentacion, setModalEliminarSegmentacion] = useState<{ id: number; nombre: string } | null>(null);
  const [modalEliminarDistribucion, setModalEliminarDistribucion] = useState<{ segmentacionId: number; segmentacionNombre: string; distribucionValor: string; distribucionIdx: number } | null>(null);

  // Función para validar entrada numérica
  const handleNumericInput = (value: string, max: number, setter: (value: string) => void) => {
    // Remover cualquier carácter que no sea dígito
    const numericValue = value.replace(/\D/g, '');
    
    // Convertir a número para validar
    const numberValue = parseInt(numericValue, 10);
    
    // Si está vacío, permitir
    if (numericValue === '') {
      setter('');
      return;
    }
    
    // Validar que no exceda el máximo
    if (numberValue <= max) {
      setter(numericValue);
    }
  };

  // Handlers
  const handleLogout = () => {
    logout();
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

  const handleDesafios = () => {
    navigate(`/programa/${programId}/desafios`);
  };

  const handleGuardarCambios = () => {
    console.log('Guardando cambios...');
    // Aquí iría la lógica para guardar
    showSuccess('Cambios guardados con éxito');
  };

  // Validación y manejo de segmentaciones
  const validarNombreSegmentacion = (nombre: string) => {
    // Verificar longitud
    if (nombre.length > 50) {
      return 'El nombre no puede exceder 50 caracteres';
    }
    
    // Verificar que solo contenga caracteres alfanuméricos (sin espacios, símbolos ni tildes)
    const regex = /^[a-zA-Z0-9]+$/;
    if (!regex.test(nombre)) {
      return 'Solo se permiten caracteres alfanuméricos (sin espacios, símbolos ni tildes)';
    }
    
    // Verificar que no exista ya una segmentación con ese nombre
    const existe = segmentaciones.some(seg => seg.nombre.toLowerCase() === nombre.toLowerCase());
    if (existe) {
      return 'Ya existe una segmentación con ese nombre';
    }
    
    return '';
  };

  const handleCrearSegmentacion = () => {
    const error = validarNombreSegmentacion(nombreNuevaSegmentacion);
    if (error) {
      setErrorNombreSegmentacion(error);
      return;
    }

    // Crear nueva segmentación
    const nuevaSegmentacion = {
      id: segmentaciones.length + 1,
      nombre: nombreNuevaSegmentacion,
      esFija: false,
      distribuciones: [
        { valor: 'Sin datos', cantidad: 0, porcentaje: 0 },
      ],
    };

    setSegmentaciones([...segmentaciones, nuevaSegmentacion]);
    setSegmentacionSeleccionada(nuevaSegmentacion.id);
    setModalNuevaSegmentacion(false);
    setNombreNuevaSegmentacion('');
    setErrorNombreSegmentacion('');
    setMostrarInputNuevaSegmentacion(false);
    showSuccess('Segmentación creada con éxito');
  };

  const handleEliminarSegmentacion = (id: number) => {
    const segmentacion = segmentaciones.find(seg => seg.id === id);
    if (segmentacion?.esFija) {
      return; // No permitir eliminar segmentaciones fijas
    }
    
    setSegmentaciones(segmentaciones.filter(seg => seg.id !== id));
    if (segmentacionSeleccionada === id) {
      setSegmentacionSeleccionada(1);
    }
    showSuccess('Segmentación eliminada con éxito');
  };

  const handleChangeNombreSegmentacion = (nombre: string) => {
    setNombreNuevaSegmentacion(nombre);
    if (nombre) {
      const error = validarNombreSegmentacion(nombre);
      setErrorNombreSegmentacion(error);
    } else {
      setErrorNombreSegmentacion('');
    }
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
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Editor de Términos y Condiciones
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
    ],
    content: '<p>Por defecto</p>',
  });

  return (
    <>
      <div className="min-h-screen bg-[#F5F5F5] flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo SAWA */}
        <div className="p-4 border-b border-gray-200">
          <img src={logoSavia} alt="SAWA" className="h-8 w-auto object-contain" />
        </div>

        {/* Navegación */}
        <nav className="flex-1 p-3 space-y-1">
          {/* Inicio */}
          <button 
            onClick={handleProgramDetail}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Inicio</span>
          </button>

          {/* Participantes */}
          <button 
            onClick={handleParticipantes}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            <Users className="w-4 h-4" />
            <span>Participantes</span>
          </button>

          {/* Carga de puntos */}
          <button 
            onClick={handleCargaPuntos}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Carga de puntos</span>
          </button>

          {/* Desafíos */}
          <button 
            onClick={handleDesafios}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            <Trophy className="w-4 h-4" />
            <span>Desafíos</span>
          </button>

          {/* Muro (con dropdown) */}
          <div>
            <button 
              onClick={() => setIsMuroOpen(!isMuroOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span>Muro</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${isMuroOpen ? 'rotate-180' : ''}`} />
            </button>
            {isMuroOpen && (
              <div className="ml-6 mt-1 space-y-1">
                <button 
                  onClick={() => setNoticiasOpen(!noticiasOpen)}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded transition-colors"
                >
                  <span>Noticias</span>
                </button>
                <button 
                  onClick={() => setReconocimientosOpen(!reconocimientosOpen)}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded transition-colors"
                >
                  <span>Reconocimientos</span>
                </button>
              </div>
            )}
          </div>

          {/* Reconocimientos */}
          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors">
            <Award className="w-4 h-4" />
            <span>Reconocimientos</span>
          </button>

          {/* Reportes */}
          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors">
            <FileText className="w-4 h-4" />
            <span>Reportes</span>
          </button>

          {/* Configuración */}
          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-orange-500 text-white rounded transition-colors">
            <Settings className="w-4 h-4" />
            <span>Configuración</span>
          </button>
        </nav>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          {/* Contenedor central con selector de programa y botón Buscar ASIN */}
          <div className="flex-1 flex items-center gap-4">
            {/* Selector de programa */}
            <div className="relative" ref={searchRef}>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between hover:border-gray-400 transition-colors bg-white"
              >
                <span className="text-gray-900">{program.name}</span>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown */}
              {isSearchOpen && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <button
                    onClick={handleSuperAdmin}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Super Admin
                  </button>
                  <div className="border-t border-gray-200 my-1"></div>
                  {programs.map(prog => (
                    <button
                      key={prog.id}
                      onClick={() => {
                        setIsSearchOpen(false);
                        navigate(`/programa/${prog.id}/configuracion`);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm ${prog.id === programId ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'} transition-colors`}
                    >
                      {prog.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Botón Super Admin */}
            <button 
              onClick={handleSuperAdmin}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              <span>Super Admin</span>
            </button>
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
        <main className="flex-1 p-8 overflow-y-auto">
          {/* Header de la sección */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl">Configuración</h1>
            <button 
              onClick={handleGuardarCambios}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Guardar cambios
            </button>
          </div>

          {/* Formulario */}
          <div className="space-y-4">
            {/* Configuración General */}
            <CollapsibleSection title="Configuración General" defaultExpanded={true}>
            {/* Código del Programa */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Código del Programa
              </label>
              <input
                type="text"
                value={codigoPrograma}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Este campo se ve solo técnico</p>
            </div>

            {/* Subdominios de referencia */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Subdominios de referencia
              </label>
              <input
                type="text"
                value={subdominios}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Este campo se ve solo técnico</p>
            </div>

            {/* Nombre del Programa */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Nombre del Programa
              </label>
              <input
                type="text"
                value={nombrePrograma}
                onChange={(e) => setNombrePrograma(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Logo del Programa */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Logo del Programa
              </label>
              <div className="flex items-start gap-4">
                <div className="w-32 h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <Image className="w-12 h-12 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">Logo 0.38 MB</p>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm mb-2">
                    Subir imagen
                  </button>
                  <p className="text-xs text-gray-500">
                    Formato de la imagen más común: .JPEG, .PNG hasta 5.200 x 200 píxeles
                  </p>
                </div>
              </div>
            </div>

            {/* Color Banner Superior */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Color Banner Superior
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={colorBanner}
                  onChange={(e) => setColorBanner(e.target.value)}
                  className="w-12 h-12 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={colorBanner}
                  onChange={(e) => setColorBanner(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Personaliza el color del banner superior, da mayor personalización a tu plataforma.
              </p>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Estado
              </label>
              <select
                value={estadoMembresia}
                onChange={(e) => setEstadoMembresia(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Activa</option>
                <option>Inactiva</option>
              </select>
            </div>

            {/* Este Programa es una Migración */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={esMigracion}
                  onChange={(e) => setEsMigracion(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900">Este Programa es una Migración</div>
                  <div className="text-xs text-gray-500">Aplica para programas que existían previamente en la plataforma Legacy (PGP SAWA)</div>
                </div>
              </label>
            </div>

            {/* Etapa del programa */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Etapa del programa
              </label>
              <select
                value={etapaPrograma}
                onChange={(e) => setEtapaPrograma(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>En régimen</option>
                <option>Piloto</option>
                <option>Pausado</option>
                <option>Finalizado</option>
              </select>
            </div>

            {/* Módulos visibles */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Módulos visibles
              </label>
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={moduloEngagement}
                    onChange={(e) => setModuloEngagement(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Mostrar módulo de Engagement</div>
                    <div className="text-xs text-gray-500">Activar módulo de engagement donde podrás crear campañas</div>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={moduloGamification}
                    onChange={(e) => setModuloGamification(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Mostrar módulo de Gamification</div>
                    <div className="text-xs text-gray-500">Mantiene la lógica de juegos similar a nivel de participante</div>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={moduloReconocimiento}
                    onChange={(e) => setModuloReconocimiento(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Mostrar módulo de Reconocimiento</div>
                    <div className="text-xs text-gray-500">Entrega y visualización de reconocimiento para cada juego o campaña</div>
                  </div>
                </label>
              </div>
            </div>
            </CollapsibleSection>

            {/* Configuración de puntos */}
            <CollapsibleSection title="Configuración de Puntos" defaultExpanded={false}>
              <div className="space-y-6">
                <div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={vencimientoPuntos}
                      onChange={(e) => setVencimientoPuntos(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Habilitar vencimiento de puntos</div>
                      <div className="text-xs text-gray-500">Los puntos vencidos no podrán ser canjeados en catálogo</div>
                    </div>
                  </label>
                  {vencimientoPuntos && (
                    <div className="ml-7 mt-3">
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Número de meses para vencimiento
                      </label>
                      <input
                        type="text"
                        value={mesesVencimiento}
                        onChange={(e) => handleNumericInput(e.target.value, 10000, setMesesVencimiento)}
                        className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>

                {/* Límite de puntos mensual */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Límite de puntos mensual
                  </label>
                  <input
                    type="text"
                    value={limitePuntos}
                    onChange={(e) => handleNumericInput(e.target.value, 100000000, setLimitePuntos)}
                    className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Corresponde al número de puntos que puede cargar a un participante en el mes. Si el valor es 0 u otro menos que 0, no se restringirá.
                  </p>
                </div>
              </div>
            </CollapsibleSection>

            {/* Configuración Catálogo */}
            <CollapsibleSection title="Configuración Catálogo" defaultExpanded={false}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Código del catálogo
                  </label>
                  <input
                    type="text"
                    value={codigoCatalogo}
                    onChange={(e) => setCodigoCatalogo(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Número único de su negocio, máximo 10 caracteres.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Centro de costos
                  </label>
                  <input
                    type="text"
                    value={centroCostos}
                    onChange={(e) => setCentroCostos(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Número único de su negocio, máximo 10 caracteres.</p>
                </div>
              </div>
            </CollapsibleSection>

            {/* Configuración Onboarding */}
            <CollapsibleSection title="Configuración Onboarding" defaultExpanded={false}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Activar Onboarding Parcial
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Cuando está activo, se mostrará a los usuarios que aún no completen el onboarding. Cuántas veces deseas preguntar, cuando se completa la verificación vuelve a activarse el portal de bienvenida del cliente.
                  </p>
                </div>

                {/* Días de expiración Magic Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Días de expiración Magic Link
                  </label>
                  <input
                    type="text"
                    value={diasMagicLink}
                    onChange={(e) => handleNumericInput(e.target.value, 1000, setDiasMagicLink)}
                    className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Este campo es para ver cuántos de onboarding, quiere que dure la autenticación del usuario.
                  </p>
                </div>
              </div>
            </CollapsibleSection>

            {/* Configuración Segmentaciones */}
            <CollapsibleSection title="Configuración Segmentaciones" defaultExpanded={false}>
              <div className="grid grid-cols-2 gap-6">
                {/* Columna izquierda - Lista de segmentaciones */}
                <div>
                  <div className="space-y-2 mb-4">
                    {segmentaciones.map(seg => (
                      <div
                        key={seg.id}
                        onClick={() => setSegmentacionSeleccionada(seg.id)}
                        className={`flex items-center justify-between px-4 py-3 rounded-lg border-2 cursor-pointer transition-colors ${
                          segmentacionSeleccionada === seg.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">{seg.nombre}</span>
                          {seg.esFija && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                              Fija
                            </span>
                          )}
                        </div>
                        {!seg.esFija && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setModalEliminarSegmentacion({ id: seg.id, nombre: seg.nombre });
                            }}
                            className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {!mostrarInputNuevaSegmentacion ? (
                    <button
                      onClick={() => setMostrarInputNuevaSegmentacion(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-sm font-medium">Nueva Segmentación</span>
                    </button>
                  ) : (
                    <div className="w-full">
                      <input
                        type="text"
                        value={nombreNuevaSegmentacion}
                        onChange={(e) => handleChangeNombreSegmentacion(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && nombreNuevaSegmentacion && !errorNombreSegmentacion) {
                            handleCrearSegmentacion();
                          } else if (e.key === 'Escape') {
                            setMostrarInputNuevaSegmentacion(false);
                            setNombreNuevaSegmentacion('');
                            setErrorNombreSegmentacion('');
                          }
                        }}
                        onBlur={() => {
                          if (!nombreNuevaSegmentacion) {
                            setMostrarInputNuevaSegmentacion(false);
                            setErrorNombreSegmentacion('');
                          }
                        }}
                        autoFocus
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 ${
                          errorNombreSegmentacion 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-blue-500 focus:ring-blue-500'
                        }`}
                        placeholder="Nombre de la segmentación (presiona Enter)"
                        maxLength={50}
                      />
                      {errorNombreSegmentacion && (
                        <p className="text-xs text-red-600 mt-1">
                          {errorNombreSegmentacion}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Presiona Enter para crear • Esc para cancelar
                      </p>
                    </div>
                  )}
                </div>

                {/* Columna derecha - Distribución de participantes */}
                <div className="border border-gray-200 rounded-lg p-4">
                  {segmentacionSeleccionada && (() => {
                    const seg = segmentaciones.find(s => s.id === segmentacionSeleccionada);
                    if (!seg) return null;
                    
                    // Filtrar y ordenar distribuciones
                    const distribucionesFiltradas = seg.distribuciones
                      .filter(dist => dist.valor.toLowerCase().includes(busquedaDistribucion.toLowerCase()))
                      .sort((a, b) => b.porcentaje - a.porcentaje);
                    
                    return (
                      <>
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-900 mb-3">
                            Distribución de Participantes - {seg.nombre}
                          </h4>
                          {/* Buscador */}
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              value={busquedaDistribucion}
                              onChange={(e) => setBusquedaDistribucion(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Buscar..."
                            />
                          </div>
                        </div>
                        
                        {/* Lista de distribuciones con scroll */}
                        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                          {distribucionesFiltradas.length > 0 ? (
                            distribucionesFiltradas.map((dist, idx) => {
                              // Encontrar el índice original en la lista completa (antes del filtro)
                              const idxOriginal = seg.distribuciones.findIndex(d => d.valor === dist.valor && d.cantidad === dist.cantidad);
                              
                              return (
                                <div key={idx} className="flex items-center justify-between py-2 px-3 border-b border-gray-100 last:border-0 bg-gray-50 rounded group">
                                  <span className="text-sm text-gray-700 font-medium">{dist.valor}</span>
                                  <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-gray-900">{dist.cantidad}</span>
                                    <span className="text-sm text-blue-600 font-semibold w-12 text-right">{dist.porcentaje}%</span>
                                    <button
                                      onClick={() => {
                                        setModalEliminarDistribucion({
                                          segmentacionId: seg.id,
                                          segmentacionNombre: seg.nombre,
                                          distribucionValor: dist.valor,
                                          distribucionIdx: idxOriginal
                                        });
                                      }}
                                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <p className="text-sm text-gray-500 text-center py-4">
                              No se encontraron resultados
                            </p>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </CollapsibleSection>

            {/* Términos y Condiciones de Uso */}
            <CollapsibleSection title="Términos y Condiciones de Uso" defaultExpanded={false}>
              <p className="text-sm text-gray-600 mb-4">
                Configura los términos y condiciones específicas para esta interfaz.
              </p>
              <div className="space-y-3 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="terminos"
                    value="porDefecto"
                    checked={terminosCondiciones === 'porDefecto'}
                    onChange={(e) => setTerminosCondiciones(e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-900">Por defecto</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="terminos"
                    value="personalizados"
                    checked={terminosCondiciones === 'personalizados'}
                    onChange={(e) => setTerminosCondiciones(e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-900">Personalizados</span>
                </label>
              </div>

              {terminosCondiciones === 'porDefecto' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-blue-700">
                    Se utilizarán los Términos y Condiciones guardados en la configuración general por defecto.
                  </p>
                </div>
              )}

              {terminosCondiciones === 'personalizados' && editor && (
                <>
                  <div className="border border-gray-300 rounded-lg mb-2">
                    {/* Barra de herramientas */}
                    <div className="border-b border-gray-300 bg-gray-50 px-3 py-2 flex items-center gap-1 flex-wrap">
                      <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`p-2 hover:bg-gray-200 rounded ${editor.isActive('bold') ? 'bg-gray-300' : ''}`}
                        type="button"
                      >
                        <Bold className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`p-2 hover:bg-gray-200 rounded ${editor.isActive('italic') ? 'bg-gray-300' : ''}`}
                        type="button"
                      >
                        <Italic className="w-4 h-4" />
                      </button>
                      
                      <div className="w-px h-6 bg-gray-300 mx-1"></div>
                      
                      <button
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        className={`p-2 hover:bg-gray-200 rounded ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-300' : ''}`}
                        type="button"
                      >
                        <AlignLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        className={`p-2 hover:bg-gray-200 rounded ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-300' : ''}`}
                        type="button"
                      >
                        <AlignCenter className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        className={`p-2 hover:bg-gray-200 rounded ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-300' : ''}`}
                        type="button"
                      >
                        <AlignRight className="w-4 h-4" />
                      </button>
                      
                      <div className="w-px h-6 bg-gray-300 mx-1"></div>
                      
                      <button
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`p-2 hover:bg-gray-200 rounded ${editor.isActive('bulletList') ? 'bg-gray-300' : ''}`}
                        type="button"
                      >
                        <List className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                        className="p-2 hover:bg-gray-200 rounded"
                        type="button"
                      >
                        <Grid3x3 className="w-4 h-4" />
                      </button>
                      
                      <select
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '16px') {
                            editor.chain().focus().unsetFontSize().run();
                          } else {
                            editor.chain().focus().setMark('textStyle', { fontSize: value }).run();
                          }
                        }}
                        className="ml-2 px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="16px">16px</option>
                        <option value="12px">12px</option>
                        <option value="14px">14px</option>
                        <option value="18px">18px</option>
                        <option value="20px">20px</option>
                        <option value="24px">24px</option>
                      </select>
                    </div>
                    
                    {/* Área de edición */}
                    <div className="prose max-w-none p-4">
                      <EditorContent editor={editor} />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Estos son los términos y condiciones por defecto configurados en el Super Admin.
                  </p>
                </>
              )}
            </CollapsibleSection>
          </div>
        </main>
      </div>
    </div>

    {/* Modal Nueva Segmentación */}
    {modalNuevaSegmentacion && (
      <div 
        className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999]"
        onClick={() => {
          setModalNuevaSegmentacion(false);
          setNombreNuevaSegmentacion('');
          setErrorNombreSegmentacion('');
        }}
      >
        <div 
          className="bg-white rounded-lg shadow-xl w-full max-w-md p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Nueva Segmentación</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Nombre de la segmentación
            </label>
            <input
              type="text"
              value={nombreNuevaSegmentacion}
              onChange={(e) => handleChangeNombreSegmentacion(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errorNombreSegmentacion 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Ejemplo: Region"
              maxLength={50}
            />
            <p className="text-xs text-gray-500 mt-1">
              Máximo 50 caracteres alfanuméricos (sin espacios, símbolos ni tildes)
            </p>
            {errorNombreSegmentacion && (
              <p className="text-xs text-red-600 mt-1">
                {errorNombreSegmentacion}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 justify-end">
            <button
              onClick={() => {
                setModalNuevaSegmentacion(false);
                setNombreNuevaSegmentacion('');
                setErrorNombreSegmentacion('');
              }}
              className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleCrearSegmentacion}
              disabled={!nombreNuevaSegmentacion || !!errorNombreSegmentacion}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Crear
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Modal Eliminar Segmentación */}
    {modalEliminarSegmentacion && (
      <div 
        className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999]"
        onClick={() => setModalEliminarSegmentacion(null)}
      >
        <div 
          className="bg-white rounded-lg shadow-xl w-full max-w-md p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Eliminar Segmentación</h3>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Se eliminará la segmentación <strong>{modalEliminarSegmentacion.nombre}</strong> y su distribución de participantes almacenada
            </p>
          </div>

          <div className="flex items-center gap-3 justify-end">
            <button
              onClick={() => setModalEliminarSegmentacion(null)}
              className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                handleEliminarSegmentacion(modalEliminarSegmentacion.id);
                setModalEliminarSegmentacion(null);
              }}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Modal Eliminar Distribución */}
    {modalEliminarDistribucion && (
      <div 
        className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999]"
        onClick={() => setModalEliminarDistribucion(null)}
      >
        <div 
          className="bg-white rounded-lg shadow-xl w-full max-w-md p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Eliminar Distribución</h3>
          
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Se eliminará el grupo <strong>{modalEliminarDistribucion.distribucionValor}</strong> de la segmentación <strong>{modalEliminarDistribucion.segmentacionNombre}</strong> y los participantes de este grupo quedarán en vacío
            </p>
          </div>

          <div className="flex items-center gap-3 justify-end">
            <button
              onClick={() => setModalEliminarDistribucion(null)}
              className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                // Eliminar distribución
                const segmentacionesActualizadas = segmentaciones.map(seg => {
                  if (seg.id === modalEliminarDistribucion.segmentacionId) {
                    return {
                      ...seg,
                      distribuciones: seg.distribuciones.filter((_, idx) => idx !== modalEliminarDistribucion.distribucionIdx)
                    };
                  }
                  return seg;
                });
                setSegmentaciones(segmentacionesActualizadas);
                setModalEliminarDistribucion(null);
                showSuccess('Distribución eliminada con éxito');
              }}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}