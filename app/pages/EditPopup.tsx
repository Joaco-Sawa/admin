import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Upload, Check, X, AlertCircle, Download } from 'lucide-react';
import { ProgramSidebar } from '../components/ProgramSidebar';
import { ProgramHeader } from '../components/ProgramHeader';
import { useToast } from '../context/ToastContext';
import { usePrograms } from '../context/ProgramsContext';

export function EditPopup() {
  const navigate = useNavigate();
  const { programId, noticiaId } = useParams();
  const { showSuccess, showInfo } = useToast();
  const { comunicaciones, updateComunicacion } = usePrograms();
  
  // Encontrar la comunicación a editar
  const comunicacion = comunicaciones.find(c => c.id === noticiaId);
  
  // Estados del formulario
  const [currentStep, setCurrentStep] = useState(1);
  const [titulo, setTitulo] = useState('');
  const [showCTA, setShowCTA] = useState(false);
  const [ctaLink, setCtaLink] = useState('');
  
  // Estados de imagen
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  // Estados paso 2
  const [publishStrategy, setPublishStrategy] = useState<'now' | 'scheduled'>('now');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [unpublishDate, setUnpublishDate] = useState('');
  const [unpublishTime, setUnpublishTime] = useState('');
  const [segmentation, setSegmentation] = useState<'all' | 'csv'>('all');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvSummary, setCsvSummary] = useState<{ total: number; duplicates: number; notFound: number } | null>(null);
  const [csvConfirmed, setCsvConfirmed] = useState(false);
  
  // Estados de validación
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Cargar datos de la comunicación al montar
  useEffect(() => {
    if (comunicacion) {
      setTitulo(comunicacion.titulo);
      setShowCTA(!!comunicacion.cta);
      setCtaLink(comunicacion.cta?.enlace || '');
      
      if (comunicacion.imagen) {
        setUploadedImage(comunicacion.imagen.url);
      }
      
      // Cargar datos de publicación
      if (comunicacion.estado === 'Programada' && comunicacion.fechaPublicacion) {
        setPublishStrategy('scheduled');
        setScheduledDate(comunicacion.fechaPublicacion);
        setScheduledTime('09:00'); // Valor por defecto si no está guardado
      }
      
      // Cargar fecha de despublicación
      if (comunicacion.fechaDespublicacion) {
        setUnpublishDate(comunicacion.fechaDespublicacion);
        setUnpublishTime('23:59'); // Valor por defecto
      }
      
      // Cargar segmentación
      if (comunicacion.segmentacion) {
        setSegmentation(comunicacion.segmentacion.tipo);
        if (comunicacion.segmentacion.tipo === 'csv' && comunicacion.segmentacion.usuarios) {
          setCsvConfirmed(true);
          setCsvSummary({
            total: comunicacion.segmentacion.usuarios.length,
            duplicates: 0,
            notFound: 0
          });
        }
      }
    }
  }, [comunicacion]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result as string;
        setUploadedImage(imageUrl);
        if (errors.imagen) {
          setErrors({ ...errors, imagen: '' });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
      setCsvConfirmed(false);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        const emails = lines.slice(1).map(line => line.trim());
        
        const uniqueEmails = new Set(emails);
        const totalDetected = uniqueEmails.size;
        const duplicates = emails.length - totalDetected;
        const notFound = Math.floor(totalDetected * 0.08);
        
        setCsvSummary({
          total: totalDetected - notFound,
          duplicates,
          notFound
        });
      };
      reader.readAsText(file);
    }
  };

  const handleConfirmCSV = () => {
    setCsvConfirmed(true);
    showInfo('Archivo CSV confirmado y guardado');
  };

  const handleRemoveCSV = () => {
    setCsvFile(null);
    setCsvSummary(null);
    setCsvConfirmed(false);
    const fileInput = document.getElementById('csv-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    showInfo('Archivo CSV eliminado');
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!titulo.trim()) {
      newErrors.titulo = 'El campo es obligatorio';
    }
    
    if (!uploadedImage) {
      newErrors.imagen = 'La imagen es obligatoria para Pop-ups';
    }
    
    if (showCTA) {
      if (!ctaLink.trim()) {
        newErrors.ctaLink = 'El campo es obligatorio';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (publishStrategy === 'scheduled') {
      if (!scheduledDate) {
        newErrors.scheduledDate = 'El campo es obligatorio';
      }
      if (!scheduledTime) {
        newErrors.scheduledTime = 'El campo es obligatorio';
      }
    }
    
    if (!unpublishDate) {
      newErrors.unpublishDate = 'El campo es obligatorio';
    }
    if (!unpublishTime) {
      newErrors.unpublishTime = 'El campo es obligatorio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setCurrentStep(2);
      setErrors({});
    }
  };

  const handleSaveDraft = () => {
    if (!programId || !comunicacion) return;
    
    const updatedComunicacion = {
      ...comunicacion,
      titulo: titulo || '(Sin título)',
      estado: 'Borrador' as const,
      imagen: uploadedImage ? {
        url: uploadedImage
      } : undefined,
      cta: showCTA && ctaLink ? { texto: '', enlace: ctaLink } : undefined,
    };
    
    updateComunicacion(updatedComunicacion);
    showSuccess('Borrador guardado con éxito');
    navigate(`/programa/${programId}/comunicaciones/muro`);
  };

  const handlePublish = () => {
    if (validateStep2()) {
      setShowConfirmModal(true);
    }
  };

  const confirmPublish = () => {
    if (!programId || !comunicacion) return;
    
    const estado = publishStrategy === 'now' ? 'Publicada' : 'Programada';
    const fechaPublicacion = publishStrategy === 'now'
      ? new Date().toISOString().split('T')[0]
      : scheduledDate;
    
    const updatedComunicacion = {
      ...comunicacion,
      titulo,
      estado: estado as 'Borrador' | 'Programada' | 'Publicada' | 'Despublicada',
      fechaPublicacion,
      imagen: uploadedImage ? {
        url: uploadedImage
      } : undefined,
      cta: showCTA ? { texto: '', enlace: ctaLink } : undefined,
      segmentacion: {
        tipo: segmentation,
        usuarios: csvSummary ? Array(csvSummary.total).fill('user@example.com') : undefined,
      },
      fechaDespublicacion: unpublishDate,
      despublicacionAuto: true,
    };
    
    updateComunicacion(updatedComunicacion);
    showSuccess('¡Pop-up actualizado con éxito!');
    navigate(`/programa/${programId}/comunicaciones/muro`);
  };

  const getCharCount = (text: string, max: number) => {
    return `${text.length}/${max}`;
  };

  const handleDownloadCSVTemplate = () => {
    const csvContent = 'email\nparticipante1@example.com\nparticipante2@example.com\nparticipante3@example.com';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla_segmentacion.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    showInfo('Plantilla CSV descargada');
  };

  if (!comunicacion) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Pop-up no encontrado</h1>
          <button 
            onClick={() => navigate(`/programa/${programId}/comunicaciones/muro`)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver a comunicaciones
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      <ProgramSidebar activeMenu="comunicaciones-muro" />
      
      <div className="flex-1 flex flex-col">
        <ProgramHeader />
        
        <main className="flex-1 overflow-y-auto">
          {/* Header con botón volver y título */}
          <div className="bg-white px-8 pt-10 pb-6 border-b border-gray-200">
            <button
              onClick={() => navigate(`/programa/${programId}/comunicaciones/muro`)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a comunicaciones</span>
            </button>
            <h1 className="text-2xl font-medium">Editar Pop-up</h1>
          </div>

          {/* Stepper */}
          <div className="bg-white px-8 py-8">
            <div className="flex items-center justify-center gap-3 max-w-md mx-auto">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  currentStep === 1 ? 'bg-blue-600 text-white' : 'bg-green-500 text-white'
                }`}>
                  {currentStep === 1 ? '1' : <Check className="w-4 h-4" />}
                </div>
                <span className={`text-sm ${currentStep === 1 ? 'text-blue-600 font-medium' : 'text-gray-900'}`}>
                  Contenido
                </span>
              </div>
              
              <div className={`flex-1 h-px ${currentStep === 2 ? 'bg-blue-600' : 'bg-gray-300'}`} />
              
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  currentStep === 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  2
                </div>
                <span className={`text-sm ${currentStep === 2 ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
                  Publicación
                </span>
              </div>
            </div>
          </div>

          {/* Formulario Paso 1 */}
          <div className="p-8 bg-[#F5F5F5]">
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* Tarjeta: Título */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => {
                    if (e.target.value.length <= 70) {
                      setTitulo(e.target.value);
                      if (errors.titulo) {
                        setErrors({ ...errors, titulo: '' });
                      }
                    }
                  }}
                  maxLength={70}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                    errors.titulo ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Escribe el título del pop-up"
                />
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500">{getCharCount(titulo, 70)}</span>
                  {errors.titulo && (
                    <span className="text-xs text-red-500">{errors.titulo}</span>
                  )}
                </div>
              </div>

              {/* Tarjeta: Imagen */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="mb-3">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">
                    Imagen <span className="text-red-500">*</span>
                  </h3>
                  <p className="text-xs text-gray-500">La imagen es obligatoria para Pop-ups</p>
                </div>
                
                {!uploadedImage ? (
                  <div>
                    <div className={`border-2 border-dashed rounded-lg p-8 text-center hover:border-blue-500 transition-colors ${
                      errors.imagen ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          Arrastra una imagen o <span className="text-blue-600">haz clic para cargar</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG hasta 5MB</p>
                      </label>
                    </div>
                    {errors.imagen && (
                      <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.imagen}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div 
                      className="relative bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center"
                      style={{ height: '400px' }}
                    >
                      <img 
                        src={uploadedImage} 
                        alt="Vista previa" 
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <label 
                        htmlFor="image-replace"
                        className="flex-1 text-center py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        Reemplazar
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-replace"
                        />
                      </label>
                      <div className="w-px h-8 bg-gray-300" />
                      <button
                        onClick={() => {
                          setUploadedImage(null);
                        }}
                        className="flex-1 text-center py-3 text-sm font-medium text-red-600 hover:bg-gray-50 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Tarjeta: CTA (Opcional) */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">
                    Botón de acción (CTA)
                  </label>
                  <button
                    onClick={() => setShowCTA(!showCTA)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      showCTA ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      showCTA ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                
                {showCTA && (
                  <div className="pl-4 border-l-2 border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enlace <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      value={ctaLink}
                      onChange={(e) => {
                        setCtaLink(e.target.value);
                        if (errors.ctaLink) {
                          setErrors({ ...errors, ctaLink: '' });
                        }
                      }}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                        errors.ctaLink ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="https://ejemplo.com o /ruta"
                    />
                    {errors.ctaLink && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.ctaLink}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Barra de navegación inferior */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate(`/programa/${programId}/comunicaciones/popup`)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Anterior
                  </button>

                  <button
                    onClick={handleSaveDraft}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Guardar Borrador
                  </button>
                </div>

                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}

          {/* Formulario Paso 2 */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Estrategia de publicación - Contenedor Maestro */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Estrategia de Publicación <span className="text-red-500">*</span>
                </label>
                
                {/* Opciones de inicio */}
                <div className="space-y-3 mb-6">
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="strategy"
                      checked={publishStrategy === 'now'}
                      onChange={() => setPublishStrategy('now')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div>
                      <span className="text-sm font-medium block">Publicar ahora</span>
                      <span className="text-xs text-gray-500">La comunicación estará visible inmediatamente</span>
                    </div>
                  </label>
                  
                  <label className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="strategy"
                      checked={publishStrategy === 'scheduled'}
                      onChange={() => setPublishStrategy('scheduled')}
                      className="w-4 h-4 text-blue-600 mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="mb-3">
                        <span className="text-sm font-medium block">Programar publicación</span>
                        <span className="text-xs text-gray-500">Define cuándo se publicará la comunicación</span>
                      </div>
                      {publishStrategy === 'scheduled' && (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Fecha</label>
                            <input
                              type="date"
                              value={scheduledDate}
                              onChange={(e) => {
                                setScheduledDate(e.target.value);
                                if (errors.scheduledDate) {
                                  setErrors({ ...errors, scheduledDate: '' });
                                }
                              }}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm ${
                                errors.scheduledDate ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />
                            {errors.scheduledDate && (
                              <span className="text-xs text-red-500 mt-1">{errors.scheduledDate}</span>
                            )}
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Hora</label>
                            <input
                              type="time"
                              value={scheduledTime}
                              onChange={(e) => {
                                setScheduledTime(e.target.value);
                                if (errors.scheduledTime) {
                                  setErrors({ ...errors, scheduledTime: '' });
                                }
                              }}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm ${
                                errors.scheduledTime ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />
                            {errors.scheduledTime && (
                              <span className="text-xs text-red-500 mt-1">{errors.scheduledTime}</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </label>
                </div>

                {/* Separador visual */}
                <div className="border-t border-gray-200 my-6"></div>

                {/* Subsección de Despublicación - OBLIGATORIA para Pop-ups */}
                <div>
                  <div className="mb-3">
                    <h3 className="text-sm font-medium text-gray-900">
                      Despublicación automática <span className="text-red-500">*</span>
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Configura cuándo debe dejar de mostrarse este Pop-up
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Fecha <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={unpublishDate}
                        onChange={(e) => {
                          setUnpublishDate(e.target.value);
                          if (errors.unpublishDate) {
                            setErrors({ ...errors, unpublishDate: '' });
                          }
                        }}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm ${
                          errors.unpublishDate ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.unpublishDate && (
                        <span className="text-xs text-red-500 mt-1">{errors.unpublishDate}</span>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Hora <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        value={unpublishTime}
                        onChange={(e) => {
                          setUnpublishTime(e.target.value);
                          if (errors.unpublishTime) {
                            setErrors({ ...errors, unpublishTime: '' });
                          }
                        }}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm ${
                          errors.unpublishTime ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.unpublishTime && (
                        <span className="text-xs text-red-500 mt-1">{errors.unpublishTime}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Segmentación */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Segmentación <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="segmentation"
                      checked={segmentation === 'all'}
                      onChange={() => setSegmentation('all')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm">Para todos</span>
                  </label>
                  
                  <label className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="segmentation"
                      checked={segmentation === 'csv'}
                      onChange={() => setSegmentation('csv')}
                      className="w-4 h-4 text-blue-600 mt-0.5"
                    />
                    <div className="flex-1">
                      <span className="text-sm block mb-3">Carga CSV</span>
                      {segmentation === 'csv' && (
                        <div>
                          {!csvConfirmed && (
                            <>
                              <div className="flex items-center gap-2 mb-3">
                                <input
                                  type="file"
                                  accept=".csv"
                                  onChange={handleCSVUpload}
                                  className="hidden"
                                  id="csv-upload"
                                />
                                <label
                                  htmlFor="csv-upload"
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer text-sm"
                                >
                                  <Upload className="w-4 h-4" />
                                  Cargar CSV
                                </label>
                                <button
                                  onClick={handleDownloadCSVTemplate}
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                                >
                                  <Download className="w-4 h-4" />
                                  Descargar plantilla
                                </button>
                              </div>
                              
                              {csvSummary && (
                                <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                      <Check className="w-4 h-4 text-green-600" />
                                      <span className="text-green-700">Total detectados: {csvSummary.total}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                                      <span className="text-yellow-700">Duplicados omitidos: {csvSummary.duplicates}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                      <X className="w-4 h-4 text-red-600" />
                                      <span className="text-red-700">Inexistentes: {csvSummary.notFound}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-2 pt-2">
                                    <button
                                      onClick={handleConfirmCSV}
                                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                                    >
                                      Confirmar carga
                                    </button>
                                    <button
                                      onClick={handleRemoveCSV}
                                      className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm font-medium"
                                    >
                                      Eliminar archivo
                                    </button>
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                          
                          {csvConfirmed && csvFile && (
                            <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <Check className="w-5 h-5 text-green-600" />
                                  <span className="text-sm font-medium text-green-900">Archivo cargado exitosamente</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="text-sm text-green-700">
                                  <span className="font-medium">{csvFile.name}</span>
                                  <span className="ml-2">• {csvSummary?.total || 0} participantes</span>
                                </div>
                                <button
                                  onClick={handleRemoveCSV}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  Eliminar
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </label>
                </div>
                </div>
              </div>

              {/* Barra de navegación inferior */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Anterior
                  </button>

                  <button
                    onClick={handleSaveDraft}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Guardar Borrador
                  </button>
                </div>

                <button
                  onClick={handlePublish}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Confirmar Actualización
                </button>
              </div>
            </div>
          )}
        </div>
        </main>

      {/* Modal de confirmación */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.08)' }}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Confirmar Actualización</h3>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">Título</span>
                <span className="text-sm font-medium text-gray-900">{titulo}</span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">Tipo</span>
                <span className="text-sm font-medium text-gray-900">Pop-up</span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">Fecha de publicación</span>
                <span className="text-sm font-medium text-gray-900">
                  {publishStrategy === 'now' 
                    ? (() => {
                        const now = new Date();
                        const day = String(now.getDate()).padStart(2, '0');
                        const month = String(now.getMonth() + 1).padStart(2, '0');
                        const year = now.getFullYear();
                        const hours = String(now.getHours()).padStart(2, '0');
                        const minutes = String(now.getMinutes()).padStart(2, '0');
                        return `${day}/${month}/${year} ${hours}:${minutes}`;
                      })()
                    : (() => {
                        const date = new Date(scheduledDate + 'T' + scheduledTime);
                        const day = String(date.getDate()).padStart(2, '0');
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const year = date.getFullYear();
                        const hours = String(date.getHours()).padStart(2, '0');
                        const minutes = String(date.getMinutes()).padStart(2, '0');
                        return `${day}/${month}/${year} ${hours}:${minutes}`;
                      })()
                  }
                </span>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-gray-600">Participantes impactados</span>
                <span className="text-sm font-medium text-gray-900">
                  {segmentation === 'all' ? 'Todos' : (csvSummary ? csvSummary.total : 0)}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmPublish}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Confirmar actualización
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}