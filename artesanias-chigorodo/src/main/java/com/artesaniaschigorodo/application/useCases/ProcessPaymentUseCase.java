package com.artesaniaschigorodo.application.useCases;

import com.artesaniaschigorodo.application.adapters.api.request.PaymentRequest;
import com.artesaniaschigorodo.domain.exceptions.BusinessException;
import com.artesaniaschigorodo.domain.exceptions.ForbiddenOperationException;
import com.artesaniaschigorodo.domain.exceptions.ResourceNotFoundException;
import com.artesaniaschigorodo.domain.models.enums.OrderStatus;
import com.artesaniaschigorodo.domain.models.enums.PaymentMethod;
import com.artesaniaschigorodo.domain.models.order.Invoice;
import com.artesaniaschigorodo.domain.models.order.Order;
import com.artesaniaschigorodo.domain.models.payment.Payment;
import com.artesaniaschigorodo.domain.models.payment.PaymentDetails;
import com.artesaniaschigorodo.domain.models.user.User;
import com.artesaniaschigorodo.domain.models.enums.Role;
import com.artesaniaschigorodo.domain.ports.out.ElectronicInvoicingPort;
import com.artesaniaschigorodo.domain.ports.out.InvoicePort;
import com.artesaniaschigorodo.domain.ports.out.OrderPort;
import com.artesaniaschigorodo.domain.ports.out.PaymentPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.concurrent.atomic.AtomicLong;
import java.util.Map;
import com.artesaniaschigorodo.infrastructure.audit.AuditEventService;

@Service
@RequiredArgsConstructor
public class ProcessPaymentUseCase {

    private final OrderPort orderPersistencePort;
    private final ElectronicInvoicingPort electronicInvoicingPort;
    private final InvoicePort invoicePersistencePort;
    private final PaymentPort paymentPersistencePort;
    private final AuditEventService auditEventService;
    private final AtomicLong sequence = new AtomicLong(1L);

    public Payment processPayment(PaymentRequest request, User currentUser) {
        Order order = orderPersistencePort.findByOrderNumber(request.getOrderNumber())
                .orElseThrow(() -> new ResourceNotFoundException("La orden no existe."));

        if (currentUser.getRole() == Role.CLIENT && order.getUser() != null && !order.getUser().getId().equals(currentUser.getId())) {
            throw new ForbiddenOperationException("No tiene permisos para pagar esta orden.");
        }

        PaymentMethod paymentMethod;
        try {
            paymentMethod = PaymentMethod.valueOf(request.getPaymentMethod().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BusinessException("Método de pago inválido: " + request.getPaymentMethod());
        }

        String status = request.getStatus() != null ? request.getStatus().toUpperCase() : "APPROVED";
        String transactionId = request.getTransactionId() != null && !request.getTransactionId().isBlank()
                ? request.getTransactionId()
                : "PAY-" + sequence.getAndIncrement();

        Payment payment = Payment.builder()
                .orderNumber(order.getOrderNumber())
                .userEmail(currentUser.getEmail())
                .paymentMethod(paymentMethod)
                .transactionId(transactionId)
                .status(status)
                .amount(order.getTotal())
                .processedAt(LocalDateTime.now())
                .build();

        PaymentDetails paymentDetails = PaymentDetails.builder()
                .paymentMethod(paymentMethod)
                .transactionId(transactionId)
                .status(status)
                .build();

        order.setPaymentDetails(paymentDetails);
        order.setOrderStatus("APPROVED".equalsIgnoreCase(status) ? OrderStatus.PAID : OrderStatus.PENDING);
        orderPersistencePort.save(order);
        Payment savedPayment = paymentPersistencePort.save(payment);

        auditEventService.record("PAYMENT_PROCESS", "APPROVED".equalsIgnoreCase(status) ? "SUCCESS" : "REJECTED",
                currentUser.getEmail(), currentUser.getId(), "ORDER", order.getOrderNumber(),
                Map.of("paymentMethod", paymentMethod.name(), "transactionId", transactionId,
                        "amount", String.valueOf(order.getTotal())));

        if (order.getOrderStatus() == OrderStatus.PAID) {
            try {
                Invoice invoice = electronicInvoicingPort.submitInvoice(order);
                invoicePersistencePort.save(invoice);
            } catch (Exception ex) {
                System.err.println("No se pudo generar la factura electrónica: " + ex.getMessage());
            }
        }

        return savedPayment;
    }
}
