# Reporte de Auditoría: Lo que Falta, Sobra y No Debe Ir

Este documento presenta una revisión exhaustiva sobre el estado del backend de **Artesanías Chigorodo**, identificando vacíos técnicos (lo que falta), redundancias (lo que sobra) y malas prácticas o riesgos (lo que no debe ir).

---

## 1. Lo que Falta (Mejoras Técnicas e Integraciones)

- **A. Pruebas Unitarias y de Integración:**
  - Actualmente no hay cobertura de pruebas (`src/test/java` está vacío o con la plantilla por defecto).
  - **Recomendación:** Implementar pruebas de integración con `@SpringBootTest` y `Testcontainers` para validar de forma automatizada las restricciones de multi-vendedor, flujo de checkout de órdenes y las consultas a MongoDB y MySQL de forma simultánea.

- **B. Contenerización y Orquestación (Docker):**
  - Al utilizar una arquitectura híbrida (MySQL + MongoDB), levantar el proyecto localmente exige instalar y configurar ambos motores manualmente.
  - **Recomendación:** Agregar un `Dockerfile` y un `docker-compose.yml` en la raíz del proyecto para empaquetar la aplicación y levantar MySQL, MongoDB y el Backend con un solo comando (`docker compose up`).

- **C. Limitador de Peticiones (Rate Limiting):**
  - Los endpoints críticos de autenticación (`/api/auth/login`, `/api/auth/register`) y de checkout (`/api/orders`) son vulnerables a ataques de fuerza bruta o spam de peticiones.
  - **Recomendación:** Integrar una librería de Rate Limiting (como Spring Cloud Gateway RateLimiter o Bucket4j) para restringir el número máximo de peticiones por IP por minuto.

- **D. Monitoreo y Logs Estructurados:**
  - El sistema depende de logs de consola estándar. En producción, se requiere trazabilidad.
  - **Recomendación:** Configurar Logback (`logback-spring.xml`) para estructurar los logs en formato JSON y escribir a archivos rotativos de registro.

---

## 2. Lo que Sobra (Código y Dependencias Redundantes)

- **A. Dependencias Inactivas en `pom.xml`:**
  - Dependencias como `spring-boot-starter-mail` o `spring-boot-starter-actuator` están importadas pero no se están utilizando activamente en el código.
  - **Recomendación:** Remover del `pom.xml` si no se planea usarlas inmediatamente para reducir el tamaño final del archivo JAR y acelerar el arranque.

- **B. Directorios y Paquetes Vacíos:**
  - Paquetes antiguos u obsoletos que quedaron vacíos tras la reestructuración (ej. `com.artesaniaschigorodo.application.adapters.persistence.mongodb.document` en singular, o archivos residuales).
  - **Recomendación:** Depurar el sistema de archivos del proyecto para remover directorios vacíos que entorpecen la navegación.

---

## 3. Lo que NO Debe Ir (Riesgos y Malas Prácticas)

- **A. Credenciales y Claves Firmadas en Código (`application.properties`):**
  - La clave secreta de firma de JWT (`security.jwt.secret-key`) y las credenciales de la base de datos están escritas directamente en texto plano en el archivo de propiedades del repositorio de Git.
  - **Recomendación:** Quitar estas claves en duro y cargarlas mediante variables de entorno (ej. `${JWT_SECRET_KEY}` o `${DB_PASSWORD}`) para evitar la fuga de secretos si el código se sube a un repositorio público (GitHub/GitLab).

- **B. Contraseñas de Usuario sin Validación de Complejidad Completa:**
  - El sistema no debe permitir contraseñas cortas o comunes en producción.
  - **Recomendación:** Se implementó una expresión regular rígida de complejidad en `RegisterRequest`, lo cual es correcto. Se debe asegurar de no suavizar este filtro en el futuro.
