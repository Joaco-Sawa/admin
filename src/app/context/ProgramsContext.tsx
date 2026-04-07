import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Context for managing programs, challenges, participants and communications
export interface Program {
  id: string;
  code: string;
  name: string;
  monthlyLimit: number;
  status: string;
  isMigration: boolean;
  subdomain?: string;
  logo?: string;
  catalogCode?: string;
  costCenter?: string;
  segmentaciones?: Array<{
    id: number;
    nombre: string;
    esFija: boolean;
    distribuciones: Array<{
      valor: string;
      cantidad: number;
      porcentaje: number;
    }>;
  }>;
}

export interface Challenge {
  id: string;
  programId: string;
  code: string;
  name: string;
  category: string;
  type: string;
  startDate: string;
  endDate: string;
  participants: number;
  status: 'Borrador' | 'Programado' | 'Activo' | 'Finalizado';
  winnersPercentage: number;
  pointsDelivered: number;
  createdAt: string;
}

export interface Participant {
  id: string;
  programId: string;
  email: string;
  name: string;
  phone: string | null;
  birthDate: string | null;
  onboard: boolean;
  lastAccess: string | null;
  pointsBalance: number;
  enabled: boolean;
  isSupervisor: boolean;
  supervisorId: string | null;
  segmentaciones?: { [key: string]: string | null }; // { "Area": "Ventas", "Cargo": "Gerente" }
  createdAt: string;
}

export interface Comunicacion {
  id: string;
  programId: string;
  titulo: string;
  contenido: string;
  tipo: 'Local' | 'Transversal';
  estado: 'Borrador' | 'Programada' | 'Publicada' | 'Despublicada';
  fechaPublicacion: string;
  fechaCreacion: string;
  cuerpo?: string; // Contenido del editor rico
  imagen?: {
    url: string;
    formato?: 'banner' | 'square';
    crop?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  };
  cta?: {
    texto: string;
    enlace: string;
  };
  segmentacion?: {
    tipo: 'all' | 'csv';
    usuarios?: string[];
  };
  fechaDespublicacion?: string;
  despublicacionAuto?: boolean;
  transversalId?: string; // ID de la comunicación transversal original (si aplica)
}

// Comunicación Transversal (solo existe en el Superadmin)
export interface ComunicacionTransversal {
  id: string;
  titulo: string;
  contenido: string; // 'Noticia' o 'Pop-up'
  estado: 'Borrador' | 'Programada' | 'Publicada' | 'Despublicada';
  fechaPublicacion: string;
  fechaCreacion: string;
  cuerpo?: string;
  imagen?: {
    url: string;
    formato?: 'banner' | 'square';
    crop?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  };
  cta?: {
    texto: string;
    enlace: string;
  };
  fechaDespublicacion?: string;
  despublicacionAuto?: boolean;
  // Segmentación multiprograma
  segmentacionGlobal: {
    tipo: 'all' | 'csvGlobal' | 'manual';
    csvGlobal?: File | { name: string; total: number }; // Si es CSV global
    programasSeleccionados?: {
      programId: string;
      segmentacion: {
        tipo: 'all' | 'csv';
        usuarios?: string[];
        csvFile?: { name: string; total: number };
      };
    }[];
  };
}

export interface Banner {
  id: string;
  nombre: string;
  catalogos: string[];
  url: string;
  imagen?: string;
  inicio: string;
  deshabilitar: string;
  estado: 'Habilitado' | 'Deshabilitado';
  habilitado: boolean;
  createdAt: string;
}

