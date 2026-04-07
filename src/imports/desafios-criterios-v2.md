✅ Criterios de Aceptación

Esta versión corresponde a la 2.0 de la pantalla de inicio del módulo Desafíos. Mantiene la estructura general con los KPI superiores y la tabla de desafíos, pero incorpora buscadores, filtros avanzados y una nueva columna estadística. Todos los filtros deben aplicarse de forma inmediata sobre la tabla, sin requerir recarga de página.

En esta versión, se agregan filtros y buscadores específicos por columna para mejorar la navegación:

En la columna Código, existirá un buscador de texto libre con un máximo de 50 caracteres, que permitirá filtrar desafíos cuyo código contenga la cadena ingresada, sin distinción de mayúsculas o minúsculas.

En la columna Nombre, existirá también un buscador de texto libre con un máximo de 50 caracteres, que permitirá filtrar desafíos cuyo nombre contenga la cadena ingresada.

En la columna Tipo, existirá un filtro de tipo desplegable (dropdown) que permitirá seleccionar solo un tipo de desafío a la vez: Meta, Ranking o PxQ.

En la columna Fecha de inicio, se incorporará un filtro con selector de fecha y hora. Al seleccionar un valor, la tabla mostrará todos los desafíos cuya fecha y hora de inicio sean iguales o posteriores al filtro seleccionado.

En la columna Fecha de término, también se agregará un filtro con selector de fecha y hora, mostrando los desafíos cuya fecha y hora de término sean iguales o anteriores al filtro seleccionado.

En la columna Estado, se incluirá un desplegable con las opciones Borrador, Programado, Activo o Finalizado, permitiendo filtrar por un único estado.

Todos los filtros deben poder combinarse entre sí para permitir búsquedas más precisas, y debe existir un botón “Limpiar Filtros” que restablezca la vista original de la tabla.

Además, se agrega una nueva columna llamada “Estadística”, que muestra información alfanumérica de referencia para el administrador. Esta columna no es editable ni interactiva y contiene dos indicadores principales:

Porcentaje de ganadores: muestra el porcentaje de participantes activos en la membresía del desafío analizado que actualmente tienen puntos acumulados mayores a cero. El cálculo se realiza dividiendo la cantidad de participantes con puntos acumulados mayores a cero por la cantidad total de participantes activos del desafío, y multiplicando por 100. El resultado se muestra como número entero, sin decimales, redondeado al valor más cercano.

Puntos entregados teóricos: muestra la sumatoria total de puntos teóricos entregados hasta el momento para todos los participantes activos del desafío, considerando la lógica de cálculo según el tipo de desafío.

En los desafíos de tipo Meta, los puntos se determinan según la escala alcanzada. Si el avance es igual o superior a la meta base, se aplican los puntos definidos para esa meta. Si existen escalas de sub o sobrecumplimiento, se aplican los puntos relativos a la escala correspondiente. Por ejemplo, si un participante tiene un avance de 30, y las escalas son: subcumplimiento 20 (10 puntos), meta 50 (30 puntos), y sobrecumplimiento 100 (50 puntos), entonces el participante gana 10 puntos teóricos.

En los desafíos de tipo Ranking, los puntos corresponden directamente a los puntos asignados según la posición del ranking del usuario, siempre y cuando cumpla con el requisito de piso mínimo configurado.

En los desafíos de tipo PxQ, los puntos se calculan dividiendo el valor del avance entre P (unidades de métrica) y multiplicando el resultado por Q (equivalencia en puntos). El resultado se trunca hacia abajo, sin redondear. Por ejemplo, si P = 2, Q = 10 y el avance es 7, el cálculo sería (7 / 2 = 3.5 → 3) × 10 = 30 puntos. También se aplican las restricciones de piso mínimo y máximo para determinar si el usuario puede recibir puntos.