import { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Upload, Bold, Italic, List, AlignLeft, AlignCenter, AlignRight, Check, X, AlertCircle, Download, Plus, Minus, Scissors, ChevronDown } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Cropper from 'react-easy-crop';
import { ProgramSidebar } from '../components/ProgramSidebar';
import { ProgramHeader } from '../components/ProgramHeader';
import { useToast } from '../context/ToastContext';
import { usePrograms } from '../context/ProgramsContext';

export function CreateNoticia() {
  const navigate = useNavigate();
  const { programId } = useParams();
  const { showSuccess, showInfo } = useToast();
  const { addComunicacion } = usePrograms();
  
  // Estados del formulario
  const [currentStep, setCurrentStep] = useState(1);
  const [titulo, setTitulo] = useState('');
  const [showCTA, setShowCTA] = useState(false);
  const [ctaText, setCtaText] = useState('');
  const [ctaLink, setCtaLink] = useState('');
  
  // Estados de imagen
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [imageFormat, setImageFormat] = useState<'banner' | 'square'>('banner');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  // Estados paso 2
  const [publishStrategy, setPublishStrategy] = useState<'now' | 'scheduled'>('now');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [autoUnpublish, setAutoUnpublish] = useState(false);
  const [unpublishDate, setUnpublishDate] = useState('');
  const [unpublishTime, setUnpublishTime] = useState('');
  const [segmentation, setSegmentation] = useState<'all' | 'csv'>('all');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvSummary, setCsvSummary] = useState<{ total: number; duplicates: number; notFound: number } | null>(null);
  const [csvConfirmed, setCsvConfirmed] = useState(false);
  
  // Estados de validación
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  // Estado para dropdown de color
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  // Editor de texto enriquecido
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[200px] p-4',
      },
    },
  });

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createCroppedImage = useCallback(async (imageSrc: string, pixelCrop: any) => {
    const image = new Image();
    image.src = imageSrc;
    
    return new Promise<string>((resolve) => {
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          resolve(imageSrc);
          return;
        }
        
        // Establecer dimensiones del canvas según el formato
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        
        // Dibujar la imagen recortada
        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );
        
        // Convertir canvas a data URL
        resolve(canvas.toDataURL('image/jpeg'));
      };
    });
  }, []);

  const handleSaveCrop = async () => {
    if (uploadedImage && croppedAreaPixels) {
      // Generar la imagen recortada para la vista previa
      const croppedImage = await createCroppedImage(uploadedImage, croppedAreaPixels);
      setPreviewImage(croppedImage);
      setShowCropModal(false);
      showInfo('Área guardada correctamente');
    } else {
      setShowCropModal(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result as string;
        setUploadedImage(imageUrl);
        // Resetear crop a posición predeterminada (top-center)
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        // Limpiar vista previa recortada para mostrar encuadre top-center predeterminado
        setPreviewImage(null);
        setCroppedAreaPixels(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
      setCsvConfirmed(false); // Resetear confirmación al subir nuevo archivo
      
      // Procesar CSV en tiempo real
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        const emails = lines.slice(1).map(line => line.trim()); // Omitir header
        
        // Simulación de validación: detectar duplicados e inexistentes
        const uniqueEmails = new Set(emails);
        const totalDetected = uniqueEmails.size;
        const duplicates = emails.length - totalDetected;
        const notFound = Math.floor(totalDetected * 0.08); // Simular 8% de inexistentes
        
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
    // Resetear el input file
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
    
    const content = editor?.getText() || '';
    if (!content.trim()) {
      newErrors.cuerpo = 'El campo es obligatorio';
    }
    
    if (showCTA) {
      if (!ctaText.trim()) {
        newErrors.ctaText = 'El campo es obligatorio';
      }
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
    
    if (autoUnpublish) {
      if (!unpublishDate) {
        newErrors.unpublishDate = 'El campo es obligatorio';
      }
      if (!unpublishTime) {
        newErrors.unpublishTime = 'El campo es obligatorio';
      }
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
    if (!programId) return;
    
    // Guardar borrador SIN validaciones - permite campos vacíos
    const comunicacion = {
      id: `COM-${Date.now()}`,
      programId,
      titulo: titulo || '(Sin título)',
      contenido: 'Noticia',
      cuerpo: editor?.getHTML() || '',
      tipo: 'Local' as const,
      estado: 'Borrador' as const, // Siempre fuerza estado Borrador
      fechaPublicacion: '', // Limpia fecha de publicación
      fechaCreacion: new Date().toISOString().split('T')[0],
      imagen: uploadedImage ? {
        url: uploadedImage,
        formato: imageFormat,
        crop: croppedAreaPixels
      } : undefined,
      cta: showCTA && ctaText && ctaLink ? { texto: ctaText, enlace: ctaLink } : undefined,
      segmentacion: undefined, // Limpia segmentación
      fechaDespublicacion: undefined, // Limpia fecha de despublicación
      despublicacionAuto: false,
    };
    
    addComunicacion(comunicacion);
    showSuccess('Borrador guardado con éxito');
    navigate(`/programa/${programId}/comunicaciones/muro`);
  };

  const handlePublish = () => {
    if (validateStep2()) {
      setShowConfirmModal(true);
    }
  };

  const confirmPublish = () => {
    if (!programId) return;
    
    // Determinar estado basado en estrategia de publicación
    const estado = publishStrategy === 'now' ? 'Publicada' : 'Programada';
    
    // Determinar fecha de publicación
    const fechaPublicacion = publishStrategy === 'now'
      ? new Date().toISOString().split('T')[0]
      : scheduledDate;
    
    const comunicacion = {
      id: `COM-${Date.now()}`,
      programId,
      titulo,
      contenido: 'Noticia',
      cuerpo: editor?.getHTML() || '',
      tipo: 'Local' as const,
      estado: estado as 'Borrador' | 'Programada' | 'Publicada' | 'Despublicada',
      fechaPublicacion,
      fechaCreacion: new Date().toISOString().split('T')[0],
      imagen: uploadedImage ? {
        url: uploadedImage,
        formato: imageFormat,
        crop: croppedAreaPixels
      } : undefined,
      cta: showCTA ? { texto: ctaText, enlace: ctaLink } : undefined,
      segmentacion: {
        tipo: segmentation,
        usuarios: csvSummary ? Array(csvSummary.total).fill('user@example.com') : undefined,
      },
      fechaDespublicacion: autoUnpublish ? unpublishDate : undefined,
      despublicacionAuto: autoUnpublish,
    };
    
    addComunicacion(comunicacion);
    showSuccess('¡Noticia creada con éxito!');
    navigate(`/programa/${programId}/comunicaciones/muro`);
  };

  const getCharCount = (text: string, max: number) => {
    return `${text.length}/${max}`;
  };

  const handleDownloadCSVTemplate = () => {
    // Crear un CSV de ejemplo
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
            <h1 className="text-2xl font-medium">Crear Noticia</h1>
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
              {/* Tarjeta: Título y Cuerpo */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="space-y-6">
                  {/* Título */}
                  <div>
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
                      placeholder="Escribe el título de la noticia"
                    />
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">{getCharCount(titulo, 70)}</span>
                      {errors.titulo && (
                        <span className="text-xs text-red-500">{errors.titulo}</span>
                      )}
                    </div>
                  </div>

                  {/* Cuerpo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cuerpo <span className="text-red-500">*</span>
                    </label>
                    
                    {/* Barra de herramientas del editor */}
                    {editor && (
                      <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-2 flex items-center gap-1 flex-wrap">
                        <button
                          onClick={() => editor.chain().focus().toggleBold().run()}
                          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-300' : ''}`}
                        >
                          <Bold className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => editor.chain().focus().toggleItalic().run()}
                          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-300' : ''}`}
                        >
                          <Italic className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => editor.chain().focus().toggleBulletList().run()}
                          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-300' : ''}`}
                        >
                          <List className="w-4 h-4" />
                        </button>
                        <div className="w-px h-6 bg-gray-300 mx-1" />
                        <button
                          onClick={() => editor.chain().focus().setTextAlign('left').run()}
                          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-300' : ''}`}
                        >
                          <AlignLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => editor.chain().focus().setTextAlign('center').run()}
                          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-300' : ''}`}
                        >
                          <AlignCenter className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => editor.chain().focus().setTextAlign('right').run()}
                          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-300' : ''}`}
                        >
                          <AlignRight className="w-4 h-4" />
                        </button>
                        <div className="w-px h-6 bg-gray-300 mx-1" />
                        {/* Selector de color de texto */}
                        <div className="relative">
                          <button
                            onClick={() => setShowColorPicker(!showColorPicker)}
                            className="p-2 rounded hover:bg-gray-200 flex flex-col items-center justify-center"
                          >
                            <span className="text-lg font-bold">A</span>
                            <div className="w-4 h-0.5 bg-blue-600 mt-0.5" />
                          </button>
                          {showColorPicker && (
                            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-10">
                              <div className="grid grid-cols-3 gap-2">
                                {/* Naranja corporativo */}
                                <button
                                  onClick={() => {
                                    editor.chain().focus().setColor('#FF6B2C').run();
                                    setShowColorPicker(false);
                                  }}
                                  className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-400 transition-colors"
                                  style={{ backgroundColor: '#FF6B2C' }}
                                  title="Naranja corporativo"
                                />
                                {/* Azul corporativo */}
                                <button
                                  onClick={() => {
                                    editor.chain().focus().setColor('#2563EB').run();
                                    setShowColorPicker(false);
                                  }}
                                  className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-400 transition-colors"
                                  style={{ backgroundColor: '#2563EB' }}
                                  title="Azul corporativo"
                                />
                                {/* Gris neutro */}
                                <button
                                  onClick={() => {
                                    editor.chain().focus().setColor('#6B7280').run();
                                    setShowColorPicker(false);
                                  }}
                                  className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-400 transition-colors"
                                  style={{ backgroundColor: '#6B7280' }}
                                  title="Gris neutro"
                                />
                                {/* Rojo intenso */}
                                <button
                                  onClick={() => {
                                    editor.chain().focus().setColor('#DC2626').run();
                                    setShowColorPicker(false);
                                  }}
                                  className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-400 transition-colors"
                                  style={{ backgroundColor: '#DC2626' }}
                                  title="Rojo intenso"
                                />
                                {/* Verde vibrante */}
                                <button
                                  onClick={() => {
                                    editor.chain().focus().setColor('#16A34A').run();
                                    setShowColorPicker(false);
                                  }}
                                  className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-400 transition-colors"
                                  style={{ backgroundColor: '#16A34A' }}
                                  title="Verde vibrante"
                                />
                                {/* Negro sólido */}
                                <button
                                  onClick={() => {
                                    editor.chain().focus().setColor('#000000').run();
                                    setShowColorPicker(false);
                                  }}
                                  className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-400 transition-colors"
                                  style={{ backgroundColor: '#000000' }}
                                  title="Negro sólido"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className={`border border-t-0 rounded-b-lg ${errors.cuerpo ? 'border-red-500' : 'border-gray-300'}`}>
                      <EditorContent editor={editor} />
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">{getCharCount(editor?.getText() || '', 3000)}</span>
                      {errors.cuerpo && (
                        <span className="text-xs text-red-500">{errors.cuerpo}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tarjeta: Imagen */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="mb-3">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Imagen</h3>
                  <p className="text-xs text-gray-500">Agrega una imagen para que tu noticia sea más atractiva</p>
                </div>
                
                {!uploadedImage ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
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
                ) : (
                  <div className="space-y-4">
                    {/* Imagen completa visible - Canvas con altura fija */}
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

                    {/* Botones Reemplazar y Eliminar */}
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
                          setCrop({ x: 0, y: 0 });
                          setZoom(1);
                          setCroppedAreaPixels(null);
                        }}
                        className="flex-1 text-center py-3 text-sm font-medium text-red-600 hover:bg-gray-50 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>

                    {/* Panel: Vista previa de la tarjeta */}
                    <div className="border border-gray-300 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Vista previa de la tarjeta</h4>
                      <div className="flex items-center gap-4">
                        <div 
                          className="rounded-lg overflow-hidden shadow-sm border border-gray-200 bg-gray-50"
                          style={{ 
                            width: imageFormat === 'banner' ? '161.5px' : '120px',
                            height: imageFormat === 'banner' ? '70px' : '120px'
                          }}
                        >
                          <img 
                            src={previewImage || uploadedImage} 
                            alt="Vista previa miniatura" 
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                        <div>
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Formato:</span> {imageFormat === 'banner' ? 'Banner' : 'Cuadrada'} ({imageFormat === 'banner' ? '323×140' : '323×323'})
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Barra naranja: Ajustar área seleccionada */}
                    <button
                      onClick={() => setShowCropModal(true)}
                      className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Scissors className="w-5 h-5" />
                      <span className="font-medium">Ajustar área seleccionada</span>
                    </button>

                    {/* Mensaje de confirmación verde */}
                    {croppedAreaPixels && (
                      <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-4 py-2 rounded-lg">
                        <Check className="w-4 h-4" />
                        <span>Área guardada correctamente</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Tarjeta: CTA */}
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
                  <div className="space-y-4 pl-4 border-l-2 border-gray-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Texto del botón <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={ctaText}
                        onChange={(e) => {
                          if (e.target.value.length <= 25) {
                            setCtaText(e.target.value);
                            if (errors.ctaText) {
                              setErrors({ ...errors, ctaText: '' });
                            }
                          }
                        }}
                        maxLength={25}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                          errors.ctaText ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Ej: Más información"
                      />
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500">{getCharCount(ctaText, 25)}</span>
                        {errors.ctaText && (
                          <span className="text-xs text-red-500">{errors.ctaText}</span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enlace <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="url"
                        value={ctaLink}
                        onChange={(e) => setCtaLink(e.target.value)}
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
                  </div>
                )}
              </div>

              {/* Barra de navegación inferior */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate(`/programa/${programId}/comunicaciones/muro`)}
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

                {/* Subsección de Despublicación */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Despublicación automática</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Programa una fecha para que esta comunicación se oculte automáticamente
                      </p>
                    </div>
                    <button
                      onClick={() => setAutoUnpublish(!autoUnpublish)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        autoUnpublish ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        autoUnpublish ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  
                  {autoUnpublish && (
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
                  )}
                </div>
              </div>

              {/* Segmentación */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
                          {/* Estado 1: Sin archivo o archivo sin confirmar */}
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
                              
                              {/* Resumen de validación en tiempo real */}
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
                                  
                                  {/* Botones de confirmación y eliminación */}
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
                          
                          {/* Estado 2: Archivo confirmado y guardado */}
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
                  Confirmar Publicación
                </button>
              </div>
            </div>
          )}
        </div>
        </main>

      {/* Modal de recorte de imagen */}
      {showCropModal && uploadedImage && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.08)' }}>
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Editar imagen</h3>
              <button onClick={() => setShowCropModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Botones de formato - encima del lienzo */}
            <div className="mb-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setImageFormat('banner')}
                  className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg border-2 transition-colors ${
                    imageFormat === 'banner'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400 text-gray-700'
                  }`}
                >
                  Banner (323×140 px)
                </button>
                <button
                  onClick={() => setImageFormat('square')}
                  className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg border-2 transition-colors ${
                    imageFormat === 'square'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400 text-gray-700'
                  }`}
                >
                  Cuadrada (323×323 px)
                </button>
              </div>
            </div>

            {/* Área de crop */}
            <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden mb-4">
              <Cropper
                image={uploadedImage}
                crop={crop}
                zoom={zoom}
                aspect={imageFormat === 'banner' ? 323 / 140 : 1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            {/* Zoom slider */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Zoom</label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCropModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveCrop}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Guardar selección
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.08)' }}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Confirmar Publicación</h3>
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
                <span className="text-sm font-medium text-gray-900">Noticia</span>
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
                Confirmar publicación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}