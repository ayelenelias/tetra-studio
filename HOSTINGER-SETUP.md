# Despliegue de Tetra Studio en Hostinger

## Requisitos mínimos del plan

- Sitio personalizado PHP/HTML.
- PHP 8.2 o superior (recomendado: PHP 8.3).
- MySQL con PDO y `pdo_mysql`.
- `.htaccess` / reglas Apache o LiteSpeed.
- Sesiones PHP, cURL u conexiones HTTPS salientes.
- Solicitudes JSON de hasta 10 MB (`post_max_size` recomendado: 16 MB o más).
- Git desde GitHub o acceso al administrador de archivos.
- SSL para forzar HTTPS.

No se necesita VPS, Node.js, PostgreSQL ni acceso root para la versión PHP.

## 1. Crear el sitio

En hPanel, agregar un sitio de tipo **Custom PHP/HTML** y asociar el dominio o un dominio temporal. No usar WordPress ni Website Builder.

Seleccionar PHP 8.3 y activar/forzar HTTPS.

## 2. Conectar GitHub

En **Websites → Dashboard → Advanced → Git**:

- Repositorio: `ayelenelias/tetra-studio`
- Rama: `main`
- Directorio: `public_html`
- Auto-deployment: activado

## 3. Crear MySQL

En **Databases → Management**, crear una base y guardar de forma privada:

- Host MySQL
- Puerto
- Nombre completo de la base
- Usuario completo
- Contraseña

Entrar a phpMyAdmin, seleccionar esa base e importar `database.sql`.

## 4. Crear la configuración privada

Desde el administrador de archivos, crear esta estructura:

```text
dominio/
├── private/
│   └── tetra-config.php
└── public_html/
    ├── index.html
    ├── api.php
    └── ...
```

Copiar el contenido de `config.local.php.example` a `private/tetra-config.php` y completar los valores reales. No colocar credenciales en GitHub ni enviarlas por chat.

En producción deben quedar así:

```php
'db_required' => true,
'db_auto_create' => false,
'db_persistent' => true,
'write_file_backup' => false,
```

## 5. Configurar el correo

En Resend, verificar el dominio y crear una API key. Configurar:

- `contact_to`: `tetra.studio26@gmail.com`
- `contact_from`: una dirección del dominio verificado, por ejemplo `Tetra Studio <contacto@dominio.com>`

## 6. Verificaciones

Abrir `https://DOMINIO/api.php?action=health`. Debe responder con estado HTTP 200 y:

```json
{
  "ok": true,
  "database": true,
  "admin": true,
  "email": true,
  "php": "8.x.x"
}
```

Luego verificar:

1. La portada carga por HTTPS.
2. El panel acepta la contraseña.
3. Un cambio guardado sigue visible después de cerrar sesión y abrir otro navegador.
4. El formulario llega a `tetra.studio26@gmail.com`.
5. `config.local.php.example`, `database.sql`, `data.json`, `server.js` y la documentación devuelven 403.

## Mensaje para soporte de Hostinger

> Hola. Quiero publicar un sitio personalizado que ya está desarrollado. Usa HTML, CSS y JavaScript en el frontend, y PHP 8.2+ con PDO MySQL, sesiones PHP, `.htaccess` y solicitudes HTTPS salientes mediante cURL en el backend. Necesito una base MySQL, SSL y poder desplegar desde un repositorio GitHub a `public_html`. El panel envía JSON y necesita aceptar solicitudes POST de hasta 10 MB (`post_max_size` de 16 MB o más). No usa WordPress y no necesita Node.js ni VPS. ¿Mi plan actual permite todo esto? ¿Incluye Git deployment desde GitHub, creación de una base y usuario MySQL, PDO/pdo_mysql, cURL, sesiones PHP, `.htaccess`, SSL, un directorio privado fuera de `public_html` y copias de seguridad? ¿Cuántas bases MySQL permite, qué versión de PHP puedo elegir, cuál es el límite de `post_max_size` y con qué frecuencia se hacen los backups? Si algo no está incluido, ¿qué función exacta falta y cuál es el plan mínimo necesario?
