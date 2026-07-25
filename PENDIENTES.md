# Pendientes de Implementación - Artesanías Chigorodó

## Frontend

### ⚠️ Módulos con Dependencias de Backend Pendientes

Los siguientes módulos están implementados en el frontend pero requieren endpoints específicos en el backend que aún no están creados:

1. **`frontend/js/artesano/clientes.js`**
   - **Requiere**: Endpoint para listar clientes únicos de un artesano
   - **Solución temporal**: Actualmente obtiene clientes desde los pedidos (`GET /api/orders/received`)
   - **Backend necesario**: `GET /api/artisans/{id}/customers` o similar
   - **Pendiente**: Crear caso de uso, controlador y servicio en backend

2. **`frontend/js/artesano/ganancias.js`**
   - **Requiere**: Endpoint específico de ganancias/liquidaciones
   - **Solución temporal**: Usa datos del dashboard general (`GET /api/dashboard/resumen`)
   - **Backend necesario**:
     - `GetArtisanEarningsUseCase`
     - `GET /api/artisans/{id}/earnings` (con historial de desembolsos)
   - **Nota**: Necesita definir regla de negocio para cálculo de ganancias (comisión de plataforma, etc.)

3. **`frontend/js/artesano/ventas.js`**
   - **Requiere**: Endpoint de historial de ventas con filtrado
   - **Solución temporal**: Usa datos del dashboard general
   - **Backend necesario**:
     - `GetArtisanSalesReportUseCase`
     - `GET /api/artisans/{id}/sales` (con parámetros opcionales: startDate, endDate)

4. **`frontend/js/artesano/configuracion-artesano.js`**
   - **Requiere**: Endpoint para actualizar configuración extendida de artesano
   - **Backend necesario**:
     - `UpdateArtisanConfigurationUseCase`
     - `PUT /api/artisans/{id}/configuration` o `PUT /api/artisans/{id}` con campos extendidos
   - **Campos requeridos**: bank, accountNumber, accountType, documentNumber, notificationPreferences, etc.

5. **`frontend/js/artesano/perfil-artesano.js`**
   - **Requiere**: Endpoint para actualizar perfil de artesano
   - **Backend necesario**:
     - `PUT /api/artisans/{id}` (ya existe) pero necesita validar que acepta campos como bio, displayName
   - **Verificar**: Si el endpoint `PUT /api/artisans/{id}` ya acepta todos los campos necesarios

6. **`frontend/js/admin/reportes.js`**
   - **Requiere**: Endpoints de reportes administrativos
   - **Backend necesario**:
     - `GetAdminReportsUseCase`
     - `GET /api/admin/reports` (con filtrado por fechas, tipo, etc.)
     - `GET /api/admin/reports/export` (para exportar a Excel)

## Backend

### 📋 Casos de Uso Pendientes

1. **Customer Management**
   - `GetArtisanCustomersUseCase` - Listar clientes de un artesano
   - `GetArtisanCustomerDetailsUseCase` - Detalles de un cliente

2. **Financial Reports**
   - `GetArtisanEarningsUseCase` - Ganancias y liquidaciones
   - `GetArtisanSalesReportUseCase` - Historial de ventas detallado
   - `GetAdminReportsUseCase` - Reportes globales para admin

3. **Artisan Configuration**
   - `UpdateArtisanConfigurationUseCase` - Actualizar configuración de taller
   - `GetArtisanConfigurationUseCase` - Obtener configuración actual

4. **Export Functionality**
   - `ExportSalesReportUseCase` - Exportar reportes a Excel/PDF
   - Adaptador para generar archivos Excel

### 🔧 Mejoras Sugeridas

1. **Endpoint de clientes**: `GET /api/artisans/{id}/customers`
   - Debería devolver lista de clientes únicos con su historial de compras
   - Campos: id, name, email, phone, location, totalPurchases, lastPurchaseDate

2. **Endpoint de ganancias**: `GET /api/artisans/{id}/earnings`
   - Debería devolver:
     - totalEarnings (ganancias netas después de comisión)
     - pendingWithdrawals (embolsos pendientes)
     - payoutsHistory (historial de desembolsos)
     - commissionRate (porcentaje de comisión de plataforma)
   - **REGLA DE NEGOCIO**: Definir cómo se calculan las ganancias netas
     - Ejemplo: `gananciasNetas = ventasTotales * (1 - comisionPlataforma)`
     - ¿Cuál es la comisión de la plataforma? (Ej: 5%, 10%?)

3. **Endpoint de ventas**: `GET /api/artisans/{id}/sales`
   - Debería aceptar parámetros:
     - startDate (opcional)
     - endDate (opcional)
     - status (opcional: COMPLETED, CANCELLED, etc.)
   - Devolver: lista de ventas con fecha, producto, monto, estado

4. **Endpoint de reportes admin**: `GET /api/admin/reports`
   - Debería aceptar parámetros:
     - startDate
     - endDate
     - artisanId (opcional, para filtrar por artesano)
     - type (opcional: SALES, ORDERS, EARNINGS)
   - Devolver: datos agregados y detallados

### ⚠️ Decision de Negocio Pendiente

**Pregunta crítica para el módulo de ganancias:**

- ¿Qué porcentaje de comisión cobra la plataforma a los artesanos?
- ¿Cómo se calculan exactamente las ganancias netas?
- ¿Con qué frecuencia se hacen los desembolsos? (El frontend muestra "transferencia programada para todos los viernes")

**Pregunta para el módulo de clientes:**

- ¿Los artesanos pueden ver toda la información de sus clientes (email, teléfono) o solo información limitada?
- ¿Hay restricciones de privacidad (GDPR/Ley de Protección de Datos)?

### 📝 Verificaciones Realizadas

- [ ] Confirmar con grep que no queda ningún `Math.random()` para datos de negocio
- [ ] Confirmar que no queda `showFallbackTestimonios`
- [ ] Confirmar que cada `<script src="...">` en HTMLs de artesano y admin apunta a archivo existente
- [ ] Confirmar que `api.js` tiene todos los métodos necesarios

### 🎯 Próximos Pasos

1. **Prioridad Alta**: Implementar endpoints de backend para clientes, ganancias y ventas
2. **Prioridad Media**: Definir reglas de negocio para cálculo de ganancias
3. **Prioridad Baja**: Implementar funcionalidad de exportación a Excel

Decisiones de Negocio Pendientes
Comisión de plataforma: ¿Qué porcentaje se descuenta de las ventas para calcular ganancias netas?, solo va quedar el 0.000001 % de cada venta para la plataforma solo para su mantenimiento
Frecuencia de desembolsos: ¿Cada cuánto se hacen transferencias a los artesanos?
cuanddo el cliente haga el pago , el dinero se va a la cuenta de la plataforma , y de ahi , el producto va tener un codigo unico para poder identificar quien lo vendio y asi actualizarle el salto en el perfil correspondiente y cuando el artesano decida retirar sus ganancias lo haga ,
Privacidad de clientes: ¿Los artesanos pueden ver toda la información de sus clientes (email, teléfono)? no eso solo lo puede ver el admin , lo que puede ver el arteano son los productos vendidos y cuantos , (de su pertenencia , no puede ver lo de los otros solo lo de el , el admin si puede ver todo)
