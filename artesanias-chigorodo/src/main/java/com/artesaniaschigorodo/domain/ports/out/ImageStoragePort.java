package com.artesaniaschigorodo.domain.ports.out;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

/**
 * Puerto para el almacenamiento de imágenes.
 * Define las operaciones necesarias para manejar la subida, almacenamiento
 * y recuperación de imágenes de productos.
 */
public interface ImageStoragePort {

    /**
     * Guarda una imagen y devuelve la URL pública para acceder a ella.
     * @param file Archivo de imagen a guardar
     * @return URL pública de la imagen guardada
     * @throws IOException Si ocurre un error al procesar el archivo
     */
    String storeImage(MultipartFile file) throws IOException;

    /**
     * Guarda múltiples imágenes y devuelve sus URLs públicas.
     * @param files Lista de archivos de imagen a guardar
     * @return Lista de URLs públicas de las imágenes guardadas
     * @throws IOException Si ocurre un error al procesar los archivos
     */
    List<String> storeMultipleImages(List<MultipartFile> files) throws IOException;

    /**
     * Valida que un archivo sea una imagen válida.
     * @param file Archivo a validar
     * @throws IllegalArgumentException Si el archivo no es válido
     */
    void validateImage(MultipartFile file);

    /**
     * Elimina una imagen del almacenamiento.
     * @param imageUrl URL de la imagen a eliminar
     * @return true si la eliminación fue exitosa
     */
    boolean deleteImage(String imageUrl);
}

