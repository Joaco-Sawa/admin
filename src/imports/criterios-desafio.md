Criterios de Aceptación

Debe existir un botón fijo en esquina superior derecha del listado “+ Crear Desafío”.

Al hacer click se muestra un Pop Up Modal de creación de desafío.

El Modal de creación tendrá 4 nodos (pasos) de configuración, y siempre inicia en el Nodo 1.

Nodo 1 – Definición General del Desafío

Campos obligatorios:

Nombre del desafío (texto libre / máximo 50 caracteres)

Fecha de Inicio (selector formato dd-mm-yyyy + hora en formato 24 hrs, por defecto siempre estarán las 00:00 hrs dando inicio al día programado)

Fecha de Término  (selector formato dd-mm-yyyy + hora en formato 24 hrs, por defecto siempre estarán las 00:00 hrs dando inicio al día programado)

Campos opcionales:

Descripción breve del desafío (texto libre / máximo 150 caracteres)

Checkbox “Habilitar recurrencia automática” (por defecto desactivado), a su vez, al momento de configurar las fechas de inicio y termino, esta opción estará bloqueada, solo se podrá desbloquear para uso cuando el usuario selecciones en las fechas un rango: semanal (7 días), quincenal (2 semanas o 14 días), o mensual (del 01 al último día del mismo mes).

Si se habilita, el selector le mostrará una recomendación de programación al usuario, por ejemplo:
Fecha de inicio: 01-11-2025 00:00 hrs
Fecha de termino: 30-11-2025 00:00 hrs
Checkbox de recurrencia: se desbloquea e indica recurrencia de programación “mensual”, al momento de dar click en configurar el checkbox, saldría mensaje de: “Proximo desafío programado del 01-12-2025 00:00 hrs hasta el 31-12-2025 00:00 hrs.”

Adicionalmente, solo si se configura el checkbox, aparecerá una opción de “Programar termino de recurrencia”, si esta opción se deja en blanco, se asume es infinita hasta que el usuario decida editarla manualmente. Pero si decide colocar una fecha, esta indicará la última ejecución de desafío recurrente según fecha de termino, por ejemplo: si coloco termino de recurrencia el 15-02-2027, el última desafío recurrente será el del inicio 01-01-2027 hasta el 30-01-2025.

Sección opcional “Diseño de métrica”:

Decimales (valor entero, default 0)

Formato Unidad (texto libre / máximo 10 caracteres, ej: CLP)

Validaciones:

Decimales no puede ser negativo

Fecha término no puede ser < fecha inicio.

El usuario puede moverse libremente entre los 4 nodos de configuraciones, independiente que haya o no completado los datos obligatorios de nodos previos.

Recurrencia:

Si el desafío tiene recurrencia habilitada, al pasar a estado Finalizado, sistema debe clonar desafío automáticamente:

Nuevo código alfanumérico N+1

Nombre igual al original

Mismas configuraciones tanto obligatorias como opcionales

Nueva Fecha inicio = día siguiente del término del desafío original

En configuración “Semanal” → término se calcula sumando 7 días

En configuración “Quincenal” → término se calcula sumando 14 días

En configuración “Mensual” → término se calcula hasta el última dia del mes según fecha de inicio.

Respecto a la opción de “Programar Termino de Recurrencia”, el desafío finalizado a su vez se le deshabilita la opción de recurrencia (checkbox) de manera automática, esto indica que la recurrencia programada ya no depende de este desafío terminado, sino que como se clonaron las programaciones, la próxima recurrencia queda configurada desde el nuevo desafío clonado

Nodo 2 – Tipo de desafío

Deberá selccionar el tipo de desafío: meta, raning, PxQ, Por defecto siempre estará pre seleccionado el desafío tipo Meta, esto en caso de que el usuario se salte a otros nodos de configuración sin cambiar el tipo de desafío del nodo 2, estaría considerando todas las configuración por defecto de tipo Meta.

Nodo 3 – Configuraciones específicas desafío

*Revisar tarjeta específica por desafío



Nodo 4 – Información Desafío (aplica para todos los tipos)

Campos obligatorios:

Conoce tu desafío (texto libre / máximo 750 caracteres), para la configuración de edición, debe estar en formato de editor de texto con todas las características básicas (similar a este editor de Trello), es decir, mayusculas, negritas, cursiva, viñetas, etc.)

Campos opcionales:

Condiciones extras (texto libre / sin límite de caracteres), solo aparecerá para editar en caso de que el usuario haya previamente marcado el checkbox de configuración, para la configuración de edición, debe estar en formato de editor de texto con todas las características básicas (similar a este editor de Trello), es decir, mayusculas, negritas, cursiva, viñetas, etc.)

Configuración en formato borrador

En la esquina inferior del Pop Up Modal, estarán de manera fija de izquierda a derecha:

- Opción de ir a un nodo anterior (opción bloqueada en nodo 1)
- CTA de Guardas, esta opción permite, independiente de tener o no todos los campos obligatorios configurados, la opción de guardas las configuraciones hasta el momento, creando un nuevo código de desafío y dejando este en “Estado Borrador”
- Linea de Texto al medio que indica paso x de 4, por ejemplo, “Paso 2 de 4”
- CTA de “Habilitar”, solo cuando la persona hace click en esta opción el desafío según sus fecha de inicio o termino puede quedar en estado programado, activo o finalizado. A su vez una vez activado el habilitar, si el usuario vuelve a editar dicho desafío, ahora ese CTA pasará a ser de tipo “Pausar”, donde si el usuario hace click, este desafío vuelve a pasar a estado “Borrador”. Tanto la opción de Habilitar como Pausar, al hacer click despliega un pop up de alerta al usuario donde debe aceptar o cancelar ese cambio de configuración.

Opción de ir a un nodo siguiente (opción bloqueada en nodo 4)