# Diseño de Arquitectura - Artesanías Chigorodo API

Este documento describe la estructura arquitectónica basada en **Arquitectura Hexagonal (Puertos y Adaptadores)** y **Domain-Driven Design (DDD)** implementada en la API de **Artesanías Chigorodo**.

---

## 1. Patrón Arquitectónico: Hexagonal (DDD)

El objetivo principal es aislar la lógica del negocio (Dominio) de cualquier framework, base de datos, librería externa o protocolo de transporte. Las dependencias siempre apuntan hacia adentro:

```mermaid
graph TD
    Infra[Infrastructure: Config, Security, Invoicing] --> App[Application Adapters & Use Cases]
    App --> Domain[Domain: Models, Ports, Exceptions]
```

---

## 2. Estructura de Paquetes (`com.artesaniaschigorodo`)

### A. Capa de Dominio (`domain`)
Contiene las reglas de negocio más puras y es independiente de Spring Boot, Hibernate o cualquier otra tecnología.
- **`exceptions`:** Clases base y específicas de error de negocio (ej. `BusinessException`, `ResourceNotFoundException`).
- **`models`:** Entidades puras de Java (ej. `User`, `Product`, `Order`, `OrderItem`, `Invoice`).
- **`models.enums`:** Enumeradores de negocio (`Role`, `Category`, `OrderStatus`, etc.).
- **`ports.in`:** Interfaces (casos de uso) que definen lo que la aplicación puede hacer desde la perspectiva del negocio (ej. `AuthUseCase`, `ProductUseCase`, `OrderUseCase`).
- **`ports.out`:** Interfaces (SPI) que definen lo que el dominio necesita del exterior (ej. `UserPersistencePort`, `ProductPersistencePort`, `OrderPersistencePort`, `InvoicePersistencePort`, `ElectronicInvoicingPort`, `PasswordEncoderPort`, `JwtTokenPort`).

### B. Capa de Aplicación (`application`)
Orquesta los flujos de datos e implementa la comunicación entre el exterior y el dominio.
- **`useCases`:** Implementaciones concretas de las interfaces de entrada (`ports.in`). Coordinan la lógica de negocio consumiendo los puertos de salida (`ports.out`).
- **`adapters.api`:** Controladores REST e interfaces web externas:
  - `controllers`: Endpoints `/api/auth`, `/api/products`, `/api/orders`, `/api/users`.
  - `request` / `response`: DTOs de entrada y salida aislados de las entidades físicas.
- **`adapters.persistence.sql`:** Capa de acceso a datos MySQL:
  - `entities`: Entidades JPA anotadas para mapeo de tablas MySQL (ej. `UserEntity`, `InvoiceEntity`).
  - `repositories`: Repositorios Spring Data JPA (`ProductJpaRepository`, `InvoiceJpaRepository`).
  - `mappers`: Convertidores manuales bidireccionales entre entidades JPA y modelos de dominio.
  - `adapters`: Clases que implementan las salidas del dominio (`ports.out`) conectando con los repositorios JPA (ej. `InvoicePersistenceAdapter`).

### C. Capa de Infraestructura (`infrastructure`)
Configuraciones transversales y componentes tecnológicos de soporte.
- **`config`:** Manejador global de excepciones (`GlobalExceptionHandler`) y CORS (`WebMvcConfig`).
- **`security`:** Configuración de Spring Security (`SecurityConfig`), filtros JWT, y adaptadores de encriptación y tokens.
- **`invoicing`:** Implementación del puerto de facturación electrónica (`SimulatedElectronicInvoicingAdapter`), responsable de la generación del CUFE y simulación del estado ante la DIAN.

---

## 3. Flujo de una Solicitud REST (Caso Facturación)

1. **Checkout:** El cliente envía una solicitud de checkout. Si el pago es aprobado, se crea y guarda la orden en estado `PAID`.
2. **Disparador:** El caso de uso `OrderUseCaseImpl` detecta la orden en estado `PAID` e invoca al puerto `ElectronicInvoicingPort.submitInvoice`.
3. **Simulación DIAN:** El adaptador de infraestructura `SimulatedElectronicInvoicingAdapter` computa un CUFE (SHA-256) a partir de los datos del pedido y crea un objeto `Invoice` marcado como `DIAN_APPROVED`.
4. **Persistencia:** La factura generada se guarda de manera persistente en base de datos mediante el puerto `InvoicePersistencePort`.
5. **Consulta:** El cliente puede recuperar esta factura de forma segura mediante el endpoint GET `/api/orders/{orderNumber}/invoice`.
