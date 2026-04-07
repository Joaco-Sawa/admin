2. Submenú Categorías

2.1 Estandarización de CTAs y componentes

Se deben alinear los componentes a los estándares de otros menús (Participantes / Programas):

Botón principal:

+ Agregar Categoría → botón azul

Íconos:

Ajustar iconos de editar y eliminar al estándar del sistema

Pop-up de edición:

Debe abrirse como modal centrado

No como panel lateral

2.2 Cambio de estructura de navegación

Problema actual

Existe un selector de catálogo poco consistente con el resto del sistema.

Comportamiento esperado

Al ingresar al menú Categorías:

Se debe mostrar una lista de catálogos, similar a:

Participantes

Programas

Tabla de catálogos

Debe incluir columnas:

Nombre Catálogo

Código Catálogo

Acción: ver categorías (icono específico)

2.3 Visualización expandible de categorías

Al hacer click en la acción de un catálogo:

Se despliega un bloque tipo "ver más" (expandible) debajo del catálogo

Dentro se muestran las categorías del catálogo

2.4 Ajustes dentro del bloque de categorías

Cambios de comportamiento

Se elimina el botón + Agregar Categoría dentro del bloque expandido

Se mantiene solo a nivel superior

Columna de acciones

Se deben ajustar las acciones:

Editar:

Cambiar icono al estándar del sistema (como en Participantes)

Eliminar:

Se elimina esta acción

Nuevo:

Agregar acción de Visibilidad (toggle)

2.5 Lógica de visibilidad de categorías

Comportamiento esperado

Todas las categorías por defecto están en estado visible

Al desactivar visibilidad:

La categoría:

deja de mostrarse en el Front User

pasa automáticamente al final del listado

se agrupa bajo categorías no visibles

cambia su estilo visual (más oscuro / deshabilitado)

3. Submenú Banners

3.1 Renombramientos

Comunicación Maestra → Banners Catálogo

+ Nueva Comunicación Maestra → + Nuevo Banner

3.2 Ajustes de UI

Botones principales en color azul

Ajustar título y jerarquía visual acorde a otros menús

3.3 Lógica de orden de banners

Comportamiento esperado

Los banners deben ordenarse en dos bloques:

Banners habilitados

Banners deshabilitados

Regla clave

Si un banner pasa de habilitado → deshabilitado:

pasa automáticamente al primer lugar del bloque de deshabilitados

3.4 Buscador

Problema actual

Existe un sistema de filtros por columnas innecesario.

Comportamiento esperado

Se elimina el sistema de filtros por columnas

Se incorpora un buscador simple:

ubicado sobre la tabla

similar al de Participantes

búsqueda por:

nombre del banner

