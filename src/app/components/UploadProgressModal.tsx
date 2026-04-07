import { X, Download } from 'lucide-react';
import { useState } from 'react';

interface UploadProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  challengeName: string;
  onUpload: (file: File) => void;
  onDelete: () => void;
}

export function UploadProgressModal({ isOpen, onClose, challengeName, onUpload, onDelete }: UploadProgressModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
      setSelectedFile(null);
      onClose();
    }
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  const handleDownloadTemplate = () => {
    // Crear un CSV de ejemplo
    const csvContent = 'email,meta,puntos,avance\nejemplo@mail.com,100,50,75\n';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla_avances.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleOverlay = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.08)' }}
      onClick={handleOverlay}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Carga de Avances - {challengeName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Formato del archivo CSV */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Formato del archivo CSV</h3>
            <p className="text-sm text-gray-700 mb-3">
              Desafío tipo Meta: El archivo debe contener las siguientes columnas:
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="font-semibold text-blue-700">email</span>
                <span className="text-gray-700"> - Correo del participante (obligatorio)</span>
              </li>
              <li>
                <span className="font-semibold text-blue-700">meta</span>
                <span className="text-gray-700"> - Meta del participante (obligatorio)</span>
              </li>
              <li>
                <span className="font-semibold text-blue-700">puntos</span>
                <span className="text-gray-700"> - Puntos asignados (obligatorio)</span>
              </li>
              <li>
                <span className="font-semibold text-blue-700">avance</span>
                <span className="text-gray-700"> - Avance del participante (obligatorio)</span>
              </li>
            </ul>
          </div>

          {/* Descargar plantilla */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">¿Necesitas una plantilla?</span>
            <button
              onClick={handleDownloadTemplate}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Descargar formato de archivo
            </button>
          </div>

          {/* Seleccionar archivo */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Seleccionar archivo CSV
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-600
                file:mr-4 file:py-2.5 file:px-4
                file:rounded-lg file:border file:border-gray-300
                file:text-sm file:font-medium
                file:bg-white file:text-gray-700
                hover:file:bg-gray-50
                file:cursor-pointer cursor-pointer"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Eliminar Avances
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                selectedFile
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Cargar Avances
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
