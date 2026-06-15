package com.ecommerce.backend.mappers;

import com.ecommerce.backend.dtos.requests.PaymentRequest;
import com.ecommerce.backend.dtos.responses.PaymentResponse;
import com.ecommerce.backend.entities.Address;
import com.ecommerce.backend.entities.Order;
import com.ecommerce.backend.entities.Payment;
import com.ecommerce.backend.entities.PaymentStatus;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-01-07T00:16:04+0300",
    comments = "version: 1.6.0.Beta1, compiler: javac, environment: Java 21 (Oracle Corporation)"
)
@Component
public class PaymentMapperImpl implements PaymentMapper {

    @Override
    public PaymentResponse toResponse(Payment payment) {
        if ( payment == null ) {
            return null;
        }

        PaymentResponse paymentResponse = new PaymentResponse();

        paymentResponse.setOrderId( paymentOrderId( payment ) );
        paymentResponse.setId( payment.getId() );
        paymentResponse.setMethod( payment.getMethod() );
        paymentResponse.setStatus( payment.getStatus() );
        paymentResponse.setAmount( payment.getAmount() );
        paymentResponse.setCurrency( payment.getCurrency() );
        paymentResponse.setTransactionId( payment.getTransactionId() );
        paymentResponse.setPaymentDate( payment.getPaymentDate() );
        paymentResponse.setProvider( payment.getProvider() );

        paymentResponse.setAddress( formatFullAddress(payment.getAddress()) );

        return paymentResponse;
    }

    @Override
    public Payment toEntity(PaymentRequest request, Order order, Address address) {
        if ( request == null && order == null && address == null ) {
            return null;
        }

        Payment payment = new Payment();

        if ( request != null ) {
            payment.setProvider( request.getProvider() );
            payment.setMethod( request.getMethod() );
            payment.setAmount( request.getAmount() );
            payment.setCurrency( request.getCurrency() );
        }
        payment.setOrder( order );
        payment.setAddress( address );
        payment.setStatus( PaymentStatus.PENDING );

        return payment;
    }

    private Long paymentOrderId(Payment payment) {
        Order order = payment.getOrder();
        if ( order == null ) {
            return null;
        }
        return order.getId();
    }
}
