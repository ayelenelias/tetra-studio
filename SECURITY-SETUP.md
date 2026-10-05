# Configuración privada

El panel y el formulario usan secretos que deben existir solamente en el servidor.

## XAMPP / PHP

1. Copiar `config.local.php.example` como `config.local.php`.
2. Cambiar `admin_password` por una contraseña larga y única.
3. Para recibir formularios por correo, completar una API key de Resend y usar una dirección `contact_from` perteneciente a un dominio verificado.

`config.local.php` está excluido de Git.

## Render / Node.js

Configurar estas variables privadas en el servicio:

- `ADMIN_PASSWORD`: contraseña larga y única del CMS.
- `ADMIN_SECRET`: cadena aleatoria larga usada para firmar la sesión.
- `RESEND_API_KEY`: API key para enviar las solicitudes.
- `CONTACT_TO`: destino de las solicitudes; por defecto `tetra.studio26@gmail.com`.
- `CONTACT_FROM`: remitente de un dominio verificado, por ejemplo `Tetra Studio <contacto@dominio.com>`.

Si `ADMIN_PASSWORD` no está configurada, el servidor rechaza el acceso al CMS. Si falta la configuración de correo, el formulario informa que se debe contactar directamente por email y no simula un envío exitoso.
