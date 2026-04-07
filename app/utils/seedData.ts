// Sistema de seed data con versionado para Admin SAWA
// Versión actual de los datos - incrementar cuando haya cambios en la estructura

const SEED_VERSION = '1.0.4'; // Incrementada para agregar segmentaciones a programas
const SEED_VERSION_KEY = 'sawa-seed-version';

// Datos de prueba para programas
export const seedPrograms = [
  {
    id: 'prog-001',
    code: 'VEND2024',
    name: 'Programa Vendedores 2024',
    monthlyLimit: 75000,
    status: 'Activa',
    isMigration: false,
    segmentaciones: [
      {
        id: 1,
        nombre: 'Area',
        esFija: true,
        distribuciones: [
          { valor: 'Ventas', cantidad: 45, porcentaje: 45 },
          { valor: 'Marketing', cantidad: 30, porcentaje: 30 },
          { valor: 'Operaciones', cantidad: 25, porcentaje: 25 },
        ]
      },
      {
        id: 2,
        nombre: 'Cargo',
        esFija: true,
        distribuciones: [
          { valor: 'Gerente', cantidad: 20, porcentaje: 20 },
          { valor: 'Supervisor', cantidad: 35, porcentaje: 35 },
          { valor: 'Ejecutivo', cantidad: 45, porcentaje: 45 },
        ]
      },
    ]
  },
  {
    id: 'prog-002',
    code: 'RETAIL-Q1',
    name: 'Incentivos Retail Q1',
    monthlyLimit: 50000,
    status: 'Activa',
    isMigration: false,
    segmentaciones: [
      {
        id: 1,
        nombre: 'Region',
        esFija: true,
        distribuciones: [
          { valor: 'Norte', cantidad: 30, porcentaje: 30 },
          { valor: 'Centro', cantidad: 40, porcentaje: 40 },
          { valor: 'Sur', cantidad: 30, porcentaje: 30 },
        ]
      },
    ]
  }
];

// Datos de prueba para participantes
export const seedParticipants = [
  {
    id: 'part-matias-001',
    programId: 'prog-001',
    email: 'matias.cerfogli@example.com',
    name: 'Matias Cerfogli',
    phone: '+56912345678',
    birthDate: '10-05-1988',
    onboard: true,
    lastAccess: '2025-03-01T10:30:00.000Z',
    pointsBalance: 1500,
    enabled: true,
    isSupervisor: false,
    supervisorId: null,
    segmentaciones: {
      Area: 'Ventas',
      Cargo: 'Gerente'
    },
    createdAt: '2025-01-15T08:00:00.000Z'
  },
  {
    id: 'part-seba-001',
    programId: 'prog-001',
    email: 'seba.pino@example.com',
    name: 'Seba Pino',
    phone: '+56998707173',
    birthDate: '15-11-1995',
    onboard: true,
    lastAccess: '2025-03-02T14:20:00.000Z',
    pointsBalance: 2300,
    enabled: true,
    isSupervisor: false,
    supervisorId: 'part-matias-001',
    segmentaciones: {
      Area: 'Marketing',
      Cargo: 'Ejecutivo'
    },
    createdAt: '2025-01-20T09:15:00.000Z'
  },
  {
    id: 'part-ana-001',
    programId: 'prog-001',
    email: 'ana.martinez@example.com',
    name: 'Ana Martínez',
    phone: '+56987654321',
    birthDate: '22-08-1992',
    onboard: true,
    lastAccess: '2025-03-03T09:45:00.000Z',
    pointsBalance: 1800,
    enabled: true,
    isSupervisor: false,
    supervisorId: 'part-matias-001',
    segmentaciones: {
      Area: 'Operaciones',
      Cargo: 'Supervisor'
    },
    createdAt: '2025-01-18T10:30:00.000Z'
  },
  {
    id: 'part-carlos-001',
    programId: 'prog-001',
    email: 'carlos.lopez@example.com',
    name: 'Carlos López',
    phone: '+56976543210',
    birthDate: '03-12-1990',
    onboard: false,
    lastAccess: null,
    pointsBalance: 500,
    enabled: true,
    isSupervisor: false,
    supervisorId: null,
    segmentaciones: {
      Area: null,
      Cargo: null
    },
    createdAt: '2025-02-01T11:00:00.000Z'
  }
];