interface ProgramsContextType {
  programs: Program[];
  challenges: Challenge[];
  participants: Participant[];
  comunicaciones: Comunicacion[];
  comunicacionesTransversales: ComunicacionTransversal[];
  banners: Banner[];
  addProgram: (program: Program) => void;
  updateProgram: (id: string, program: Partial<Program>) => void;
  deleteProgram: (id: string) => void;
  getProgram: (id: string) => Program | undefined;
  addChallenge: (challenge: Challenge) => void;
  updateChallenge: (id: string, challenge: Partial<Challenge>) => void;
  deleteChallenge: (id: string) => void;
  getChallengesByProgram: (programId: string) => Challenge[];
  addParticipant: (participant: Participant) => void;
  updateParticipant: (id: string, participant: Partial<Participant>) => void;
  deleteParticipant: (id: string) => void;
  getParticipantsByProgram: (programId: string) => Participant[];
  getAllParticipants: () => Participant[];
  addComunicacion: (comunicacion: Comunicacion) => void;
  updateComunicacion: (id: string, comunicacion: Partial<Comunicacion>) => void;
  deleteComunicacion: (id: string) => void;
  getComunicacionesByProgram: (programId: string) => Comunicacion[];
  getComunicacion: (id: string) => Comunicacion | undefined;
  cloneComunicacion: (id: string, programId: string) => string | null;
  addComunicacionTransversal: (comunicacion: ComunicacionTransversal) => void;
  updateComunicacionTransversal: (id: string, comunicacion: Partial<ComunicacionTransversal>) => void;
  deleteComunicacionTransversal: (id: string) => void;
  getComunicacionTransversal: (id: string) => ComunicacionTransversal | undefined;
  cloneComunicacionTransversal: (id: string) => string | null;
  addBanner: (banner: Banner) => void;
  updateBanner: (id: string, banner: Partial<Banner>) => void;
  deleteBanner: (id: string) => void;
  getBanner: (id: string) => Banner | undefined;
  cloneBanner: (id: string) => string | null;
}

const ProgramsContext = createContext<ProgramsContextType | undefined>(undefined);

