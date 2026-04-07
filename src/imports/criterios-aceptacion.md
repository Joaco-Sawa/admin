Criterios de Aceptación
Este nodo del Pop Up Modal solo se habilita cuando el tipo de desafío seleccionado en el Nodo 2 es “Meta”.

No existen campos obligatorios en este nodo.

Deben mostrarse dos checkbox de configuración opcional:

Aplicar sobrecumplimiento

Aplicar subcumplimiento

Si se selecciona “Aplicar sobrecumplimiento”:

Se despliegan dos campos de configuración:

% Meta: número entero, no negativo, sin decimales, mayor a 100.

% Puntos: número entero, no negativo, sin decimales, mayor a 100.

Ejemplo de configuración:

%Meta = 150

%Puntos = 200

Si la meta base del usuario es 10 pólizas con ganancia de 20 puntos → la escala de sobrecumplimiento premiará al usuario que logre 15 pólizas con 40 puntos.

Siempre aproximar o redondear superior.

Si se selecciona “Aplicar subcumplimiento”:

Se despliegan dos campos de configuración:

% Meta: número entero, no negativo, sin decimales, mayor a 0 y menor a 100.

% Puntos: número entero, no negativo, sin decimales, mayor a 0 y menor a 100.

Ejemplo:

%Meta = 80

%Puntos = 50

Si la meta base es 10 pólizas con ganancia de 20 puntos → el usuario que logra 8 pólizas recibe 10 puntos.

El sistema debe permitir configurar hasta 3 escalas de premios por usuario:

Subcumplimiento, Cumplimiento base, Sobrecumplimiento.

Las metas y puntos base de cada usuario se cargan posteriormente vía archivo CSV, no en esta pantalla.

Los valores configurados en este nodo se aplican como modificadores porcentuales sobre la meta y los puntos base definidos por usuario en el CSV.