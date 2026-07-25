package com.artesaniaschigorodo.infrastructure.invoicing;

import com.artesaniaschigorodo.domain.models.order.Invoice;
import com.artesaniaschigorodo.domain.models.order.Order;
import com.artesaniaschigorodo.domain.ports.out.ElectronicInvoicingPort;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;

/**
 * Adaptador SIMULADO para facturación electrónica DIAN.
 * 
 * ESTA ES UNA IMPLEMENTACIÓN DE DESARROLLO QUE NO DEBE USARSE EN PRODUCCIÓN.
 * 
 * Para un entorno productivo, se debe integrar con un proveedor real de facturación
 * electrónica DIAN como:
 * - Facturador Electrónico DIAN (https://facturadionelectronica.dian.gov.co/)
 * - Proveedores autorizados: Siigo, Contpaqi, FE DIAN, etc.
 * 
 * Configuración requerida para producción:
 * - Credenciales de acceso al proveedor DIAN
 * - Certificado digital válido
 * - Resolución de facturación DIAN
 * - Ambiente configurado (pruebas o producción)
 * 
 * Para deshabilitar esta implementación simulada y usar una real:
 * 1. Crear una nueva implementación de ElectronicInvoicingPort
 * 2. Configurar el bean correspondiente en la configuración de Spring
 * 3. Eliminar o comentar esta clase
 * 4. Documentar la nueva implementación en el README.md
 */
@Component
public class SimulatedElectronicInvoicingAdapter implements ElectronicInvoicingPort {

    /**
     * SIMULACIÓN: Genera un CUFE (Código Único de Factura Electrónica) simulado.
     * En producción, este código debe ser generado por el proveedor DIAN autorizado.
     */
    @Override
    public Invoice submitInvoice(Order order) {
        String cufe = generateCufe(order);
        return Invoice.builder()
                .orderNumber(order.getOrderNumber())
                .cufe(cufe)
                .qrCodeUrl("https://catalogo-vpfe.dian.gov.co/document/search?uuid=" + cufe)
                .issueDate(LocalDateTime.now())
                .status("DIAN_APPROVED")
                .totalAmount(order.getTotal())
                .build();
    }

    private String generateCufe(Order order) {
        try {
            String rawData = order.getOrderNumber() + order.getTotal() + LocalDateTime.now();
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawData.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            return "CUFE-FALLBACK-GENERATION-ERROR-" + System.currentTimeMillis();
        }
    }
}