// Datos de prueba para desafíos
export const seedChallenges = [
  {
    id: 'challenge-001',
    programId: 'prog-001',
    code: 'VEND-MAR',
    name: 'Ventas de Marzo',
    category: 'Ventas',
    type: 'Individual',
    startDate: '2025-03-01',
    endDate: '2025-03-31',
    participants: 45,
    status: 'Activo' as const,
    winnersPercentage: 20,
    pointsDelivered: 15000,
    createdAt: '2025-02-25T10:00:00.000Z'
  },
  {
    id: 'challenge-002',
    programId: 'prog-001',
    code: 'CAP-DIGI',
    name: 'Capacitación Digital',
    category: 'Capacitación',
    type: 'Grupal',
    startDate: '2025-03-01',
    endDate: '2025-03-15',
    participants: 38,
    status: 'Programado' as const,
    winnersPercentage: 100,
    pointsDelivered: 0,
    createdAt: '2025-02-20T14:00:00.000Z'
  }
];

// Datos de prueba para noticias
export const seedNews = [
  {
    id: 'news-001',
    programId: 'prog-001',
    title: '¡Bienvenidos al Programa 2024!',
    content: 'Estamos emocionados de comenzar este nuevo año con ustedes. Este programa trae nuevos desafíos y mejores premios.',
    author: 'Admin SAWA',
    publishDate: '2025-01-15T09:00:00.000Z',
    status: 'published' as const,
    category: 'announcement' as const,
    imageUrl: null,
    createdAt: '2025-01-15T08:00:00.000Z'
  },
  {
    id: 'news-002',
    programId: 'prog-001',
    title: 'Nuevos Premios Disponibles',
    content: 'Revisa el catálogo actualizado con increíbles premios que puedes canjear con tus puntos.',
    author: 'Admin SAWA',
    publishDate: '2025-02-01T10:00:00.000Z',
    status: 'published' as const,
    category: 'news' as const,
    imageUrl: null,
    createdAt: '2025-01-30T15:00:00.000Z'
  }
];

// Datos de prueba para reconocimientos
export const seedRecognitions = [
  {
    id: 'recog-001',
    programId: 'prog-001',
    fromUserId: 'part-matias-001',
    fromUserName: 'Matias Cerfogli',
    toUserId: 'part-seba-001',
    toUserName: 'Seba Pino',
    message: '¡Excelente trabajo en el proyecto de ventas digitales! Tu dedicación es inspiradora.',
    points: 50,
    category: 'teamwork' as const,
    isPublic: true,
    createdAt: '2025-02-15T14:30:00.000Z'
  },
  {
    id: 'recog-002',
    programId: 'prog-001',
    fromUserId: 'part-seba-001',
    fromUserName: 'Seba Pino',
    toUserId: 'part-ana-001',
    toUserName: 'Ana Martínez',
    message: 'Gracias por tu apoyo en la capacitación del equipo nuevo. ¡Eres increíble!',
    points: 30,
    category: 'support' as const,
    isPublic: true,
    createdAt: '2025-02-20T11:15:00.000Z'
  }
];

// Función para verificar si necesitamos reinicializar los datos
export function needsSeeding(): boolean {
  const currentVersion = localStorage.getItem(SEED_VERSION_KEY);
  return currentVersion !== SEED_VERSION;
}