export function ProgramsProvider({ children }: { children: ReactNode }) {
  console.log('🔧 ProgramsProvider: Inicializando...');
  
  const [programs, setPrograms] = useState<Program[]>(() => {
    // Cargar datos desde localStorage al iniciar
    const saved = localStorage.getItem('sawa_programs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        console.log('✅ ProgramsProvider: Programas cargados', parsed.length);
        return parsed;
      } catch (e) {
        console.error('❌ Error parsing programs:', e);
        return [];
      }
    }
    console.log('⚠️ ProgramsProvider: No hay programas en localStorage');
    return [];
  });

  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    // Cargar datos desde localStorage al iniciar
    const saved = localStorage.getItem('sawa_challenges');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing challenges:', e);
        return [];
      }
    }
    return [];
  });

  const [participants, setParticipants] = useState<Participant[]>(() => {
    // Cargar datos desde localStorage al iniciar
    const saved = localStorage.getItem('sawa_participants');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing participants:', e);
        return [];
      }
    }
    return [];
  });

  const [comunicaciones, setComunicaciones] = useState<Comunicacion[]>(() => {
    // Cargar datos desde localStorage al iniciar
    const saved = localStorage.getItem('sawa_comunicaciones');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing comunicaciones:', e);
        return [];
      }
    }
    return [];
  });

  const [comunicacionesTransversales, setComunicacionesTransversales] = useState<ComunicacionTransversal[]>(() => {
    // Cargar datos desde localStorage al iniciar
    const saved = localStorage.getItem('sawa_comunicaciones_transversales');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing comunicaciones transversales:', e);
        return [];
      }
    }
    return [];
  });

  const [banners, setBanners] = useState<Banner[]>(() => {
    // Cargar datos desde localStorage al iniciar
    const saved = localStorage.getItem('sawa_banners');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing banners:', e);
        return [];
      }
    }
    return [];
  });

  // Guardar en localStorage cada vez que cambian los programas
  useEffect(() => {
    try {
      localStorage.setItem('sawa_programs', JSON.stringify(programs));
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.warn('LocalStorage quota exceeded for programs.');
        // Intentar guardar solo los últimos 20 programas
        try {
          localStorage.setItem('sawa_programs', JSON.stringify(programs.slice(-20)));
        } catch (e) {
          console.error('Failed to save programs.');
        }
      }
    }
  }, [programs]);

  // Guardar en localStorage cada vez que cambian los desafíos
  useEffect(() => {
    try {
      localStorage.setItem('sawa_challenges', JSON.stringify(challenges));
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.warn('LocalStorage quota exceeded for challenges.');
        // Intentar guardar solo los últimos 50 desafíos
        try {
          localStorage.setItem('sawa_challenges', JSON.stringify(challenges.slice(-50)));
        } catch (e) {
          console.error('Failed to save challenges.');
        }
      }
    }
  }, [challenges]);

  // Guardar en localStorage cada vez que cambian los participantes
  useEffect(() => {
    try {
      localStorage.setItem('sawa_participants', JSON.stringify(participants));
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.warn('LocalStorage quota exceeded for participants.');
        // Intentar guardar solo los últimos 100 participantes
        try {
          localStorage.setItem('sawa_participants', JSON.stringify(participants.slice(-100)));
        } catch (e) {
          console.error('Failed to save participants.');
        }
      }
    }
  }, [participants]);

  // Guardar en localStorage cada vez que cambian las comunicaciones
  useEffect(() => {
    try {
      // Crear una copia de las comunicaciones sin imágenes grandes para evitar exceder la cuota
      const comunicacionesParaGuardar = comunicaciones.map(com => {
        // Si tiene imagen, verificar su tamaño
        if (com.imagen?.url && com.imagen.url.startsWith('data:')) {
          // Calcular tamaño aproximado en caracteres (cada carácter base64  1 byte)
          const imageSize = com.imagen.url.length;
          // Si la imagen es mayor a 100KB en base64, no la guardamos en localStorage
          if (imageSize > 100000) {
            return {
              ...com,
              imagen: undefined // Eliminamos la imagen grande
            };
          }
        }
        return com;
      });
      
      localStorage.setItem('sawa_comunicaciones', JSON.stringify(comunicacionesParaGuardar));
    } catch (error) {
      // Si aún así excedemos la cuota, limpiamos las comunicaciones antiguas
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.warn('LocalStorage quota exceeded. Clearing old communications...');
        // Guardar solo las últimas 10 comunicaciones
        const comunicacionesRecientes = comunicaciones.slice(-10).map(com => ({
          ...com,
          imagen: undefined // Sin imágenes para reducir espacio
        }));
        try {
          localStorage.setItem('sawa_comunicaciones', JSON.stringify(comunicacionesRecientes));
        } catch (e) {
          // Si aún falla, limpiar completamente
          console.error('Failed to save even reduced communications. Clearing all.');
          localStorage.removeItem('sawa_comunicaciones');
        }
      }
    }
  }, [comunicaciones]);

  // Guardar en localStorage cada vez que cambian las comunicaciones transversales
  useEffect(() => {
    try {
      // Crear una copia de las comunicaciones sin imágenes grandes para evitar exceder la cuota
      const comunicacionesParaGuardar = comunicacionesTransversales.map(com => {
        // Si tiene imagen, verificar su tamaño
        if (com.imagen?.url && com.imagen.url.startsWith('data:')) {
          // Calcular tamaño aproximado en caracteres (cada carácter base64  1 byte)
          const imageSize = com.imagen.url.length;
          // Si la imagen es mayor a 100KB en base64, no la guardamos en localStorage
          if (imageSize > 100000) {
            return {
              ...com,
              imagen: undefined // Eliminamos la imagen grande
            };
          }
        }
        return com;
      });
      
      localStorage.setItem('sawa_comunicaciones_transversales', JSON.stringify(comunicacionesParaGuardar));
    } catch (error) {
      // Si aún así excedemos la cuota, limpiamos las comunicaciones antiguas
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.warn('LocalStorage quota exceeded. Clearing old communications...');
        // Guardar solo las últimas 10 comunicaciones
        const comunicacionesRecientes = comunicacionesTransversales.slice(-10).map(com => ({
          ...com,
          imagen: undefined // Sin imágenes para reducir espacio
        }));
        try {
          localStorage.setItem('sawa_comunicaciones_transversales', JSON.stringify(comunicacionesRecientes));
        } catch (e) {
          // Si aún falla, limpiar completamente
          console.error('Failed to save even reduced communications. Clearing all.');
          localStorage.removeItem('sawa_comunicaciones_transversales');
        }
      }
    }
  }, [comunicacionesTransversales]);

  // Guardar en localStorage cada vez que cambian los banners
  useEffect(() => {
    try {
      localStorage.setItem('sawa_banners', JSON.stringify(banners));
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.warn('LocalStorage quota exceeded for banners.');
        // Intentar guardar solo los últimos 20 banners
        try {
          localStorage.setItem('sawa_banners', JSON.stringify(banners.slice(-20)));
        } catch (e) {
          console.error('Failed to save banners.');
        }
      }
    }
  }, [banners]);

  const addProgram = (program: Program) => {
    setPrograms(prev => [...prev, program]);
  };

  const updateProgram = (id: string, updatedProgram: Partial<Program>) => {
    setPrograms(prev => 
      prev.map(p => p.id === id ? { ...p, ...updatedProgram } : p)
    );
  };

  const deleteProgram = (id: string) => {
    setPrograms(prev => prev.filter(p => p.id !== id));
  };

  const getProgram = (id: string) => {
    return programs.find(p => p.id === id);
  };

  const addChallenge = (challenge: Challenge) => {
    setChallenges(prev => [...prev, challenge]);
  };

  const updateChallenge = (id: string, updatedChallenge: Partial<Challenge>) => {
    setChallenges(prev => 
      prev.map(c => c.id === id ? { ...c, ...updatedChallenge } : c)
    );
  };

  const deleteChallenge = (id: string) => {
    setChallenges(prev => prev.filter(c => c.id !== id));
  };

  const getChallengesByProgram = (programId: string) => {
    return challenges.filter(c => c.programId === programId);
  };

  const addParticipant = (participant: Participant) => {
    setParticipants(prev => [...prev, participant]);
  };

  const updateParticipant = (id: string, updatedParticipant: Partial<Participant>) => {
    setParticipants(prev => 
      prev.map(p => p.id === id ? { ...p, ...updatedParticipant } : p)
    );
  };

  const deleteParticipant = (id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  };

  const getParticipantsByProgram = (programId: string) => {
    return participants.filter(p => p.programId === programId);
  };

  const getAllParticipants = () => {
    return participants;
  };

  const addComunicacion = (comunicacion: Comunicacion) => {
    setComunicaciones(prev => [...prev, comunicacion]);
  };

  const updateComunicacion = (id: string, updatedComunicacion: Partial<Comunicacion>) => {
    setComunicaciones(prev => 
      prev.map(c => c.id === id ? { ...c, ...updatedComunicacion } : c)
    );
  };

  const deleteComunicacion = (id: string) => {
    setComunicaciones(prev => prev.filter(c => c.id !== id));
  };

  const getComunicacionesByProgram = (programId: string) => {
    return comunicaciones.filter(c => c.programId === programId);
  };

  const getComunicacion = (id: string) => {
    return comunicaciones.find(c => c.id === id);
  };

  const cloneComunicacion = (id: string, programId: string) => {
    const comunicacion = comunicaciones.find(c => c.id === id);
    if (!comunicacion) return null;
    
    // Aplicar prefijo "(Copia) " al título
    let nuevoTitulo = `(Copia) ${comunicacion.titulo}`;
    // Si excede 70 caracteres, cortar el final
    if (nuevoTitulo.length > 70) {
      nuevoTitulo = nuevoTitulo.substring(0, 70);
    }
    
    // Generar ID único con timestamp más un número aleatorio para evitar duplicados
    const newId = `COM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newComunicacion: Comunicacion = {
      ...comunicacion,
      id: newId,
      programId: programId,
      titulo: nuevoTitulo,
      tipo: 'Local', // Siempre se convierte a Local
      estado: 'Borrador', // Siempre en Borrador
      fechaPublicacion: '', // Limpiar fechas
      fechaDespublicacion: undefined, // Limpiar fecha de despublicación
      despublicacionAuto: false,
      fechaCreacion: new Date().toISOString().split('T')[0],
    };
    
    setComunicaciones(prev => [...prev, newComunicacion]);
    return newId;
  };

  const addComunicacionTransversal = (comunicacion: ComunicacionTransversal) => {
    setComunicacionesTransversales(prev => [...prev, comunicacion]);
  };

  const updateComunicacionTransversal = (id: string, updatedComunicacion: Partial<ComunicacionTransversal>) => {
    setComunicacionesTransversales(prev => 
      prev.map(c => c.id === id ? { ...c, ...updatedComunicacion } : c)
    );
  };

  const deleteComunicacionTransversal = (id: string) => {
    setComunicacionesTransversales(prev => prev.filter(c => c.id !== id));
  };

  const getComunicacionTransversal = (id: string) => {
    return comunicacionesTransversales.find(c => c.id === id);
  };

  const cloneComunicacionTransversal = (id: string) => {
    const comunicacion = comunicacionesTransversales.find(c => c.id === id);
    if (!comunicacion) return null;
    
    // Aplicar prefijo "(Copia) " al título
    let nuevoTitulo = `(Copia) ${comunicacion.titulo}`;
    // Si excede 70 caracteres, cortar el final
    if (nuevoTitulo.length > 70) {
      nuevoTitulo = nuevoTitulo.substring(0, 70);
    }
    
    // Generar ID único con timestamp más un número aleatorio para evitar duplicados
    const newId = `COM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newComunicacion: ComunicacionTransversal = {
      ...comunicacion,
      id: newId,
      titulo: nuevoTitulo,
      estado: 'Borrador', // Siempre en Borrador
      fechaPublicacion: '', // Limpiar fechas
      fechaDespublicacion: undefined, // Limpiar fecha de despublicación
      despublicacionAuto: false,
      fechaCreacion: new Date().toISOString().split('T')[0],
    };
    
    setComunicacionesTransversales(prev => [...prev, newComunicacion]);
    return newId;
  };

  const addBanner = (banner: Banner) => {
    setBanners(prev => [...prev, banner]);
  };

  const updateBanner = (id: string, updatedBanner: Partial<Banner>) => {
    setBanners(prev => 
      prev.map(b => b.id === id ? { ...b, ...updatedBanner } : b)
    );
  };

  const deleteBanner = (id: string) => {
    setBanners(prev => prev.filter(b => b.id !== id));
  };

  const getBanner = (id: string) => {
    return banners.find(b => b.id === id);
  };

  const cloneBanner = (id: string) => {
    const banner = banners.find(b => b.id === id);
    if (!banner) return null;
    
    // Aplicar prefijo "(Copia) " al nombre
    let nuevoNombre = `(Copia) ${banner.nombre}`;
    // Si excede 70 caracteres, cortar el final
    if (nuevoNombre.length > 70) {
      nuevoNombre = nuevoNombre.substring(0, 70);
    }
    
    // Generar ID único con timestamp más un número aleatorio para evitar duplicados
    const newId = `BAN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newBanner: Banner = {
      ...banner,
      id: newId,
      nombre: nuevoNombre,
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    setBanners(prev => [...prev, newBanner]);
    return newId;
  };

  return (
    <ProgramsContext.Provider value={{ programs, challenges, participants, comunicaciones, comunicacionesTransversales, banners, addProgram, updateProgram, deleteProgram, getProgram, addChallenge, updateChallenge, deleteChallenge, getChallengesByProgram, addParticipant, updateParticipant, deleteParticipant, getParticipantsByProgram, getAllParticipants, addComunicacion, updateComunicacion, deleteComunicacion, getComunicacionesByProgram, getComunicacion, cloneComunicacion, addComunicacionTransversal, updateComunicacionTransversal, deleteComunicacionTransversal, getComunicacionTransversal, cloneComunicacionTransversal, addBanner, updateBanner, deleteBanner, getBanner, cloneBanner }}>
      {children}
    </ProgramsContext.Provider>
  );
}

export function usePrograms() {
  const context = useContext(ProgramsContext);
  if (context === undefined) {
    throw new Error('usePrograms must be used within a ProgramsProvider');
  }
  return context;
}