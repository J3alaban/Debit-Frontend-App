package com.ecommerce.backend.mappers;

import com.ecommerce.backend.dtos.requests.OrderItemRequestDTO;
import com.ecommerce.backend.dtos.responses.OrderItemResponseDTO;
import com.ecommerce.backend.entities.Order;
import com.ecommerce.backend.entities.OrderItem;
import com.ecommerce.backend.entities.Product;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-01-07T00:16:04+0300",
    comments = "version: 1.6.0.Beta1, compiler: javac, environment: Java 21 (Oracle Corporation)"
)
@Component
public class OrderItemMapperImpl implements OrderItemMapper {

    @Override
    public OrderItem orderItemFromRequest(OrderItemRequestDTO request) {
        if ( request == null ) {
            return null;
        }

        OrderItem orderItem = new OrderItem();

        orderItem.setOrder( orderItemRequestDTOToOrder( request ) );
        orderItem.setProduct( orderItemRequestDTOToProduct( request ) );

        return orderItem;
    }

    @Override
    public OrderItemResponseDTO responseFromOrderItem(OrderItem orderItem) {
        if ( orderItem == null ) {
            return null;
        }

        OrderItemResponseDTO orderItemResponseDTO = new OrderItemResponseDTO();

        orderItemResponseDTO.setOrderId( orderItemOrderId( orderItem ) );
        orderItemResponseDTO.setProductId( orderItemProductId( orderItem ) );

        return orderItemResponseDTO;
    }

    protected Order orderItemRequestDTOToOrder(OrderItemRequestDTO orderItemRequestDTO) {
        if ( orderItemRequestDTO == null ) {
            return null;
        }

        Order order = new Order();

        order.setId( orderItemRequestDTO.getOrderId() );

        return order;
    }

    protected Product orderItemRequestDTOToProduct(OrderItemRequestDTO orderItemRequestDTO) {
        if ( orderItemRequestDTO == null ) {
            return null;
        }

        Product product = new Product();

        product.setId( orderItemRequestDTO.getProductId() );

        return product;
    }

    private Long orderItemOrderId(OrderItem orderItem) {
        Order order = orderItem.getOrder();
        if ( order == null ) {
            return null;
        }
        return order.getId();
    }

    private Long orderItemProductId(OrderItem orderItem) {
        Product product = orderItem.getProduct();
        if ( product == null ) {
            return null;
        }
        return product.getId();
    }
}
