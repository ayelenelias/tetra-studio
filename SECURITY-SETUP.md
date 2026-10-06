# Configuración privada

El panel y el formulario usan secretos que deben existir solamente en el servidor.

## Hostinger / PHP

1. Crear la base y el usuario MySQL desde hPanel.
2. Crear una carpeta `private` al mismo nivel que `public_html`.
3. Copiar `config.local.php.example` como `private/tetra-config.php`.
4. Completar los datos exactos de MySQL, la contraseña del CMS y Resend.
5. Mantener `db_required` en `true` para impedir guardados temporales si falla MySQL.

El archivo privado debe quedar fuera de `public_html` y nunca debe subirse a Git.

## XAMPP / PHP

1. Copiar `config.local.php.example` como `config.local.php`.
2. Cambiar `admin_password` por una contraseña larga y única.
3. Reemplazar los datos MySQL o usar `db_required => false` durante desarrollo local.
4. Para recibir formularios por correo, completar una API key de Resend y usar una dirección `contact_from` perteneciente a un dominio verificado.

`config.local.php` está excluido de Git.

## Render / Node.js

Configurar estas variables privadas en el servicio:

- `ADMIN_PASSWORD`: contraseña larga y única del CMS.
- `ADMIN_SECRET`: cadena aleatoria larga usada para firmar la sesión.
- `RESEND_API_KEY`: API key para enviar las solicitudes.
- `CONTACT_TO`: destino de las solicitudes; por defecto `tetra.studio26@gmail.com`.
- `CONTACT_FROM`: remitente de un dominio verificado, por ejemplo `Tetra Studio <contacto@dominio.com>`.

Si `ADMIN_PASSWORD` no está configurada, el servidor rechaza el acceso al CMS. Si falta la configuración de correo, el formulario informa que se debe contactar directamente por email y no simula un envío exitoso.
