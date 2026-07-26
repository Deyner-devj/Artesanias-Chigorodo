# ==========================================
# ETAPA 1: Construcción (Build)
# ==========================================
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app

# Copiamos primero los archivos de configuración de Maven para aprovechar el cache
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Dar permisos de ejecución al script mvnw
RUN chmod +x mvnw

# Descargamos las dependencias necesarias
RUN ./mvnw dependency:go-offline -B

# Copiamos el código fuente y compilamos omitiendo los tests para acelerar la build
COPY src ./src
RUN ./mvnw clean package -DskipTests

# ==========================================
# ETAPA 2: Ejecución (Runtime)
# ==========================================
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copiamos el ejecutable generado en la etapa anterior renombrándolo correctamente a app.jar
COPY --from=builder /app/target/*.jar app.jar

# Crear directorio de uploads para imágenes
RUN mkdir -p /app/uploads

# Exponemos el puerto de Spring Boot
EXPOSE 8080

# Ejecutamos la aplicación con la extensión .jar correcta
ENTRYPOINT ["java", "-jar", "app.jar"]