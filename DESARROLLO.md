# Guía de Desarrollo - Admin SAWA

## Sistema de Datos de Prueba

Admin SAWA incluye un sistema robusto de datos de prueba (seed data) que persiste en localStorage y se inicializa automáticamente al cargar la aplicación.

### Características

- ✅ **Inicialización automática**: Los datos se crean automáticamente la primera vez que cargas la aplicación
- ✅ **Versionado**: Sistema de versiones que permite migraciones automáticas cuando cambias la estructura de datos
- ✅ **Persistencia**: Los datos permanecen en localStorage entre sesiones
- ✅ **Migración automática**: Al agregar nuevos campos, los datos existentes se actualizan automáticamente
- ✅ **Herramientas de desarrollo**: Funciones disponibles en la consola para resetear o ver datos

### Datos de Prueba Incluidos

#### Programas (2)
- **Programa Vendedores 2024** (ID: prog-001)
- **Incentivos Retail Q1** (ID: prog-002)

#### Participantes (4)
- **Matias Cerfogli** - Supervisor de Seba y Ana
- **Seba Pino** - Supervisado por Matias (+56998707173, 15-11-1995)
- **Ana Martínez** - Supervisada por Matias
- **Carlos López** - Sin supervisor, onboard pendiente

#### Desafíos (2)
- **Ventas de Marzo** - 500 puntos
- **Capacitación Digital** - 300 puntos

#### Noticias (2)
- **¡Bienvenidos al Programa 2024!**
- **Nuevos Premios Disponibles**

#### Reconocimientos (2)
- Matias → Seba: "Excelente trabajo en ventas digitales"
- Seba → Ana: "Gracias por tu apoyo en capacitación"

### Herramientas de Desarrollo

Abre la consola del navegador (F12) y usa estas funciones:

```javascript
// Ver todos los datos actuales
SAWA_DEV.viewData()

// Resetear toda la base de datos (elimina TODO y reinicia)
SAWA_DEV.resetDatabase()

// Forzar reinicialización (mantiene datos del usuario pero actualiza seed data)
SAWA_DEV.initializeData()

// Ver versión actual del seed data
SAWA_DEV.version
```

### Cómo Agregar Nuevos Datos de Prueba

1. Abre `/src/app/utils/seedData.ts`
2. Agrega tus datos a los arrays correspondientes (seedPrograms, seedParticipants, etc.)
3. **IMPORTANTE**: Incrementa `SEED_VERSION` (ej: de '1.0.0' a '1.1.0')
4. Recarga la aplicación - los datos se actualizarán automáticamente

Ejemplo:

```typescript
// Incrementar versión
const SEED_VERSION = '1.1.0'; // antes era '1.0.0'

// Agregar nuevo participante
export const seedParticipants = [
  // ... participantes existentes
  {
    id: 'part-nuevo-001',
    programId: 'prog-001',
    email: 'nuevo@example.com',
    name: 'Nuevo Usuario',
    phone: '+56912345678',
    birthDate: '01-01-1990',
    onboard: true,
    lastAccess: '2025-03-03T10:00:00.000Z',
    pointsBalance: 1000,
    enabled: true,
    isSupervisor: false,
    supervisorId: null,
    createdAt: '2025-01-25T10:00:00.000Z'
  }
];
```

### Cómo Agregar Nuevos Campos a la Estructura

1. Actualiza la interfaz en `/src/app/context/ProgramsContext.tsx`
2. Actualiza los datos de seed en `/src/app/utils/seedData.ts`
3. Agrega lógica de migración en la función `migrateData()` (si es necesario)
4. Incrementa `SEED_VERSION`

Ejemplo de migración:

```typescript
export function migrateData() {
  console.log('🔄 Migrando datos a nueva versión...');
  
  try {
    const participantsStr = localStorage.getItem('sawa-participants');
    if (participantsStr) {
      const participants = JSON.parse(participantsStr);
      const updated = participants.map((p: any) => ({
        ...p,
        // Agregar nuevos campos con valores por defecto
        nuevoCampo: p.nuevoCampo ?? 'valor-por-defecto'
      }));
      localStorage.setItem('sawa-participants', JSON.stringify(updated));
    }
    
    localStorage.setItem(SEED_VERSION_KEY, SEED_VERSION);
  } catch (error) {
    console.error('❌ Error en migración:', error);
    seedDatabase(); // Fallback: reiniciar todo
  }
}
```

### Flujo de Inicialización

```
┌─────────────────────┐
│  App.tsx carga      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ initializeData()    │
└──────────┬──────────┘
           │
           ├──► ¿Hay datos? NO ──► seedDatabase()
           │                        (Crear todos los datos)
           │
           └──► ¿Hay datos? SÍ
                     │
                     ├──► ¿Versión correcta? SÍ ──► ✅ Listo
                     │
                     └──► ¿Versión correcta? NO ──► migrateData()
                                                     (Actualizar estructura)
```

### Mejores Prácticas

1. **Siempre incrementa la versión** cuando cambies la estructura de datos
2. **Usa IDs consistentes** para datos de prueba (ej: 'prog-001', 'part-matias-001')
3. **Documenta las migraciones** si agregas lógica compleja
4. **Prueba con `SAWA_DEV.resetDatabase()`** después de cambios importantes
5. **No uses datos de prueba en producción** - este sistema es solo para desarrollo

### Troubleshooting

**Problema**: Los datos no se actualizan después de cambiar seedData.ts
- **Solución**: Verifica que hayas incrementado `SEED_VERSION`

**Problema**: Veo datos antiguos sin los nuevos campos
- **Solución**: Ejecuta `SAWA_DEV.resetDatabase()` en la consola

**Problema**: Los datos se pierden al recargar
- **Solución**: Verifica que localStorage esté habilitado en tu navegador

**Problema**: Error al migrar datos
- **Solución**: El sistema automáticamente hace un reset completo en caso de error

---

## Estructura de Archivos

```
/src/app/
├── utils/
│   └── seedData.ts          # Sistema de datos de prueba
├── context/
│   └── ProgramsContext.tsx  # Contexto global y definiciones de tipos
└── App.tsx                  # Inicialización de la aplicación
```

## Próximos Pasos

- [ ] Agregar más participantes de ejemplo
- [ ] Incluir datos de prueba para catálogo de premios
- [ ] Agregar datos históricos (transacciones, canjes, etc.)
- [ ] Sistema de roles y permisos en datos de prueba