// Función para inicializar todos los datos de prueba
export function seedDatabase() {
  console.log('🌱 Inicializando datos de prueba para Admin SAWA...');
  console.log('📍 Dominio actual:', window.location.hostname);
  
  // Guardar programas (usando la misma key que ProgramsContext)
  localStorage.setItem('sawa_programs', JSON.stringify(seedPrograms));
  console.log(`✅ ${seedPrograms.length} programas creados:`, seedPrograms.map(p => p.name));
  
  // Guardar participantes (usando la misma key que ProgramsContext)
  localStorage.setItem('sawa_participants', JSON.stringify(seedParticipants));
  console.log(`✅ ${seedParticipants.length} participantes creados:`, seedParticipants.map(p => p.name));
  
  // Guardar desafíos (usando la misma key que ProgramsContext)
  localStorage.setItem('sawa_challenges', JSON.stringify(seedChallenges));
  console.log(`✅ ${seedChallenges.length} desafíos creados:`, seedChallenges.map(c => c.name));
  
  // Guardar noticias
  localStorage.setItem('sawa_news', JSON.stringify(seedNews));
  console.log(`✅ ${seedNews.length} noticias creadas`);
  
  // Guardar reconocimientos
  localStorage.setItem('sawa_recognitions', JSON.stringify(seedRecognitions));
  console.log(`✅ ${seedRecognitions.length} reconocimientos creados`);
  
  // Marcar versión actual
  localStorage.setItem(SEED_VERSION_KEY, SEED_VERSION);
  console.log(`✅ Base de datos inicializada en versión ${SEED_VERSION}`);
  
  // Verificación final
  console.log('🔍 Verificando datos guardados:');
  console.log('- Programas en localStorage:', localStorage.getItem('sawa_programs') ? 'SI' : 'NO');
  console.log('- Participantes en localStorage:', localStorage.getItem('sawa_participants') ? 'SI' : 'NO');
  console.log('- Desafíos en localStorage:', localStorage.getItem('sawa_challenges') ? 'SI' : 'NO');
}

// Función para actualizar versión sin perder datos del usuario
export function migrateData() {
  console.log('🔄 Migrando datos a nueva versión...');
  
  try {
    // Aquí puedes agregar lógica de migración específica si es necesario
    // Por ahora, solo actualizamos participantes existentes con nuevos campos
    
    const participantsStr = localStorage.getItem('sawa_participants');
    if (participantsStr) {
      const participants = JSON.parse(participantsStr);
      const updated = participants.map((p: any) => ({
        ...p,
        phone: p.phone ?? null,
        birthDate: p.birthDate ?? null,
        isSupervisor: p.isSupervisor ?? false,
        supervisorId: p.supervisorId ?? null
      }));
      localStorage.setItem('sawa_participants', JSON.stringify(updated));
      console.log('✅ Participantes migrados');
    }
    
    // Actualizar versión
    localStorage.setItem(SEED_VERSION_KEY, SEED_VERSION);
    console.log(`✅ Migración completada a versión ${SEED_VERSION}`);
  } catch (error) {
    console.error('❌ Error en migración:', error);
    // Si falla la migración, hacer seed completo
    seedDatabase();
  }
}

// Función principal para inicializar datos
export function initializeData(force: boolean = false) {
  console.log('🚀 Admin SAWA - Inicializando aplicación...');
  console.log('📍 Dominio:', window.location.hostname);
  
  if (force) {
    console.log('🔄 Forzando reinicialización de datos...');
    seedDatabase();
    return;
  }
  
  // Verificar si hay datos existentes (usando la key correcta con underscore)
  const hasPrograms = localStorage.getItem('sawa_programs');
  const currentVersion = localStorage.getItem(SEED_VERSION_KEY);
  
  console.log('📊 Estado actual:');
  console.log('- Versión requerida:', SEED_VERSION);
  console.log('- Versión actual:', currentVersion || 'ninguna');
  console.log('- Programas existentes:', hasPrograms ? 'SI' : 'NO');
  
  if (!hasPrograms || needsSeeding()) {
    if (hasPrograms && needsSeeding()) {
      // Hay datos pero versión antigua - reinicializar completamente
      console.log('⚠️ Versión antigua detectada - reinicializando datos...');
      seedDatabase();
    } else {
      // No hay datos - inicializar desde cero
      console.log('📦 No hay datos - inicializando por primera vez...');
      seedDatabase();
    }
  } else {
    console.log('✅ Datos ya inicializados correctamente');
    console.log('📊 Resumen de datos:');
    const programs = JSON.parse(localStorage.getItem('sawa_programs') || '[]');
    const participants = JSON.parse(localStorage.getItem('sawa_participants') || '[]');
    const challenges = JSON.parse(localStorage.getItem('sawa_challenges') || '[]');
    console.log(`- ${programs.length} programas`);
    console.log(`- ${participants.length} participantes`);
    console.log(`- ${challenges.length} desafíos`);
  }
}

