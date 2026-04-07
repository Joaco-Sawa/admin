import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Search, Upload, X } from 'lucide-react';
import { ProgramSidebar } from '../components/ProgramSidebar';
import { ProgramHeader } from '../components/ProgramHeader';
import { useToast } from '../context/ToastContext';
import { usePrograms } from '../context/ProgramsContext';
import { ImageCropModal } from '../components/ImageCropModal';

export function BannersCrear() {
  const navigate = useNavigate();
  const { showSuccess } = useToast();
  const { addBanner } = usePrograms();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados del formulario
  const [nombre, setNombre] = useState('');
  const [catalogSearch, setCatalogSearch] = useState('');
  const [selectedCatalogs, setSelectedCatalogs] = useState<string[]>([]);
  const [url, setUrl] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [habilitado, setHabilitado] = useState(true);
  const [fechaDeshabilitar, setFechaDeshabilitar] = useState('');
  const [horaDeshabilitar, setHoraDeshabilitar] = useState('');
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [bannerFileName, setBannerFileName] = useState<string>('');
  
  // Estados de validación
  const [nombreError, setNombreError] = useState('');
  const [urlError, setUrlError] = useState('');
  const [fechaError, setFechaError] = useState('');

  // Estados para el modal de recorte
  const [showCropModal, setShowCropModal] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState<string>('');

  const catalogs = [
    { id: 'catalog-a', name: 'Catálogo A (A) — memberesía test 1' },
    { id: 'catalog-b', name: 'Catálogo A (A) — memberesía test 1' }
  ];

  // Función para obtener hora actual en formato HH:MM
  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Validación de nombre (máximo 100 caracteres)
  const handleNombreChange = (value: string) => {
    if (value.length <= 100) {
      setNombre(value);
      setNombreError('');
    } else {
      setNombreError('El nombre no puede exceder 100 caracteres');
    }
  };

  // Validación de URL
  const isValidUrl = (urlString: string) => {
    if (!urlString) return true;
    if (urlString.startsWith('/')) return true;
    try {
      const url = new URL(urlString);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleUrlChange = (value: string) => {
    setUrl(value);
    if (value && !isValidUrl(value)) {
      setUrlError('Ingresa una URL');
    } else {
      setUrlError('');
    }
  };

  // Validación de fechas
  const validateFechas = () => {
    if (fechaInicio && fechaDeshabilitar) {
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaDeshabilitar);
      
      if (fin <= inicio) {
        setFechaError('La fecha para deshabilitar debe ser superior a la fecha de inicio');
        return false;
      }
    }
    setFechaError('');
    return true;
  };

  const handleFechaInicioChange = (value: string) => {
    setFechaInicio(value);
    if (value && !horaInicio) {
      setHoraInicio(getCurrentTime());
    }
    if (fechaDeshabilitar) {
      setTimeout(() => validateFechas(), 0);
    }
  };

  const handleFechaDeshabilitarChange = (value: string) => {
    setFechaDeshabilitar(value);
    if (value && !horaDeshabilitar) {
      setHoraDeshabilitar(getCurrentTime());
    }
    if (fechaInicio) {
      setTimeout(() => validateFechas(), 0);
    }
  };

  const toggleCatalog = (catalogId: string) => {
    if (selectedCatalogs.includes(catalogId)) {
      setSelectedCatalogs(selectedCatalogs.filter(id => id !== catalogId));
    } else {
      setSelectedCatalogs([...selectedCatalogs, catalogId]);
    }
  };

  const seleccionarTodos = () => {
    setSelectedCatalogs(catalogs.map(c => c.id));
  };

  const limpiarSeleccion = () => {
    setSelectedCatalogs([]);
  };

  // Manejo de carga de imagen
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageSrc = e.target?.result as string;
        setTempImageSrc(imageSrc);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedBlob: Blob) => {
    const croppedUrl = URL.createObjectURL(croppedBlob);
    setBannerImage(croppedUrl);
    setBannerFileName('banner-recortado.jpg');
    setShowCropModal(false);
    setTempImageSrc('');
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setTempImageSrc('');
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    setBannerImage(null);
    setBannerFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageSrc = e.target?.result as string;
        setTempImageSrc(imageSrc);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleCrearBanner = () => {
    if (!nombre.trim()) {
      setNombreError('El nombre es requerido');
      return;
    }
    if (!url.trim()) {
      setUrlError('La URL es requerida');
      return;
    }
    if (!fechaInicio || !horaInicio) {
      alert('Por favor completa la fecha y hora de inicio');
      return;
    }

    // Formatear fechas para el formato de visualización
    const formatFecha = (fecha: string, hora: string) => {
      const [year, month, day] = fecha.split('-');
      return `${day}-${month}-${year}, ${hora}`;
    };

    const newBanner = {
      id: `BAN-${Date.now()}`,
      nombre,
      catalogos: selectedCatalogs.map(id => catalogs.find(c => c.id === id)?.name || id),
      url,
      imagen: bannerImage || undefined,
      inicio: formatFecha(fechaInicio, horaInicio),
      deshabilitar: fechaDeshabilitar ? formatFecha(fechaDeshabilitar, horaDeshabilitar) : '',
      estado: (habilitado ? 'Habilitado' : 'Deshabilitado') as 'Habilitado' | 'Deshabilitado',
      habilitado,
      createdAt: new Date().toISOString()
    };

    addBanner(newBanner);
    showSuccess('Banner creado con éxito');
    navigate('/banners');
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      <ProgramSidebar activeSection="catalogo" />

      <div className="flex-1 flex flex-col">
        <ProgramHeader />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl">Crear Banner</h1>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
              {/* Nombre */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => handleNombreChange(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                    nombreError ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {nombreError && (
                  <p className="text-xs text-red-500 mt-1">{nombreError}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">{nombre.length}/100 caracteres</p>
              </div>

              {/* Catálogos */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">Catálogos</label>
                <div className="border border-gray-300 rounded-lg p-4">
                  <div className="relative mb-3">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={catalogSearch}
                      onChange={(e) => setCatalogSearch(e.target.value)}
                      placeholder="Buscar..."
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div className="flex justify-between items-center mb-3 text-sm">
                    <button
                      onClick={seleccionarTodos}
                      className="text-orange-500 hover:text-orange-600"
                    >
                      Seleccionar todo
                    </button>
                    <button
                      onClick={limpiarSeleccion}
                      className="text-gray-600 hover:text-gray-700"
                    >
                      Limpiar selección
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCatalogs.includes('catalog-a')}
                        onChange={() => toggleCatalog('catalog-a')}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Catálogo A (A) — memberesía test 1</span>
                    </label>

                    <div className="pt-2">
                      <span className="text-sm text-orange-500">Catálogo A (A) — memberesía test 1</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* URL */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="/ruta o https://ejemplo.com"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                    urlError ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {urlError && (
                  <p className="text-xs text-red-500 mt-1">{urlError}</p>
                )}
              </div>

              {/* Imagen del banner */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">Imagen del banner</label>
                {!bannerImage ? (
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-16 hover:border-orange-400 transition-colors cursor-pointer"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                        <Upload className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-600 mb-1">Arrastra y suelta tu archivo aquí</p>
                      <p className="text-xs text-gray-400 mb-2">o</p>
                      <span className="text-sm text-blue-600 hover:text-blue-700">
                        Buscar archivo
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden">
                    <img 
                      src={bannerImage} 
                      alt="Banner preview" 
                      className="w-full h-auto"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button
                        onClick={handleRemoveImage}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                        title="Eliminar imagen"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {bannerFileName && (
                      <div className="bg-gray-900 bg-opacity-75 text-white px-4 py-2 text-sm">
                        {bannerFileName}
                      </div>
                    )}
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Fecha y Hora de inicio */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Fecha de inicio <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => handleFechaInicioChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Hora de inicio <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={horaInicio}
                    onChange={(e) => setHoraInicio(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Habilitado */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">Habilitado</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setHabilitado(true)}
                    className={`px-8 py-2 rounded-lg transition-colors text-sm ${
                      habilitado
                        ? 'bg-orange-500 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    SI
                  </button>
                  <button
                    onClick={() => setHabilitado(false)}
                    className={`px-8 py-2 rounded-lg transition-colors text-sm ${
                      !habilitado
                        ? 'bg-orange-500 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    NO
                  </button>
                </div>
              </div>

              {/* Fecha y Hora para deshabilitar */}
              <div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Fecha para deshabilitar</label>
                    <input
                      type="date"
                      value={fechaDeshabilitar}
                      onChange={(e) => handleFechaDeshabilitarChange(e.target.value)}
                      min={fechaInicio}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                        fechaError ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Hora para deshabilitar</label>
                    <input
                      type="time"
                      value={horaDeshabilitar}
                      onChange={(e) => setHoraDeshabilitar(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
                {fechaError && (
                  <p className="text-xs text-red-500 mt-1">{fechaError}</p>
                )}
              </div>

              {/* Botones de acción */}
              <div className="flex gap-4 pt-6">
                <button
                  onClick={() => navigate('/banners')}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  CANCELAR
                </button>
                <button 
                  onClick={handleCrearBanner}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  CREAR BANNER
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Modal de recorte de imagen */}
        <ImageCropModal
          isOpen={showCropModal}
          imageSrc={tempImageSrc}
          onClose={handleCropCancel}
          onCropComplete={handleCropComplete}
          aspectRatio={3}
          cropShape="rect"
          title="Recortar imagen de banner"
          requiredDimensions="1200 x 400 px"
        />
      </div>
    </div>
  );
}