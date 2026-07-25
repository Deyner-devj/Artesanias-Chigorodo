package com.artesaniaschigorodo.application.adapters.persistence.sql.adapters.files;

import com.artesaniaschigorodo.domain.ports.out.ImageStoragePort;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Adaptador de persistencia para almacenamiento local de imágenes.
 * Guarda archivos en el sistema de archivos del servidor y sirve las imágenes
 * a través de una URL pública.
 */
@Component
public class LocalStoragePersistenceAdapter implements ImageStoragePort {

    private final Path uploadDir;
    private final String baseUrl;

    // Tamaño máximo de archivo: 5MB
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;
    
    // Tipos de imagen permitidos
    private static final List<String> ALLOWED_CONTENT_TYPES = List.of(
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
            "image/gif"
    );

    public LocalStoragePersistenceAdapter(
            @Value("${app.upload.dir:uploads}") String uploadDir,
            @Value("${app.base-url:http://localhost:8080}") String baseUrl) throws IOException {
        this.uploadDir = Paths.get(uploadDir);
        this.baseUrl = baseUrl.endsWith("/") ? baseUrl : baseUrl + "/";
        
        // Crear directorio de subida si no existe
        if (!Files.exists(this.uploadDir)) {
            Files.createDirectories(this.uploadDir);
        }
    }

    @Override
    public String storeImage(MultipartFile file) throws IOException {
        validateImage(file);
        
        // Generar nombre único para el archivo
        String filename = generateUniqueFilename(file.getOriginalFilename());
        Path targetPath = uploadDir.resolve(filename);
        
        // Guardar el archivo
        file.transferTo(targetPath);
        
        // Devolver URL pública
        return baseUrl + "uploads/" + filename;
    }

    @Override
    public List<String> storeMultipleImages(List<MultipartFile> files) throws IOException {
        List<String> urls = new ArrayList<>();
        for (MultipartFile file : files) {
            urls.add(storeImage(file));
        }
        return urls;
    }

    @Override
    public void validateImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("El archivo de imagen no puede estar vacío");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException(
                    String.format("El archivo es demasiado grande. Tamaño máximo permitido: %d bytes", MAX_FILE_SIZE));
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException(
                    "Tipo de archivo no permitido. Tipos permitidos: JPEG, JPG, PNG, WebP, GIF");
        }

        // Validar extensión del archivo
        String originalFilename = file.getOriginalFilename();
        if (originalFilename != null) {
            String extension = originalFilename.substring(originalFilename.lastIndexOf('.') + 1).toLowerCase();
            if (!List.of("jpeg", "jpg", "png", "webp", "gif").contains(extension)) {
                throw new IllegalArgumentException("Extensión de archivo no permitida");
            }
        }
    }

    @Override
    public boolean deleteImage(String imageUrl) {
        try {
            // Extraer el nombre del archivo de la URL
            String filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
            Path filePath = uploadDir.resolve(filename);
            
            if (Files.exists(filePath)) {
                Files.delete(filePath);
                return true;
            }
            return false;
        } catch (IOException e) {
            return false;
        }
    }

    private String generateUniqueFilename(String originalFilename) {
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
        }
        return UUID.randomUUID().toString() + extension;
    }
}

