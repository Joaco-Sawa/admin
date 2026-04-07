🧠 Historia de Usuario

Como administrador del programa,
quiero poder ajustar y recortar imágenes al momento de cargarlas en el administrador del catálogo,
para asegurar que las imágenes respeten las dimensiones requeridas por la interfaz del Front User y evitar recortes automáticos incorrectos.

🎯 Objetivo

Implementar un sistema de recorte manual previo a la carga de imágenes, mediante un pop-up de edición, que permita:

mover la imagen

ajustar zoom

recortar según dimensiones requeridas

antes de guardarla en la plataforma.

⚠️ Problema actual

Actualmente el sistema permite cargar imágenes con cualquier dimensión.

Comportamiento actual:

Categorías

el sistema recorta automáticamente la imagen

Banners

la imagen se carga sin ajuste

Esto genera problemas de UX en el Front User, como:

imágenes mal encuadradas

banners deformados

pérdida de elementos visuales importantes.

⚙️ Comportamiento esperado

Al cargar una imagen desde el Front Admin, el sistema debe abrir un pop-up intermedio de recorte.

Este pop-up debe permitir al administrador:

mover la imagen

aplicar zoom

ajustar la posición

visualizar el recorte final según las dimensiones requeridas.

Una vez confirmada la acción de guardar:

la imagen se recorta en el Front

se guarda directamente con el tamaño final requerido.

📌 Importante

El sistema no debe almacenar la imagen original.

Solo se debe guardar la imagen final recortada.

Si el administrador desea modificar la imagen posteriormente:

deberá cargar nuevamente la imagen original

repetir el proceso de recorte.

🖥️ Comportamiento del pop-up

El pop-up de recorte debe adaptarse dinámicamente según el tipo de objeto que se esté cargando.

Cada objeto tendrá dimensiones específicas de recorte.

📐 Dimensiones requeridas

Menú Catálogo → Categorías

Imagen Categoría (Circular)

La imagen debe recortarse en formato circular.

Dimensiones base del recorte:

1:1

El sistema debe mostrar el preview circular durante el recorte.

Imagen Categoría Mobile

Dimensiones requeridas:

350 x 124 px

Imagen Categoría Desktop

Dimensiones requeridas:

1200 x 288 px

🏷️ Menú Catálogo → Comunicaciones (Banners)

Imagen Banner

Dimensiones requeridas:

1200 x 400 px

⚙️ Lógica de funcionamiento

Administrador selecciona archivo de imagen.

Se abre pop-up de recorte.

El sistema aplica máscara de dimensión según el componente.

Administrador ajusta posición y zoom.

Administrador guarda.

El sistema exporta la imagen ya recortada.

La imagen se guarda en la plataforma.

🔒 Validaciones

El sistema debe asegurar que:

el recorte final respete exactamente las dimensiones requeridas

no se guarde imagen sin pasar por el recorte

el preview coincida con la visualización del Front User.

💡 Valor de Producto

Este modelo permite:

consistencia visual en el catálogo

mejor experiencia de usuario

evitar recortes automáticos incorrectos

estandarizar el manejo de imágenes en el Front Admin.

Además deja preparada la plataforma para aplicar el mismo patrón en:

imágenes de productos

imágenes de programas

imágenes de perfil

contenidos del muro o comunicaciones.