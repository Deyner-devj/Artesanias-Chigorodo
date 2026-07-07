package com.artesaniaschigorodo.infrastructure.invoicing;

import com.artesaniaschigorodo.domain.models.order.Invoice;
import com.artesaniaschigorodo.domain.models.order.Order;
import com.artesaniaschigorodo.domain.ports.out.ElectronicInvoicingPort;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;

@Component
public class SimulatedElectronicInvoicingAdapter implements ElectronicInvoicingPort {

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

