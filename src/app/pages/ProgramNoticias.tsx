import { Search, Edit, Copy, Trash2, Plus, ChevronDown, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { usePrograms } from '../context/ProgramsContext';
import { ProgramSidebar } from '../components/ProgramSidebar';
import { ProgramHeader } from '../components/ProgramHeader';
import { CreateCommunicationModal } from '../components/CreateCommunicationModal';
import { useToast } from '../context/ToastContext';

export function ProgramNoticias() {
  const navigate = useNavigate();
  const { programId } = useParams();
  const { getProgram, getComunicacionesByProgram, deleteComunicacion, cloneComunicacion } = usePrograms();
  const { showSuccess } = useToast();

  // Estados para filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [contentFilter, setContentFilter] = useState('Todos los contenidos');
  const [statusFilter, setStatusFilter] = useState('Todos los estados');
  const [showNewCommunicationModal, setShowNewCommunicationModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  // Obtener el programa actual desde el contexto
  const program = getProgram(programId || '');

  // Obtener las comunicaciones del programa
  const comunicaciones = getComunicacionesByProgram(programId || '');

  // Función para formatear fechas con hora
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

  // Función para determinar el estado real basado en tiempo
  const getActualStatus = (item: any) => {
    // Si el estado es "Programada", verificar si la fecha de publicación ya pasó
    if (item.estado === 'Programada' && item.fechaPublicacion) {
      const now = new Date();
      const publishDate = new Date(item.fechaPublicacion);
      
      // Si la fecha de publicación es menor o igual a ahora, cambiar a "Publicada"
      if (publishDate <= now) {
        return 'Publicada';
      }
    }
    
    // Retornar el estado original en cualquier otro caso
    return item.estado;
  };

  // Función para obtener el color del estado con colores exactos
  const getStatusColor = (estado: string) => {
    switch(estado) {
      case 'Borrador': return 'bg-gray-100 text-gray-700';
      case 'Programada': return 'bg-blue-50 text-blue-700';
      case 'Publicada': return 'bg-green-50 text-green-700';
      case 'Despublicada': return 'bg-red-50 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Función para truncar texto largo
  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Función para manejar eliminación
  const handleDelete = (item: any) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      if (itemToDelete.tipo === 'Local') {
        // Borrado definitivo
        deleteComunicacion(itemToDelete.id);
        showSuccess('Comunicación eliminada exitosamente');
      } else {
        // Desvinculación - eliminar la comunicación del programa
        deleteComunicacion(itemToDelete.id);
        showSuccess('Comunicación transversal desvinculada exitosamente');
      }
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  // Función para manejar edición
  const handleEdit = (item: any) => {
    // No permitir editar comunicaciones transversales
    if (item.tipo === 'Transversal') {
      return;
    }
    
    if (item.contenido === 'Pop-up') {
      navigate(`/programa/${programId}/comunicaciones/muro/editar-popup/${item.id}`);
    } else {
      navigate(`/programa/${programId}/comunicaciones/muro/editar/${item.id}`);
    }
  };

  // Función para manejar clonado
  const handleClone = (item: any) => {
    if (item.contenido === 'Pop-up') {
      navigate(`/programa/${programId}/comunicaciones/muro/clonar-popup/${item.id}`);
    } else {
      navigate(`/programa/${programId}/comunicaciones/muro/clonar/${item.id}`);
    }
  };

  // Filtrar comunicaciones
  const filteredComunicaciones = comunicaciones.filter((item) => {
    const matchesSearch = item.titulo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesContent = contentFilter === 'Todos los contenidos' || item.contenido === contentFilter;
    const matchesStatus = statusFilter === 'Todos los estados' || item.estado === statusFilter;
    return matchesSearch && matchesContent && matchesStatus;
  });

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
      <ProgramSidebar activeMenu="comunicaciones-muro" />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <ProgramHeader />

        {/* Contenido de la página */}
        <main className="flex-1 p-8 overflow-y-auto">
          {/* Header de la sección */}
          <div className="mb-6">
            <h1 className="text-2xl">Muro</h1>
          </div>

          {/* Contenedor blanco con la tabla */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Barra de búsqueda y filtros */}
            <div className="flex items-center gap-4 mb-6">
              {/* Buscador */}
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por título..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                />
              </div>

              {/* Filtro de contenido */}
              <select
                value={contentFilter}
                onChange={(e) => setContentFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-white"
              >
                <option>Todos los contenidos</option>
                <option>Noticia</option>
                <option>Pop-up</option>
              </select>

              {/* Filtro de estado */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-white"
              >
                <option>Todos los estados</option>
                <option>Borrador</option>
                <option>Programada</option>
                <option>Publicada</option>
                <option>Despublicada</option>
              </select>

              {/* Botón Nueva comunicación con dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setShowNewCommunicationModal(true)}
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 whitespace-nowrap text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Nueva comunicación
                </button>
              </div>
            </div>

            {/* Tabla o Empty State */}
            {filteredComunicaciones.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-sm">No hay comunicaciones para mostrar</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        TÍTULO
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        CONTENIDO
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ESTADO
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        FECHA CREACIÓN
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        FECHA PUBLICACIÓN
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        TIPO
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ACCIONES
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredComunicaciones.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {truncateText(item.titulo)}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {item.contenido}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(getActualStatus(item))}`}>
                            {getActualStatus(item)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {formatDate(item.fechaCreacion)}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {item.fechaPublicacion ? formatDate(item.fechaPublicacion) : '—'}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                            item.tipo === 'Local' 
                              ? 'bg-[#FFF7ED] text-[#C2410C]' 
                              : 'bg-[#EEF2FF] text-[#4338CA]'
                          }`}>
                            {item.tipo}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            {/* Botón Editar - Solo para Local */}
                            {item.tipo === 'Local' ? (
                              <button 
                                onClick={() => handleEdit(item)}
                                className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            ) : (
                              <button 
                                disabled
                                className="p-1.5 text-gray-300 cursor-not-allowed"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            )}
                            
                            {/* Botón Clonar - Siempre disponible */}
                            <button 
                              onClick={() => handleClone(item)}
                              className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            
                            {/* Botón Eliminar - Siempre disponible */}
                            <button 
                              onClick={() => handleDelete(item)}
                              className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && itemToDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.08)' }}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {itemToDelete.tipo === 'Local' ? 'Eliminar comunicación' : 'Desvincular comunicación'}
              </h3>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setItemToDelete(null);
                }}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              {itemToDelete.tipo === 'Local' 
                ? '¿Estás seguro de que deseas eliminar definitivamente esta comunicación? Esta acción no se puede deshacer.'
                : '¿Estás seguro de que deseas desvincular esta comunicación transversal del programa? El contenido será eliminado de la vista pero el Super Admin será notificado.'
              }
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setItemToDelete(null);
                }}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                {itemToDelete.tipo === 'Local' ? 'Eliminar' : 'Desvincular'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de creación de comunicación */}
      <CreateCommunicationModal
        isOpen={showNewCommunicationModal}
        onClose={() => setShowNewCommunicationModal(false)}
        programId={programId || ''}
      />
    </div>
  );
}