import { Plus, Calendar, BarChart3, X, Download, ChevronDown } from 'lucide-react';
import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { usePrograms } from '../context/ProgramsContext';
import { useToast } from '../context/ToastContext';
import { ProgramSidebar } from '../components/ProgramSidebar';
import { ProgramHeader } from '../components/ProgramHeader';

export function ProgramPointsLoad() {
  const navigate = useNavigate();
  const { programId } = useParams();
  const { getProgram } = usePrograms();
  const { showSuccess } = useToast();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Datos de ejemplo para los puntos
  const puntosDisponibles = 15000;
  const puntosCargados = 0;
  const puntosTotal = 15000;
  const puntosUtilizadosAnteriores = 0;

  // Calcular porcentaje para la barra de progreso
  const porcentajeUtilizado = ((puntosCargados + puntosUtilizadosAnteriores) / puntosTotal) * 100;

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

  const handleConfiguracion = () => {
    navigate(`/programa/${programId}/configuracion`);
  };

  const handleDesafios = () => {
    navigate(`/programa/${programId}/desafios`);
  };

  // Obtener el programa actual desde el contexto
  const program = getProgram(programId || '');

  // Si no existe el programa, redirigir al home
  if (!program) {
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
      <ProgramSidebar activeMenu="puntos" />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <ProgramHeader />

        {/* Contenido de la página */}
        <main className="flex-1 p-8">
          {/* Header de la sección */}
          <div className="mb-6">
            <h1 className="text-2xl">Carga de Puntos</h1>
          </div>

          {/* Tarjeta azul de información de puntos */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-8 mb-6 text-white">
            {/* Saldo de puntos disponible */}
            <div className="text-center mb-6">
              <p className="text-sm mb-2 opacity-90">Saldo de puntos disponible</p>
              <p className="text-5xl font-semibold">{puntosDisponibles.toLocaleString('es-ES')}</p>
            </div>

            {/* Barra de progreso con indicadores */}
            <div className="flex items-center gap-4 mb-4">
              {/* Puntos cargados (izquierda) */}
              <div className="text-left">
                <p className="text-sm opacity-90 mb-1">Puntos cargados</p>
                <p className="text-3xl font-semibold">{puntosCargados}</p>
              </div>

              {/* Barra de progreso */}
              <div className="flex-1">
                <div className="bg-blue-800 bg-opacity-30 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-white h-full rounded-full transition-all duration-500"
                    style={{ width: `${porcentajeUtilizado}%` }}
                  ></div>
                </div>
              </div>

              {/* Saldo de puntos total (derecha) */}
              <div className="text-right">
                <p className="text-sm opacity-90 mb-1">Saldo de puntos total</p>
                <p className="text-3xl font-semibold">{puntosTotal.toLocaleString('es-ES')}</p>
              </div>
            </div>

            {/* Saldo de puntos utilizado más anterior */}
            <div className="text-center mt-6">
              <p className="text-sm mb-2 opacity-90">Saldo de puntos utilizado más anterior</p>
              <p className="text-3xl font-semibold">{puntosUtilizadosAnteriores}</p>
            </div>
          </div>

          {/* Botón Carga de puntos */}
          <div className="flex justify-end mb-6">
            <button 
              onClick={() => setShowUploadModal(true)}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Carga de puntos</span>
            </button>
          </div>

          {/* Historial de transacciones */}
          <div className="bg-white rounded-lg shadow-sm">
            {/* Header con filtros */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-medium">Historial de transacciones</h2>
              <div className="flex items-center gap-3">
                {/* Filtrar por fecha */}
                <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>Filtrar por fecha</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {/* Todos los períodos */}
                <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors text-sm">
                  <span>Todos los períodos</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Estatus
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Creado por
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Puntos cargados
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Nº de registros
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={6} className="px-6 py-16">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <BarChart3 className="w-16 h-16 text-gray-300 mb-4" />
                        <p className="text-sm">No hay transacciones para mostrar</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Modal de carga de puntos */}
      {showUploadModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.08)' }}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg" ref={modalRef}>
            {/* Header del modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-medium">Carga de Puntos</h2>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFile(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6">
              {/* Formato del archivo CSV */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Formato del archivo CSV</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Estás ejecutando una carga de puntos, el archivo debe contener las siguientes columnas:
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>
                    <span className="font-semibold text-blue-700">email</span> - Correo del participante (obligatorio)
                  </li>
                  <li>
                    <span className="font-semibold text-blue-700">puntos</span> - Monto de puntos a cargar (obligatorio)
                  </li>
                  <li>
                    <span className="font-semibold text-blue-700">motivo</span> - Descripcin de la carga de puntos (opcional)
                  </li>
                </ul>
              </div>

              {/* ¿Necesitas una plantilla? */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-gray-700">¿Necesitas una plantilla?</p>
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
                  onClick={() => {
                    // Lógica para descargar el formato de archivo
                    console.log('Descargar formato de archivo');
                  }}
                >
                  <Download className="w-4 h-4" />
                  Descargar formato de archivo
                </button>
              </div>

              {/* Seleccionar archivo CSV */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seleccionar archivo CSV
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".csv"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-gray-300 file:text-sm file:bg-white file:text-gray-700 hover:file:bg-gray-50 cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedFile(file);
                    }
                  }}
                />
              </div>

              {/* Botones */}
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedFile(null);
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedFile) {
                      console.log('Cargar puntos desde archivo:', selectedFile);
                      // Aquí iría la lógica para procesar el archivo
                      showSuccess('Cambios guardados con éxito');
                      setShowUploadModal(false);
                      setSelectedFile(null);
                    }
                  }}
                  disabled={!selectedFile}
                  className={`px-6 py-2 rounded-lg transition-colors ${
                    selectedFile
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Cargar Puntos
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}