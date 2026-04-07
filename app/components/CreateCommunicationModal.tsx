import { X, Megaphone, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router';

interface CreateCommunicationModalProps {
  isOpen?: boolean;
  onClose: () => void;
  programId: string;
}

export function CreateCommunicationModal({ isOpen = true, onClose, programId }: CreateCommunicationModalProps) {
  const navigate = useNavigate();
  
  if (!isOpen) return null;

  const handleSelectType = (type: 'noticia' | 'popup') => {
    if (type === 'noticia') {
      navigate(`/programa/${programId}/comunicaciones/crear-noticia`);
    } else {
      navigate(`/programa/${programId}/comunicaciones/crear-popup`);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.08)' }}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Crear Nueva Comunicación</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 gap-6">
          {/* Card Noticia */}
          <button
            onClick={() => handleSelectType('noticia')}
            className="border-2 border-gray-200 rounded-xl p-8 hover:border-orange-500 hover:bg-orange-50 transition-all group text-left"
          >
            <div className="flex flex-col gap-5">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                <Megaphone className="w-10 h-10 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-3">Noticia</h3>
                <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                  Ideal para artículos de interés, beneficios y novedades permanentes. El contenido se guarda en el muro.
                </p>
                <p className="text-xs text-gray-500">
                  Hitos, Beneficios, Tutoriales, Artículos
                </p>
              </div>
            </div>
          </button>

          {/* Card Pop-up */}
          <button
            onClick={() => handleSelectType('popup')}
            className="border-2 border-gray-200 rounded-xl p-8 hover:border-blue-500 hover:bg-blue-50 transition-all group text-left"
          >
            <div className="flex flex-col gap-5">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <MessageSquare className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-3">Pop-up</h3>
                <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                  Ideal para alertas urgentes, recordatorios o anuncios de impacto inmediato. Se muestra una sola vez al iniciar sesión.
                </p>
                <p className="text-xs text-gray-500">
                  Alertas, Vencimientos, Promociones, Urgente
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}