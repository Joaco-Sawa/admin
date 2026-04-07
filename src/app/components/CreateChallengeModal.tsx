import { X, Target, Trophy, XCircle, Bold, Italic, Underline, List, ListOrdered, Table as TableIcon, Link as LinkIcon, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../context/ToastContext';

interface CreateChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ChallengeData) => void;
}

interface RankingTier {
  id: string;
  fromPosition: string;
  toPosition: string;
  points: string;
}

interface ChallengeData {
  name: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  recurrence: boolean;
  type: 'meta' | 'ranking' | 'pxq' | null;
  decimals: string;
  unitFormat: string;
  logo: File | null;
  overPerformance: boolean;
  overPerformanceMeta: string;
  overPerformancePoints: string;
  underPerformance: boolean;
  underPerformanceMeta: string;
  underPerformancePoints: string;
  // Ranking specific
  minFloor: string;
  rankingOrder: string;
  rankingTiers: RankingTier[];
  // PxQ specific
  pxqMinFloor: string;
  pxqMaxFloor: string;
  pxqP: string;
  pxqQ: string;
  rules: string;
  extraConditions: boolean;
  extraConditionsText: string;
}

export function CreateChallengeModal({ isOpen, onClose, onSave }: CreateChallengeModalProps) {
  const { showSuccess } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ChallengeData>({
    name: '',
    description: '',
    startDate: '',
    startTime: '00:00',
    endDate: '',
    endTime: '00:00',
    recurrence: false,
    type: 'meta', // Por defecto siempre Meta
    decimals: '0',
    unitFormat: '',
    logo: null,
    overPerformance: false,
    overPerformanceMeta: '',
    overPerformancePoints: '',
    underPerformance: false,
    underPerformanceMeta: '',
    underPerformancePoints: '',
    // Ranking specific
    minFloor: '',
    rankingOrder: '',
    rankingTiers: [],
    // PxQ specific
    pxqMinFloor: '',
    pxqMaxFloor: '',
    pxqP: '',
    pxqQ: '',
    rules: '',
    extraConditions: false,
    extraConditionsText: '',
  });

  if (!isOpen) return null;

  // Validación de campos obligatorios por paso
  const isStep1Valid = formData.name.trim() !== '' && formData.startDate !== '' && formData.endDate !== '';
  const isStep2Valid = formData.type !== null;
  const isStep3Valid = true; // Este paso no tiene campos obligatorios
  const isStep4Valid = formData.rules.trim() !== '';

  // Validación global para habilitar el botón "Habilitar"
  const isFormValid = isStep1Valid && isStep2Valid && isStep3Valid && isStep4Valid;

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
  };

  const handleSave = () => {
    console.log('Guardando borrador...', formData);
  };

  const handleEnable = () => {
    if (isFormValid) {
      onSave(formData);
      showSuccess('Cambios guardados con éxito');
      onClose();
    }
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
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">Crear Nuevo Desafío</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Stepper */}
        <div className="px-8 py-6 flex items-center justify-center">
          <div className="flex items-center gap-4">
            {[1, 2, 3, 4].map((step, index) => (
              <div key={step} className="flex items-center">
                <button
                  onClick={() => handleStepClick(step)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    step === currentStep
                      ? 'bg-blue-600 text-white shadow-lg'
                      : step < currentStep
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step}
                </button>
                {index < 3 && (
                  <div 
                    className={`w-16 h-1 mx-1 ${
                      step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6 min-h-[400px]">
          {/* Paso 1: Datos Generales */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Datos Generales</h3>
              
              {/* Nombre del desafío */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del desafío <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 50) {
                      setFormData({ ...formData, name: value });
                    }
                  }}
                  placeholder="Ej: Desafío Supernova Q4"
                  maxLength={50}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">{formData.name.length}/50 caracteres</p>
              </div>

              {/* Descripción breve */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción breve
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 150) {
                      setFormData({ ...formData, description: value });
                    }
                  }}
                  placeholder="Describe el objetivo del desafío..."
                  rows={3}
                  maxLength={150}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">{formData.description.length}/150 caracteres</p>
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-2 gap-6">
                {/* Fecha y hora de inicio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha y hora de inicio <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-32 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                {/* Fecha y hora de término */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha y hora de término <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="w-32 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Recurrencia */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.recurrence}
                    onChange={(e) => setFormData({ ...formData, recurrence: e.target.checked })}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 mb-1">Habilitar recurrencia automática</div>
                    <div className="text-xs text-gray-600">
                      Debe configurar fechas con 7 días (semanal), 14 días (quincenal) ó 1 mes completo (mensual)
                    </div>
                  </div>
                </label>
              </div>

              {/* Diseño de Métrica */}
              <div className="space-y-4 pt-4">
                <h4 className="font-semibold text-gray-900">Diseño de Métrica</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Decimales
                    </label>
                    <input
                      type="number"
                      value={formData.decimals}
                      onChange={(e) => setFormData({ ...formData, decimals: e.target.value })}
                      min="0"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Formato Unidad
                    </label>
                    <input
                      type="text"
                      value={formData.unitFormat}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 10) {
                          setFormData({ ...formData, unitFormat: value });
                        }
                      }}
                      placeholder="Ej: CLP"
                      maxLength={10}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">{formData.unitFormat.length}/10 caracteres</p>
                  </div>
                </div>

                {/* Logo del desafío */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo del Desafío (Opcional)
                  </label>
                  <button className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Cargar Logo
                  </button>
                  <p className="text-xs text-gray-500 mt-2">Formatos permitidos: JPG, PNG ó PDF</p>
                </div>
              </div>
            </div>
          )}

          {/* Paso 2: Tipo de Desafío */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Tipo de Desafío</h3>
              
              {/* Opciones de tipo */}
              <div className="grid grid-cols-3 gap-4">
                {/* Meta */}
                <button
                  onClick={() => setFormData({ ...formData, type: 'meta' })}
                  className={`p-6 border-2 rounded-xl transition-all hover:shadow-lg ${
                    formData.type === 'meta'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                      <Target className="w-8 h-8 text-red-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">Meta</div>
                      <div className="text-xs text-gray-600">Progreso lineal hacia un objetivo específico</div>
                    </div>
                  </div>
                </button>

                {/* Ranking */}
                <button
                  onClick={() => setFormData({ ...formData, type: 'ranking' })}
                  className={`p-6 border-2 rounded-xl transition-all hover:shadow-lg ${
                    formData.type === 'ranking'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Trophy className="w-8 h-8 text-yellow-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">Ranking</div>
                      <div className="text-xs text-gray-600">Competencia por posición en tabla de líderes</div>
                    </div>
                  </div>
                </button>

                {/* PxQ */}
                <button
                  onClick={() => setFormData({ ...formData, type: 'pxq' })}
                  className={`p-6 border-2 rounded-xl transition-all hover:shadow-lg ${
                    formData.type === 'pxq'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <XCircle className="w-8 h-8 text-gray-700" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">PxQ</div>
                      <div className="text-xs text-gray-600">Recompensa directa por productividad</div>
                    </div>
                  </div>
                </button>
              </div>

              {/* Mensaje informativo */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  Los participantes tendrán una meta individual y ganarán puntos según su nivel de cumplimiento.
                </p>
              </div>
            </div>
          )}

          {/* Paso 3: Configuración según tipo */}
          {currentStep === 3 && formData.type === 'meta' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Configuración de Meta</h3>
              
              {/* Sobrecumplimiento */}
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.overPerformance}
                    onChange={(e) => setFormData({ ...formData, overPerformance: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="font-medium text-gray-900">Aplicar Sobrecumplimiento</span>
                </label>

                {formData.overPerformance && (
                  <div className="ml-7 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">% Meta</label>
                      <input
                        type="number"
                        value={formData.overPerformanceMeta}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Validar: entero, no negativo, sin decimales, mayor a 100
                          if (value === '' || (parseInt(value) > 100 && Number.isInteger(parseFloat(value)))) {
                            setFormData({ ...formData, overPerformanceMeta: value });
                          }
                        }}
                        placeholder="150"
                        min="101"
                        step="1"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">Debe ser mayor a 100</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">% Puntos</label>
                      <input
                        type="number"
                        value={formData.overPerformancePoints}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Validar: entero, no negativo, sin decimales, mayor a 100
                          if (value === '' || (parseInt(value) > 100 && Number.isInteger(parseFloat(value)))) {
                            setFormData({ ...formData, overPerformancePoints: value });
                          }
                        }}
                        placeholder="200"
                        min="101"
                        step="1"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">Debe ser mayor a 100</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Subcumplimiento */}
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.underPerformance}
                    onChange={(e) => setFormData({ ...formData, underPerformance: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="font-medium text-gray-900">Aplicar Subcumplimiento</span>
                </label>

                {formData.underPerformance && (
                  <div className="ml-7 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">% Meta</label>
                      <input
                        type="number"
                        value={formData.underPerformanceMeta}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Validar: entero, no negativo, sin decimales, mayor a 0 y menor a 100
                          if (value === '' || (parseInt(value) > 0 && parseInt(value) < 100 && Number.isInteger(parseFloat(value)))) {
                            setFormData({ ...formData, underPerformanceMeta: value });
                          }
                        }}
                        placeholder="80"
                        min="1"
                        max="99"
                        step="1"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">Debe ser entre 1 y 99</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">% Puntos</label>
                      <input
                        type="number"
                        value={formData.underPerformancePoints}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Validar: entero, no negativo, sin decimales, mayor a 0 y menor a 100
                          if (value === '' || (parseInt(value) > 0 && parseInt(value) < 100 && Number.isInteger(parseFloat(value)))) {
                            setFormData({ ...formData, underPerformancePoints: value });
                          }
                        }}
                        placeholder="50"
                        min="1"
                        max="99"
                        step="1"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">Debe ser entre 1 y 99</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Mensaje informativo */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  La configuración prioriza la carga de Sobrecumplimiento y/o Subcumplimiento desde la carga manual de "metas y avance". En caso de dejar las opciones habilitadas, estas calcular(án) automáticamente las escalas de desafíos y puntos desde la meta original del usuario si estas se dejan en blanco en el archivo manual.
                </p>
              </div>
            </div>
          )}

          {/* Paso 3: Configuración de Ranking */}
          {currentStep === 3 && formData.type === 'ranking' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Configuración de Ranking</h3>
              
              {/* Piso mínimo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Piso mínimo <span className="text-gray-500">(opcional)</span>
                </label>
                <input
                  type="number"
                  value={formData.minFloor}
                  onChange={(e) => setFormData({ ...formData, minFloor: e.target.value })}
                  placeholder="Ej: 1000"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Valor mínimo requerido para participar en el ranking</p>
              </div>

              {/* Orden de ranking */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Orden de ranking
                </label>
                <select
                  value={formData.rankingOrder}
                  onChange={(e) => setFormData({ ...formData, rankingOrder: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">Mayor a menor (descendente)</option>
                  <option value="asc">Menor a mayor (ascendente)</option>
                </select>
              </div>

              {/* Tramos de ganadores */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Tramos de ganadores <span className="text-red-500">*</span>
                  </label>
                  <button
                    onClick={() => {
                      const newTier: RankingTier = {
                        id: `tier-${Date.now()}`,
                        fromPosition: '',
                        toPosition: '',
                        points: ''
                      };
                      setFormData({ ...formData, rankingTiers: [...formData.rankingTiers, newTier] });
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    + Agregar tramo
                  </button>
                </div>

                {/* Lista de tramos */}
                <div className="space-y-4">
                  {formData.rankingTiers.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm border-2 border-dashed border-gray-200 rounded-lg">
                      No hay tramos configurados. Haz clic en "+ Agregar tramo" para comenzar.
                    </div>
                  ) : (
                    formData.rankingTiers.map((tier, index) => (
                      <div key={tier.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-gray-900">Tramo {index + 1}</span>
                          <button
                            onClick={() => {
                              const newTiers = formData.rankingTiers.filter(t => t.id !== tier.id);
                              setFormData({ ...formData, rankingTiers: newTiers });
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs text-gray-700 mb-1">Desde posición</label>
                            <input
                              type="number"
                              value={tier.fromPosition}
                              onChange={(e) => {
                                const newTiers = formData.rankingTiers.map(t => 
                                  t.id === tier.id ? { ...t, fromPosition: e.target.value } : t
                                );
                                setFormData({ ...formData, rankingTiers: newTiers });
                              }}
                              placeholder="1"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-700 mb-1">Hasta posición</label>
                            <input
                              type="number"
                              value={tier.toPosition}
                              onChange={(e) => {
                                const newTiers = formData.rankingTiers.map(t => 
                                  t.id === tier.id ? { ...t, toPosition: e.target.value } : t
                                );
                                setFormData({ ...formData, rankingTiers: newTiers });
                              }}
                              placeholder="1"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-700 mb-1">Puntos</label>
                            <input
                              type="number"
                              value={tier.points}
                              onChange={(e) => {
                                const newTiers = formData.rankingTiers.map(t => 
                                  t.id === tier.id ? { ...t, points: e.target.value } : t
                                );
                                setFormData({ ...formData, rankingTiers: newTiers });
                              }}
                              placeholder="100"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Paso 3: Configuración de PxQ */}
          {currentStep === 3 && formData.type === 'pxq' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Configuración PxQ</h3>
              
              {/* Piso mínimo para ganar puntos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Piso mínimo para ganar puntos <span className="text-gray-500">(opcional)</span>
                </label>
                <input
                  type="number"
                  value={formData.pxqMinFloor}
                  onChange={(e) => setFormData({ ...formData, pxqMinFloor: e.target.value })}
                  placeholder="Ej: 10"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Valor mínimo de unidades requerido para comenzar a ganar puntos</p>
              </div>

              {/* Piso máximo para ganar puntos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Piso máximo para ganar puntos <span className="text-gray-500">(opcional)</span>
                </label>
                <input
                  type="number"
                  value={formData.pxqMaxFloor}
                  onChange={(e) => setFormData({ ...formData, pxqMaxFloor: e.target.value })}
                  placeholder="Ej: 100"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Valor máximo de unidades que generan puntos</p>
              </div>

              {/* Definir PxQ */}
              <div className="space-y-4 pt-2">
                <h4 className="text-sm font-semibold text-gray-900">
                  Definir PxQ <span className="text-red-500">*</span>
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* P: Unidades de Métrica */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      P: Unidades de Métrica <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.pxqP}
                      onChange={(e) => setFormData({ ...formData, pxqP: e.target.value })}
                      placeholder="Ej: 2"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">Cantidad de unidades de métrica</p>
                  </div>

                  {/* Q: Equivalencia en puntos */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Q: Equivalencia en puntos <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.pxqQ}
                      onChange={(e) => setFormData({ ...formData, pxqQ: e.target.value })}
                      placeholder="Ej: 10"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">Puntos otorgados por cada P unidades</p>
                  </div>
                </div>

                {/* Ejemplo informativo */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    Ejemplo: Si P=2 y Q=10, por cada 2 unidades de métrica el usuario ganará 10 puntos.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Paso 3: Si no hay tipo seleccionado */}
          {currentStep === 3 && !formData.type && (
            <div className="space-y-6">
              <div className="text-center py-12">
                <p className="text-gray-500">Por favor, selecciona un tipo de desafío en el paso 2</p>
              </div>
            </div>
          )}

          {/* Paso 4: Información del Desafío */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Información del Desafío</h3>
              
              {/* Conoce tu desafío */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conoce tu desafío <span className="text-red-500">*</span>
                </label>
                
                {/* Toolbar */}
                <div className="border border-gray-300 rounded-t-lg px-3 py-2 bg-gray-50 flex items-center gap-2">
                  <button className="p-1.5 hover:bg-gray-200 rounded transition-colors" title="Negrita">
                    <Bold className="w-4 h-4 text-gray-700" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-200 rounded transition-colors" title="Cursiva">
                    <Italic className="w-4 h-4 text-gray-700" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-200 rounded transition-colors" title="Subrayado">
                    <Underline className="w-4 h-4 text-gray-700" />
                  </button>
                  <div className="w-px h-6 bg-gray-300 mx-1"></div>
                  <button className="p-1.5 hover:bg-gray-200 rounded transition-colors" title="Lista">
                    <List className="w-4 h-4 text-gray-700" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-200 rounded transition-colors" title="Lista numerada">
                    <ListOrdered className="w-4 h-4 text-gray-700" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-200 rounded transition-colors" title="Tabla">
                    <TableIcon className="w-4 h-4 text-gray-700" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-200 rounded transition-colors" title="Enlace">
                    <LinkIcon className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
                
                {/* Textarea */}
                <textarea
                  value={formData.rules}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 750) {
                      setFormData({ ...formData, rules: value });
                    }
                  }}
                  placeholder="Ingresa las reglas de tu desafío, Ej.: Deberás lograr tu meta de venta de X productos."
                  rows={5}
                  maxLength={750}
                  className="w-full px-4 py-3 border border-gray-300 border-t-0 rounded-b-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">{formData.rules.length}/750 caracteres</p>
              </div>

              {/* Condiciones extras */}
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.extraConditions}
                    onChange={(e) => setFormData({ ...formData, extraConditions: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="font-medium text-gray-900">Condiciones extras</span>
                </label>

                {formData.extraConditions && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-blue-900">
                      Cuando esté activo, se desplegará una opción de desplegar más condiciones en la visualización al final de cada desafío a los participantes.
                    </p>
                  </div>
                )}

                {formData.extraConditions && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Condiciones extras
                    </label>
                    
                    {/* Toolbar */}
                    <div className="border border-gray-300 rounded-t-lg px-3 py-2 bg-gray-50 flex items-center gap-2">
                      <button className="p-1.5 hover:bg-gray-200 rounded transition-colors" title="Negrita">
                        <Bold className="w-4 h-4 text-gray-700" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-200 rounded transition-colors" title="Cursiva">
                        <Italic className="w-4 h-4 text-gray-700" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-200 rounded transition-colors" title="Subrayado">
                        <Underline className="w-4 h-4 text-gray-700" />
                      </button>
                      <div className="w-px h-6 bg-gray-300 mx-1"></div>
                      <button className="p-1.5 hover:bg-gray-200 rounded transition-colors" title="Lista">
                        <List className="w-4 h-4 text-gray-700" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-200 rounded transition-colors" title="Lista numerada">
                        <ListOrdered className="w-4 h-4 text-gray-700" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-200 rounded transition-colors" title="Tabla">
                        <TableIcon className="w-4 h-4 text-gray-700" />
                      </button>
                    </div>
                    
                    {/* Textarea */}
                    <textarea
                      value={formData.extraConditionsText}
                      onChange={(e) => setFormData({ ...formData, extraConditionsText: e.target.value })}
                      placeholder="Ingresa las condiciones extras, Ej.: Solo son válidos los productos de esta lista de SKU:"
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 border-t-0 rounded-b-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              ← Anterior
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Guardar
            </button>
          </div>

          <div className="text-sm text-gray-500 font-medium">
            Paso {currentStep} de 4
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleEnable}
              disabled={!isFormValid}
              className={`px-5 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                isFormValid
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              ✓ Habilitar
            </button>
            <button
              onClick={handleNext}
              disabled={currentStep === 4}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentStep === 4
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {currentStep === 4 ? 'Revisar →' : 'Siguiente →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}