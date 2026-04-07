import { useState, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Upload, Bold, Italic, List, AlignLeft, AlignCenter, AlignRight, Check, X, Plus, Minus, Scissors, Search, ArrowLeft } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Cropper from 'react-easy-crop';
import { useToast } from '../context/ToastContext';
import { usePrograms } from '../context/ProgramsContext';
import { SuperAdminSidebar } from '../components/SuperAdminSidebar';
import { SuperAdminHeader } from '../components/SuperAdminHeader';

export function CreateComunicacionTransversal() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tipo = searchParams.get('tipo') || 'Noticia';
  const { showSuccess, showInfo } = useToast();
  const { programs, addComunicacionTransversal, addComunicacion } = usePrograms();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [titulo, setTitulo] = useState('');
  const [showCTA, setShowCTA] = useState(false);
  const [ctaText, setCtaText] = useState('');
  const [ctaLink, setCtaLink] = useState('');
  
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [imageFormat, setImageFormat] = useState<'banner' | 'square'>('banner');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const [publishStrategy, setPublishStrategy] = useState<'now' | 'scheduled'>('now');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [autoUnpublish, setAutoUnpublish] = useState(false);
  const [unpublishDate, setUnpublishDate] = useState('');
  const [unpublishTime, setUnpublishTime] = useState('');
  
  const [segmentacionTipo, setSegmentacionTipo] = useState<'all' | 'csvGlobal' | 'manual'>('all');
  const [csvGlobal, setCsvGlobal] = useState<File | null>(null);
  const [searchProgram, setSearchProgram] = useState('');
  const [programasSeleccionados, setProgramasSeleccionados] = useState<string[]>([]);
  const [segmentacionPorPrograma, setSegmentacionPorPrograma] = useState<{
    [programId: string]: {
      tipo: 'all' | 'csv';
      csvFile?: File;
    };
  }>({});
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const csvGlobalInputRef = useRef<HTMLInputElement>(null);
  
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
        
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        
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
        
        resolve(canvas.toDataURL('image/jpeg'));
      };
    });
  }, []);

  const handleSaveCrop = async () => {
    if (uploadedImage && croppedAreaPixels) {
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
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setPreviewImage(null);
        setCroppedAreaPixels(null);
        
        if (tipo !== 'Noticia') {
          setPreviewImage(imageUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!titulo.trim()) {
      newErrors.titulo = 'El campo es obligatorio';
    }
    
    // Validar imagen obligatoria para Pop-ups
    if (tipo === 'Pop-up' && !previewImage) {
      newErrors.imagen = 'La imagen es obligatoria para Pop-ups';
    }
    
    // Solo validar cuerpo para Noticias, no para Pop-ups
    if (tipo === 'Noticia') {
      const content = editor?.getText() || '';
      if (!content.trim()) {
        newErrors.cuerpo = 'El campo es obligatorio';
      }
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

  const validateStep3 = () => {
    if (segmentacionTipo === 'csvGlobal' && !csvGlobal) {
      alert('Debes cargar un CSV global');
      return false;
    }
    if (segmentacionTipo === 'manual' && programasSeleccionados.length === 0) {
      alert('Debes seleccionar al menos un programa');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
      setErrors({});
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
      setErrors({});
    } else if (currentStep === 3 && validateStep3()) {
      setShowConfirmModal(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const saveComunicacionTransversal = (estado: 'Borrador' | 'Programada' | 'Publicada') => {
    // Crear la comunicación transversal
    const transversalId = `TRANS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const fechaPublicacion = publishStrategy === 'scheduled' 
      ? `${scheduledDate} ${scheduledTime}` 
      : new Date().toISOString();

    const comunicacionTransversal: any = {
      id: transversalId,
      titulo,
      contenido: tipo,
      estado,
      fechaPublicacion,
      fechaCreacion: new Date().toISOString().split('T')[0],
      cuerpo: editor?.getHTML() || '',
      imagen: previewImage ? {
        url: previewImage,
        formato: imageFormat
      } : undefined,
      cta: showCTA ? {
        texto: ctaText,
        enlace: ctaLink
      } : undefined,
      fechaDespublicacion: autoUnpublish ? `${unpublishDate} ${unpublishTime}` : undefined,
      despublicacionAuto: autoUnpublish,
      segmentacionGlobal: {
        tipo: segmentacionTipo,
        csvGlobal: csvGlobal ? { name: csvGlobal.name, total: 100 } : undefined,
        programasSeleccionados: segmentacionTipo === 'manual' 
          ? programasSeleccionados.map(programId => ({
              programId,
              segmentacion: segmentacionPorPrograma[programId] || { tipo: 'all' }
            }))
          : undefined
      }
    };

    // Guardar la comunicación transversal
    addComunicacionTransversal(comunicacionTransversal);

    // Determinar a qué programas se debe enviar
    let programasDestino: string[] = [];
    
    if (segmentacionTipo === 'all') {
      // Todos los programas activos
      programasDestino = programs.filter(p => p.status === 'Activa').map(p => p.id);
    } else if (segmentacionTipo === 'csvGlobal') {
      // Todos los programas activos (el CSV determina usuarios)
      programasDestino = programs.filter(p => p.status === 'Activa').map(p => p.id);
    } else if (segmentacionTipo === 'manual') {
      // Solo los programas seleccionados
      programasDestino = programasSeleccionados;
    }

    // Crear copias en cada programa seleccionado
    programasDestino.forEach(programId => {
      const comId = `COM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const comunicacion: any = {
        id: comId,
        programId,
        titulo,
        contenido: tipo,
        tipo: 'Transversal', // Marcar como transversal
        estado,
        fechaPublicacion,
        fechaCreacion: new Date().toISOString().split('T')[0],
        cuerpo: editor?.getHTML() || '',
        imagen: previewImage ? {
          url: previewImage,
          formato: imageFormat
        } : undefined,
        cta: showCTA ? {
          texto: ctaText,
          enlace: ctaLink
        } : undefined,
        fechaDespublicacion: autoUnpublish ? `${unpublishDate} ${unpublishTime}` : undefined,
        despublicacionAuto: autoUnpublish,
        transversalId, // Referencia a la comunicación transversal
        segmentacion: {
          tipo: segmentacionTipo === 'manual' && segmentacionPorPrograma[programId]
            ? segmentacionPorPrograma[programId].tipo
            : 'all'
        }
      };

      addComunicacion(comunicacion);
    });
  };

  const handleSaveDraft = () => {
    saveComunicacionTransversal('Borrador');
    showSuccess('Borrador guardado con éxito');
    navigate('/comunicaciones-transversales/muro');
  };

  const confirmPublish = () => {
    const estado = publishStrategy === 'now' ? 'Publicada' : 'Programada';
    saveComunicacionTransversal(estado);
    showSuccess(`¡${tipo} transversal ${estado.toLowerCase()}${estado === 'Publicada' ? '' : 'a'} con éxito!`);
    navigate('/comunicaciones-transversales/muro');
  };

  const getCharCount = (text: string, max: number) => {
    return `${text.length}/${max}`;
  };

  const handleCsvGlobalUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvGlobal(file);
    }
  };

  const toggleProgramSelection = (programId: string) => {
    if (programasSeleccionados.includes(programId)) {
      setProgramasSeleccionados(prev => prev.filter(id => id !== programId));
      const newSegmentacion = { ...segmentacionPorPrograma };
      delete newSegmentacion[programId];
      setSegmentacionPorPrograma(newSegmentacion);
    } else {
      setProgramasSeleccionados(prev => [...prev, programId]);
      setSegmentacionPorPrograma(prev => ({
        ...prev,
        [programId]: { tipo: 'all' }
      }));
    }
  };

  const updateProgramSegmentacion = (programId: string, tipo: 'all' | 'csv', csvFile?: File) => {
    setSegmentacionPorPrograma(prev => ({
      ...prev,
      [programId]: { tipo, csvFile }
    }));
  };

  const getEstimatedParticipants = (programId: string) => {
    return Math.floor(Math.random() * 500) + 50;
  };

  const programasActivos = programs.filter(p => p.status === 'Activa');
  const programasFiltrados = programasActivos.filter(p => 
    p.name.toLowerCase().includes(searchProgram.toLowerCase()) ||
    p.code.toLowerCase().includes(searchProgram.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      <SuperAdminSidebar activeMenu="comunicaciones-transversales" />

      <div className="flex-1 flex flex-col">
        <SuperAdminHeader />

        <main className="flex-1 overflow-y-auto">
          {/* Header con botón volver y título */}
          <div className="bg-white px-8 pt-10 pb-6 border-b border-gray-200">
            <button
              onClick={() => navigate('/comunicaciones-transversales/muro')}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a comunicaciones</span>
            </button>
            <h1 className="text-2xl font-medium">Crear {tipo} Transversal</h1>
          </div>

          {/* Stepper */}
          <div className="bg-white px-8 py-8">
            <div className="flex items-center justify-center gap-3 max-w-2xl mx-auto">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  currentStep === 1 ? 'bg-blue-600 text-white' : currentStep > 1 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {currentStep > 1 ? <Check className="w-4 h-4" /> : '1'}
                </div>
                <span className={`text-sm ${currentStep === 1 ? 'text-blue-600 font-medium' : 'text-gray-900'}`}>
                  Contenido
                </span>
              </div>
              
              <div className={`flex-1 h-px ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`} />
              
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  currentStep === 2 ? 'bg-blue-600 text-white' : currentStep > 2 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {currentStep > 2 ? <Check className="w-4 h-4" /> : '2'}
                </div>
                <span className={`text-sm ${currentStep === 2 ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
                  Publicación
                </span>
              </div>

              <div className={`flex-1 h-px ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`} />

              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  currentStep === 3 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  3
                </div>
                <span className={`text-sm ${currentStep === 3 ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
                  Segmentación
                </span>
              </div>
            </div>
          </div>

        <div className="p-8 bg-[#F5F5F5]">
          <div>
          {/* PASO 1: CONTENIDO */}
          {currentStep === 1 && (
            <div className="space-y-6">
              {tipo === 'Noticia' ? (
                /* Tarjeta: Título y Cuerpo (para Noticias) */
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
                        placeholder="Escribe el título de la comunicación"
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
                    {/* Selector de color */}
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
                              className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-400"
                              style={{ backgroundColor: '#FF6B2C' }}
                            />
                            {/* Azul corporativo */}
                            <button
                              onClick={() => {
                                editor.chain().focus().setColor('#2563EB').run();
                                setShowColorPicker(false);
                              }}
                              className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-400"
                              style={{ backgroundColor: '#2563EB' }}
                            />
                            {/* Verde */}
                            <button
                              onClick={() => {
                                editor.chain().focus().setColor('#10B981').run();
                                setShowColorPicker(false);
                              }}
                              className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-400"
                              style={{ backgroundColor: '#10B981' }}
                            />
                            {/* Amarillo */}
                            <button
                              onClick={() => {
                                editor.chain().focus().setColor('#F59E0B').run();
                                setShowColorPicker(false);
                              }}
                              className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-400"
                              style={{ backgroundColor: '#F59E0B' }}
                            />
                            {/* Rojo */}
                            <button
                              onClick={() => {
                                editor.chain().focus().setColor('#EF4444').run();
                                setShowColorPicker(false);
                              }}
                              className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-400"
                              style={{ backgroundColor: '#EF4444' }}
                            />
                            {/* Negro */}
                            <button
                              onClick={() => {
                                editor.chain().focus().setColor('#000000').run();
                                setShowColorPicker(false);
                              }}
                              className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-400"
                              style={{ backgroundColor: '#000000' }}
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
              ) : (
                /* Tarjeta: Título (para Pop-ups) */
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
                    placeholder="Escribe el título de la comunicación"
                  />
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">{getCharCount(titulo, 70)}</span>
                    {errors.titulo && (
                      <span className="text-xs text-red-500">{errors.titulo}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Tarjeta: Imagen */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="mb-3">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">
                    Imagen {tipo === 'Pop-up' && <span className="text-red-500">*</span>}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {tipo === 'Noticia' 
                      ? 'Agrega una imagen para que tu noticia sea más atractiva' 
                      : 'Sube una imagen para tu pop-up (obligatorio)'}
                  </p>
                </div>
                {errors.imagen && (
                  <p className="text-xs text-red-500 mb-2">{errors.imagen}</p>
                )}
                
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
                    {tipo === 'Noticia' ? (
                      <>
                        {/* Canvas con altura fija para Noticias */}
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
                              setPreviewImage(null);
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
                      </>
                    ) : (
                      <>
                        {/* Vista simple para Pop-ups */}
                        <div className="relative">
                          <img
                            src={previewImage || uploadedImage}
                            alt="Vista previa"
                            className="w-full rounded-lg max-h-96 object-contain bg-gray-100"
                          />
                          <button
                            onClick={() => {
                              setUploadedImage(null);
                              setPreviewImage(null);
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </>
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
                        onChange={(e) => {
                          setCtaLink(e.target.value);
                          if (errors.ctaLink) {
                            setErrors({ ...errors, ctaLink: '' });
                          }
                        }}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                          errors.ctaLink ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="https://ejemplo.com"
                      />
                      {errors.ctaLink && (
                        <span className="text-xs text-red-500 mt-1 block">{errors.ctaLink}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PASO 2: PUBLICACIÓN */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Estrategia de publicación - Contenedor Maestro Unificado */}
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
            </div>
          )}

          {/* PASO 3: SEGMENTACIÓN MULTIPROGRAMA */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Alcance de la comunicación
                </h3>
                
                <div className="space-y-4">
                  <label className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    segmentacionTipo === 'all' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      checked={segmentacionTipo === 'all'}
                      onChange={() => setSegmentacionTipo('all')}
                      className="mt-1 w-4 h-4"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Todos los programas activos</div>
                      <div className="text-sm text-gray-600 mt-1">
                        La comunicación se enviará a todos los programas activos en el sistema ({programasActivos.length} programas)
                      </div>
                    </div>
                  </label>

                  <label className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    segmentacionTipo === 'csvGlobal' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      checked={segmentacionTipo === 'csvGlobal'}
                      onChange={() => setSegmentacionTipo('csvGlobal')}
                      className="mt-1 w-4 h-4"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Carga CSV Global</div>
                      <div className="text-sm text-gray-600 mt-1 mb-3">
                        Un solo archivo CSV que se validará contra todos los programas
                      </div>
                      {segmentacionTipo === 'csvGlobal' && (
                        <div className="mt-3">
                          <input
                            ref={csvGlobalInputRef}
                            type="file"
                            accept=".csv"
                            onChange={handleCsvGlobalUpload}
                            className="hidden"
                            id="csv-global-upload"
                          />
                          <label
                            htmlFor="csv-global-upload"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer text-sm"
                          >
                            <Upload className="w-4 h-4" />
                            {csvGlobal ? csvGlobal.name : 'Seleccionar CSV'}
                          </label>
                        </div>
                      )}
                    </div>
                  </label>

                  <label className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    segmentacionTipo === 'manual' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      checked={segmentacionTipo === 'manual'}
                      onChange={() => setSegmentacionTipo('manual')}
                      className="mt-1 w-4 h-4"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Selección manual de programas</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Elige programas específicos y personaliza la audiencia de cada uno
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {segmentacionTipo === 'manual' && (
                <>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                      Seleccionar programas destino
                    </h3>
                    
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={searchProgram}
                        onChange={(e) => setSearchProgram(e.target.value)}
                        placeholder="Buscar programa por nombre o código..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="border border-gray-300 rounded-lg max-h-64 overflow-y-auto">
                      {programasFiltrados.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          No se encontraron programas
                        </div>
                      ) : (
                        programasFiltrados.map(programa => (
                          <label
                            key={programa.id}
                            className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-200 last:border-b-0"
                          >
                            <input
                              type="checkbox"
                              checked={programasSeleccionados.includes(programa.id)}
                              onChange={() => toggleProgramSelection(programa.id)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{programa.name}</div>
                              <div className="text-xs text-gray-500">Código: {programa.code}</div>
                            </div>
                          </label>
                        ))
                      )}
                    </div>

                    {programasSeleccionados.length > 0 && (
                      <div className="mt-3 text-sm text-gray-600">
                        {programasSeleccionados.length} programa(s) seleccionado(s)
                      </div>
                    )}
                  </div>

                  {programasSeleccionados.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Configuración de audiencia por programa
                      </h3>
                      <p className="text-sm text-gray-600 mb-6">
                        Define la audiencia para cada programa seleccionado
                      </p>

                      <div className="space-y-4">
                        {programasSeleccionados.map(programId => {
                          const programa = programs.find(p => p.id === programId);
                          if (!programa) return null;

                          return (
                            <div key={programId} className="border border-gray-300 rounded-lg p-4">
                              <div className="font-medium text-gray-900 mb-3">{programa.name}</div>
                              
                              <div className="space-y-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`segmentacion-${programId}`}
                                    checked={segmentacionPorPrograma[programId]?.tipo === 'all'}
                                    onChange={() => updateProgramSegmentacion(programId, 'all')}
                                    className="w-4 h-4"
                                  />
                                  <span className="text-sm text-gray-700">Todos los participantes del programa</span>
                                </label>

                                <label className="flex items-start gap-2 cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`segmentacion-${programId}`}
                                    checked={segmentacionPorPrograma[programId]?.tipo === 'csv'}
                                    onChange={() => updateProgramSegmentacion(programId, 'csv')}
                                    className="mt-1 w-4 h-4"
                                  />
                                  <div className="flex-1">
                                    <span className="text-sm text-gray-700">Carga CSV individual</span>
                                    {segmentacionPorPrograma[programId]?.tipo === 'csv' && (
                                      <div className="mt-2">
                                        <input
                                          type="file"
                                          accept=".csv"
                                          onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                              updateProgramSegmentacion(programId, 'csv', file);
                                            }
                                          }}
                                          className="text-sm text-gray-600"
                                          id={`csv-${programId}`}
                                        />
                                        {segmentacionPorPrograma[programId]?.csvFile && (
                                          <div className="text-xs text-green-600 mt-1">
                                            ✓ {segmentacionPorPrograma[programId].csvFile?.name}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </label>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Botones de navegación */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (currentStep > 1) {
                    handleBack();
                  } else {
                    navigate('/comunicaciones-transversales/muro');
                  }
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Anterior
              </button>

              {currentStep < 3 && (
                <button
                  onClick={handleSaveDraft}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Guardar Borrador
                </button>
              )}
            </div>

            <button
              onClick={handleNext}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {currentStep === 3 ? 'Confirmar Publicación' : 'Siguiente'}
            </button>
          </div>
        </div>
        </div>
      </main>
      </div>

      {/* Modal de edición de imagen (solo para noticias) */}
      {showCropModal && tipo === 'Noticia' && uploadedImage && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Editar imagen</h3>
                <button
                  onClick={() => setShowCropModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => setImageFormat('banner')}
                  className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
                    imageFormat === 'banner' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300'
                  }`}
                >
                  Banner (16:9)
                </button>
                <button
                  onClick={() => setImageFormat('square')}
                  className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
                    imageFormat === 'square' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300'
                  }`}
                >
                  Cuadrado (1:1)
                </button>
              </div>

              <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden mb-4">
                <Cropper
                  image={uploadedImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={imageFormat === 'banner' ? 16 / 9 : 1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>

              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => setZoom(Math.max(1, zoom - 0.1))}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1"
                />
                <button
                  onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCropModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveCrop}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación final */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Confirmar Publicación</h3>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-600">Título:</span>
                    <span className="ml-2 font-medium">{titulo}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Tipo:</span>
                    <span className="ml-2 font-medium">{tipo}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Fecha de publicación:</span>
                    <span className="ml-2 font-medium">
                      {publishStrategy === 'now' ? 'Inmediata' : `${scheduledDate} ${scheduledTime}`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Impacto estimado</h4>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Programa</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-600">Participantes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {segmentacionTipo === 'all' ? (
                        programasActivos.map(prog => (
                          <tr key={prog.id}>
                            <td className="px-4 py-2 text-sm text-gray-900">{prog.name}</td>
                            <td className="px-4 py-2 text-sm text-gray-900 text-right">{getEstimatedParticipants(prog.id)}</td>
                          </tr>
                        ))
                      ) : segmentacionTipo === 'manual' ? (
                        programasSeleccionados.map(progId => {
                          const prog = programs.find(p => p.id === progId);
                          return prog ? (
                            <tr key={progId}>
                              <td className="px-4 py-2 text-sm text-gray-900">{prog.name}</td>
                              <td className="px-4 py-2 text-sm text-gray-900 text-right">{getEstimatedParticipants(progId)}</td>
                            </tr>
                          ) : null;
                        })
                      ) : (
                        <tr>
                          <td colSpan={2} className="px-4 py-2 text-sm text-gray-500 text-center">
                            CSV Global - Validación pendiente
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmPublish}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Confirmar y Publicar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