// Función para resetear datos desde la consola del navegador
export function resetDatabase() {
  console.log('🔄 Reseteando base de datos...');
  localStorage.clear();
  seedDatabase();
  console.log('✅ Base de datos reseteada. Por favor recarga la página.');
  window.location.reload();
}

// Función para verificar la salud de los datos
export function checkDataHealth() {
  console.log('🏥 Verificando salud de la base de datos...');
  
  const programs = JSON.parse(localStorage.getItem('sawa_programs') || '[]');
  const participants = JSON.parse(localStorage.getItem('sawa_participants') || '[]');
  const challenges = JSON.parse(localStorage.getItem('sawa_challenges') || '[]');
  const news = JSON.parse(localStorage.getItem('sawa_news') || '[]');
  const recognitions = JSON.parse(localStorage.getItem('sawa_recognitions') || '[]');
  const version = localStorage.getItem(SEED_VERSION_KEY);
  
  const health = {
    version: {
      current: version,
      required: SEED_VERSION,
      ok: version === SEED_VERSION
    },
    programs: {
      count: programs.length,
      expected: seedPrograms.length,
      ok: programs.length >= seedPrograms.length
    },
    participants: {
      count: participants.length,
      expected: seedParticipants.length,
      ok: participants.length >= seedParticipants.length
    },
    challenges: {
      count: challenges.length,
      expected: seedChallenges.length,
      ok: challenges.length >= seedChallenges.length
    },
    news: {
      count: news.length,
      expected: seedNews.length,
      ok: news.length >= seedNews.length
    },
    recognitions: {
      count: recognitions.length,
      expected: seedRecognitions.length,
      ok: recognitions.length >= seedRecognitions.length
    }
  };
  
  const allOk = Object.values(health).every(h => h.ok);
  
  console.log('📊 Estado de salud:');
  console.log('Versión:', health.version.ok ? '✅' : '❌', `${health.version.current} (requerida: ${health.version.required})`);
  console.log('Programas:', health.programs.ok ? '✅' : '❌', `${health.programs.count}/${health.programs.expected}`);
  console.log('Participantes:', health.participants.ok ? '✅' : '❌', `${health.participants.count}/${health.participants.expected}`);
  console.log('Desafíos:', health.challenges.ok ? '✅' : '❌', `${health.challenges.count}/${health.challenges.expected}`);
  console.log('Noticias:', health.news.ok ? '✅' : '❌', `${health.news.count}/${health.news.expected}`);
  console.log('Reconocimientos:', health.recognitions.ok ? '✅' : '❌', `${health.recognitions.count}/${health.recognitions.expected}`);
  
  if (!allOk) {
    console.warn('⚠️ Algunos datos están incompletos. Usa SAWA_DEV.resetDatabase() para reinicializar.');
  } else {
    console.log('✅ Todos los datos están en buen estado');
  }
  
  return health;
}

// Exponer funciones globalmente para desarrollo
if (typeof window !== 'undefined') {
  (window as any).SAWA_DEV = {
    resetDatabase,
    initializeData: () => initializeData(true),
    checkHealth: checkDataHealth,
    version: SEED_VERSION,
    viewData: () => {
      console.log('📊 Datos actuales en localStorage:');
      console.log('Programas:', JSON.parse(localStorage.getItem('sawa_programs') || '[]'));
      console.log('Participantes:', JSON.parse(localStorage.getItem('sawa_participants') || '[]'));
      console.log('Desafíos:', JSON.parse(localStorage.getItem('sawa_challenges') || '[]'));
      console.log('Noticias:', JSON.parse(localStorage.getItem('sawa_news') || '[]'));
      console.log('Reconocimientos:', JSON.parse(localStorage.getItem('sawa_recognitions') || '[]'));
    }
  };
  console.log('🛠️ Herramientas de desarrollo disponibles:');
  console.log('- SAWA_DEV.resetDatabase() - Resetear todos los datos');
  console.log('- SAWA_DEV.initializeData() - Forzar reinicialización');
  console.log('- SAWA_DEV.checkHealth() - Verificar salud de los datos');
  console.log('- SAWA_DEV.viewData() - Ver datos actuales');
  console.log('- SAWA_DEV.version - Ver versión actual');
}