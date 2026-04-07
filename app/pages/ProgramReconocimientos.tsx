import { Award, Search, Filter, Plus, MoreVertical, Heart, MessageCircle, Eye } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { usePrograms } from '../context/ProgramsContext';
import { ProgramSidebar } from '../components/ProgramSidebar';
import { ProgramHeader } from '../components/ProgramHeader';

export function ProgramReconocimientos() {
  const navigate = useNavigate();
  const { programId } = useParams();
  const { getProgram } = usePrograms();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, pending, approved

  const program = getProgram(programId || '');

  // Datos de ejemplo de reconocimientos
  const reconocimientos = [
    {
      id: 1,
      emisor: 'Juan Pérez',
      receptor: 'María González',
      tipo: 'Trabajo en equipo',
      mensaje: '¡Excelente trabajo en el proyecto! Tu dedicación marcó la diferencia.',
      fecha: '2024-03-01',
      puntos: 50,
      estado: 'Aprobado',
      likes: 12,
      comentarios: 3,
      vistas: 45
    },
    {
      id: 2,
      emisor: 'Carlos Ramírez',
      receptor: 'Ana Torres',
      tipo: 'Innovación',
      mensaje: 'Gracias por tu creatividad en encontrar soluciones innovadoras.',
      fecha: '2024-03-02',
      puntos: 75,
      estado: 'Pendiente',
      likes: 8,
      comentarios: 1,
      vistas: 23
    },
    {
      id: 3,
      emisor: 'Laura Díaz',
      receptor: 'Pedro Sánchez',
      tipo: 'Liderazgo',
      mensaje: 'Tu liderazgo en el equipo ha sido inspirador. ¡Sigue así!',
      fecha: '2024-03-03',
      puntos: 100,
      estado: 'Aprobado',
      likes: 20,
      comentarios: 5,
      vistas: 67
    }
  ];

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

  const filteredReconocimientos = reconocimientos.filter(reconocimiento => {
    const matchesSearch = 
      reconocimiento.emisor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reconocimiento.receptor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reconocimiento.tipo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reconocimiento.mensaje.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filterType === 'all' || 
      (filterType === 'pending' && reconocimiento.estado === 'Pendiente') ||
      (filterType === 'approved' && reconocimiento.estado === 'Aprobado');
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      {/* Sidebar */}
      <ProgramSidebar activeMenu="reconocimientos" />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <ProgramHeader />

        {/* Contenido de la página */}
        <main className="flex-1 p-8">
          {/* Header de la página */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl">Reconocimientos</h1>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Nuevo Reconocimiento
            </button>
          </div>

          {/* Filtros y búsqueda */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex items-center gap-4">
              {/* Buscador */}
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por emisor, receptor, tipo o mensaje..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Filtro por estado */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">Todos</option>
                  <option value="pending">Pendientes</option>
                  <option value="approved">Aprobados</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tarjetas de reconocimientos */}
          <div className="space-y-4">
            {filteredReconocimientos.map((reconocimiento) => (
              <div key={reconocimiento.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Avatar del emisor */}
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold">
                      {reconocimiento.emisor.split(' ').map(n => n[0]).join('')}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{reconocimiento.emisor}</span>
                        <span className="text-gray-400">→</span>
                        <span className="font-medium text-gray-900">{reconocimiento.receptor}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                        <span className="px-2 py-1 bg-orange-50 text-orange-600 rounded text-xs font-medium">
                          {reconocimiento.tipo}
                        </span>
                        <span>{reconocimiento.fecha}</span>
                        <span className="px-2 py-1 bg-green-50 text-green-600 rounded text-xs font-medium">
                          +{reconocimiento.puntos} puntos
                        </span>
                      </div>

                      <p className="text-gray-700 mb-4">{reconocimiento.mensaje}</p>

                      {/* Interacciones */}
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>{reconocimiento.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{reconocimiento.comentarios}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{reconocimiento.vistas}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Estado y acciones */}
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      reconocimiento.estado === 'Aprobado' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {reconocimiento.estado}
                    </span>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredReconocimientos.length === 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay reconocimientos</h3>
                <p className="text-gray-500">
                  {searchQuery || filterType !== 'all' 
                    ? 'No se encontraron reconocimientos con los filtros aplicados' 
                    : 'Aún no hay reconocimientos registrados'}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
