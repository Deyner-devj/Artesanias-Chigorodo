# Estado de Seguridad - Artesanías Chigorodo API

Este documento detalla la implementación de seguridad, control de acceso y mitigaciones aplicadas en la API de **Artesanías Chigorodo** para garantizar un entorno robusto frente a ataques y malas prácticas.

---

## 1. Autenticación y Autorización (RBAC)

### JWT (JSON Web Tokens)
- **Mecanismo:** Autenticación de estado nulo (stateless) mediante firma HMAC-SHA256. El token almacena claims seguros como: `userId`, `fullName` y `role`.
- **Filtro:** Interceptor HTTP (`JwtAuthenticationFilter`) que valida la firma de cada token en el encabezado `Authorization: Bearer <token>` antes de delegar la solicitud al contexto de Spring Security.
- **Configuración de Firma:** Validación estricta que exige definir la propiedad `security.jwt.secret-key` en la configuración externa antes de iniciar, arrojando advertencias en logs si se detecta una clave por defecto de desarrollo.

### Roles del Sistema (`Role`)
1. **`ADMIN`:** Acceso total a todos los endpoints del sistema.
2. **`CLIENT`:** Comprador tradicional. Puede listar catálogo, gestionar perfil (`/api/users/me`) y realizar checkout/compras (`/api/orders`). Solo puede visualizar sus propios pedidos.
3. **`VENDOR` (Artesano):** Administrador de su propio catálogo. Puede registrar y modificar productos, y solo puede visualizar o despachar las órdenes que contengan sus productos.

---

## 2. Cifrado y Almacenamiento de Credenciales

- **Algoritmo:** BCrypt para hashing de contraseñas (`BCryptPasswordEncoderPortImpl`).
- **Comportamiento:** Genera un hash unidireccional con sal aleatoria integrada (Salt), lo que protege las credenciales contra ataques de diccionario y tablas arcoíris (Rainbow Tables) incluso si la base de datos se ve comprometida.

---

## 3. Mitigación de Vulnerabilidades y Errores de Entrada

### A. Prevención de IDOR (Insecure Direct Object Reference)
- **Riesgo:** Exponer IDs numéricos incrementales de base de datos (`1`, `2`, `3`...) en URLs permite a atacantes adivinar IDs ajenos o hacer barrido de pedidos.
- **Solución:** Los endpoints de consulta y actualización de órdenes utilizan el identificador único pseudo-aleatorio `orderNumber` (ej. `/api/orders/AC-2026-894723`). Los IDs secuenciales quedan aislados para consultas internas indexadas.

### B. Control de Concurrencia (Race Conditions)
- **Riesgo:** Dos clientes comprando el mismo último producto a la vez causando stock negativo o sobre-venta.
- **Solución:** Se implementó bloqueo pesimista de escritura (`LockModeType.PESSIMISTIC_WRITE`) a nivel de base de datos en `ProductJpaRepository.findByIdForUpdate`. Esto fuerza a que el hilo que primero consulte el stock bloquee la fila hasta que termine su checkout, garantizando la consistencia del inventario.

### C. Prevención de Alteración de Inventario (Fuerza Bruta Logica)
- **Riesgo:** Enviar cantidades o precios negativos para restar saldos o inyectar stock de forma fraudulenta.
- **Solución:** Validaciones automáticas con Bean Validation (`jakarta.validation`):
  - `@Min(1)` en cantidad de productos para evitar sumas en reversa de stock.
  - `@DecimalMin("0.01")` en precios para evitar productos gratis o con saldo a favor.
  - `@Min(0)` en stock de productos.

### D. Aislamiento Multi-Vendedor (Data Leakage)
- **Riesgo:** Que un vendedor visualice datos personales de clientes o productos de otros artesanos.
- **Solución:** Los métodos de consulta filtran de forma dinámica en la capa de negocio los ítems y órdenes de compra, eliminando cualquier rastro de información correspondiente a otros artesanos.

### E. Seguridad en Facturación Electrónica
- **Riesgo:** Acceso no autorizado a las facturas electrónicas de compra de otros clientes.
- **Solución:** El endpoint GET `/api/orders/{orderNumber}/invoice` realiza el mismo análisis de propiedad que la orden misma. El sistema bloquea el acceso si el usuario autenticado no coincide con el dueño de la orden, o si es un artesano ajeno a la transacción.
