# Arquitectura de datos y arranque

## Responsabilidad de cada base

| Motor | Datos |
| --- | --- |
| MySQL | Usuarios, productos, categorias, carrito, favoritos, ordenes, items, pagos, facturas y recuperacion de contrasena. Son datos transaccionales y relacionales. |
| MongoDB | `audit_events`: accesos correctos/fallidos, resultados de pagos y futuros eventos de seguridad, operacion y administracion. No se almacenan claves, JWT, CVV, tarjetas ni cuerpos HTTP. |

MongoDB es una bitacora no critica: si se detiene, el negocio sigue operando y se registra una advertencia en el log. Esto evita que una indisponibilidad de observabilidad afecte los pagos o el acceso.

## Arranque local

1. En `artesanias-chigorodo`, inicia las bases: `docker compose up -d mysql mongodb`.
2. Espera a que ambos contenedores esten listos con `docker compose ps`.
3. Inicia el backend: `mvn spring-boot:run`.
4. Comprueba `http://localhost:8080/actuator/health` y abre `http://localhost:8080/swagger-ui.html`.
5. Instala el generador: `py -m pip install -r ../scripts/requirements-demo.txt`.
6. Genera el SQL: `py ../scripts/generar_datos_demo.py` y ejecuta `../scripts/datos_demo_workbench.sql` desde MySQL Workbench.
7. Sirve la carpeta `frontend` con Live Server en el puerto 5500; abre `http://localhost:5500/frontend/home/index.html`.

Los tres usuarios demo y la clave se describen en `scripts/README.md`. Cambia `SECURITY_JWT_SECRET_KEY`, usuarios de bases de datos y `APP_CORS_ALLOWED_ORIGINS` antes de desplegar.

## Administración

El rol `ADMIN` ya puede gestionar usuarios, todo el catalogo y pedidos de cualquier vendedor; el backend aplica esas reglas, no el navegador. Tambien puede consultar los ultimos 100 eventos de MongoDB en `GET /api/admin/audit-events` con su JWT. Este endpoint sirve para alimentar una vista de auditoria del dashboard sin exponer eventos a clientes ni artesanos.

## Gráficas y PDF

Antes de conectar gráficas o PDF a datos reales, consume los endpoints del backend con JWT y no datos escritos dentro de HTML. El proyecto usa Chart.js en el panel artesanal; el panel admin necesita una fuente de datos y una librería PDF elegida (por ejemplo, jsPDF) para completar esa interfaz. No se debe afirmar que están listos sin integrar y probar esa pantalla.
