import { useNavigate, useParams } from 'react-router';
import { usePrograms } from '../context/ProgramsContext';
import { ProgramSidebar } from '../components/ProgramSidebar';
import { ProgramHeader } from '../components/ProgramHeader';
import { CircleDollarSign, Users, FileText } from 'lucide-react';

export function ProgramDetail() {
  const navigate = useNavigate();
  const { programId } = useParams();
  const { getProgram } = usePrograms();

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
      <ProgramSidebar activeMenu="inicio" />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <ProgramHeader />

        <main className="flex-1 p-8">
          <h1 className="text-2xl mb-8">Dashboard</h1>

          {/* Grid de cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Card Saldo de puntos */}
            <div className="bg-blue-600 text-white rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <CircleDollarSign className="w-6 h-6" />
                </div>
                <div className="text-sm">Saldo de puntos disponibles</div>
              </div>
              <div className="text-4xl font-bold mb-1">4.221</div>
              <div className="text-sm opacity-90">Saldo total de puntos</div>
              <div className="text-2xl font-semibold mt-2">20.000</div>
            </div>

            {/* Card Puntos cargados */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="text-sm text-gray-600">Puntos cargados este mes</div>
              </div>
              <div className="text-4xl font-bold text-gray-900">639</div>
            </div>

            {/* Card Usuarios habilitados */}
            <div className="bg-white rounded-xl p-6 border-2 border-orange-400">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-sm text-gray-600">Usuarios habilitados</div>
              </div>
              <div className="text-4xl font-bold text-gray-900">1.373</div>
            </div>
          </div>

          {/* Sección inferior con dos columnas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna izquierda - Información del programa */}
            <div className="lg:col-span-2 space-y-6">
              {/* Card Programa */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="text-sm text-gray-600 mb-4">Programa</div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                      F
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">FFVV en el desafío</div>
                      <div className="text-sm text-gray-500">Softys</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Estado</span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Activo</span>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Ver documentación
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Descargar documentación
                    </button>
                  </div>
                </div>
              </div>

              {/* Tabla de Desafíos */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="text-lg font-semibold mb-4">Desafíos</div>
                <table className="w-full">
                  <thead className="border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 text-xs font-semibold text-gray-600 uppercase">Nombre</th>
                      <th className="text-left py-3 text-xs font-semibold text-gray-600 uppercase">Estado</th>
                      <th className="text-left py-3 text-xs font-semibold text-gray-600 uppercase">Fecha de inicio</th>
                      <th className="text-left py-3 text-xs font-semibold text-gray-600 uppercase">Fecha de término</th>
                      <th className="text-left py-3 text-xs font-semibold text-gray-600 uppercase">Número de participantes</th>
                      <th className="text-left py-3 text-xs font-semibold text-gray-600 uppercase"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-sm font-semibold">S</div>
                          <div>
                            <div className="font-medium">Supernova</div>
                            <div className="text-xs text-gray-500">Ejecutivas/Jefaturas</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">En curso</span>
                      </td>
                      <td className="py-3 text-sm">01/07/2025</td>
                      <td className="py-3 text-sm">30/07/2025</td>
                      <td className="py-3 text-sm text-center">5</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-sm font-semibold">C</div>
                          <div>
                            <div className="font-medium">Confort</div>
                            <div className="text-xs text-gray-500">Premium</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Anulado</span>
                      </td>
                      <td className="py-3 text-sm">01/07/2025</td>
                      <td className="py-3 text-sm">30/07/2025</td>
                      <td className="py-3 text-sm text-center">0</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-sm font-semibold">E</div>
                          <div>
                            <div className="font-medium">Elite</div>
                            <div className="text-xs text-gray-500">Ejecutivas/Jefaturas</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">En curso</span>
                      </td>
                      <td className="py-3 text-sm">04/06/2025</td>
                      <td className="py-3 text-sm">04/07/2025</td>
                      <td className="py-3 text-sm text-center">64</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Columna derecha - Widgets laterales */}
            <div className="space-y-6">
              {/* Últimos reconocimientos */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="font-semibold mb-4">Últimos reconocimientos</div>
                <div className="space-y-3">
                  {[
                    { from: 'Francisco Guerra', to: 'Roberto Soto' },
                    { from: 'Amalia Gómez', to: 'Carla Guzmán' },
                    { from: 'Fernando Ortiz', to: 'Sonia Montero' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                      <div className="w-8 h-8 bg-orange-400 rounded-full"></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{item.from}</div>
                        <div className="text-xs text-gray-500">{item.to}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Últimos canjes */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="font-semibold mb-4">Últimos canjes</div>
                <div className="space-y-3">
                  {[
                    { name: 'Roberto Soto', time: 'Hace 4 horas' },
                    { name: 'Fernanda Araujo', time: 'Hace 1 día' },
                    { name: 'Clara Mellado', time: 'Hace 3 días' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{item.name} ha realizado un canje</div>
                        <div className="text-xs text-gray-500">{item.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Estadísticas circulares */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">61%</div>
                  <div className="text-xs text-gray-600">Monthly Active Users</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">25%</div>
                  <div className="text-xs text-gray-600">Weekly Active Users</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}