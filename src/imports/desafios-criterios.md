✅ Criterios de Aceptación
Acceso y estructura general

Debe existir un nuevo ítem de menú lateral izquierdo denominado “Desafíos” dentro del Front Admin.

Al hacer clic en este menú, se debe desplegar la vista principal del módulo Performance, que incluirá tres cajas de KPI en la parte superior y, debajo de ellas, una tabla con el listado de desafíos.

Indicadores principales (KPI)

Desafíos Activos: muestra el número total de desafíos cuyo estado actual sea Activo.

Total Participantes Activos: muestra la cantidad total de usuarios únicos que, entre todos los desafíos activos, tienen al menos uno asociado.

Desafíos Finalizados: muestra el número total de desafíos cuyo estado actual sea Finalizado.

Acción principal

Debe existir un botón de acción (CTA) visible en la parte superior derecha, con el texto “Crear Desafío”, que dirija al flujo de creación de un nuevo desafío.

Tabla de desafíos

Debajo de los KPI se muestra la tabla con todos los desafíos creados.

La tabla debe incluir las siguientes columnas:

Código: valor alfanumérico único, definido por el equipo técnico. Su principal caso de uso es la carga o actualización masiva por CSV. Puede utilizar una secuencia ascendente (ej. #0001).

Nombre: nombre descriptivo del desafío (máximo 30 caracteres).

Tipo: tipo de desafío (Meta, Ranking o PxQ).

Fecha Inicio: fecha y hora de inicio del desafío.

Fecha Término: fecha y hora de término del desafío.

Participantes: número total de participantes únicos asociados mediante carga CSV.

Estado: estado actual del desafío (Borrador, Programado, Activo o Finalizado).

Estadísticas: visualiza el porcentaje de ganadores y los puntos entregados teóricamente hasta el momento, según los cálculos definidos para cada tipo de desafío.

Acciones: menú contextual con accesos a funciones disponibles (cargar avance, editar desafío, clonar desafío, borrar desafío).

Cierre: botón o acción para ejecutar el cierre manual del desafío o marcar el estado de puntos cargados.

Reglas de visualización y comportamiento

El estado visible del desafío se determina automáticamente según las fechas configuradas (no editable manualmente desde el Front Admin).

Los desafíos nuevos no deben tener participantes asignados por defecto; la asignación se realiza exclusivamente mediante carga CSV.

El orden por defecto de la tabla debe ser:

Fecha de término más próxima (ascendente).

En segundo criterio, por código de desafío (descendente).

