package com.ecommerce.backend.mappers;

import com.ecommerce.backend.dtos.responses.CartItemResponse;
import com.ecommerce.backend.entities.CartItem;
import com.ecommerce.backend.entities.Product;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-01-07T00:16:04+0300",
    comments = "version: 1.6.0.Beta1, compiler: javac, environment: Java 21 (Oracle Corporation)"
)
@Component
public class CartItemMapperImpl implements CartItemMapper {

    @Override
    public CartItemResponse toResponse(CartItem cartItem) {
        if ( cartItem == null ) {
            return null;
        }

        CartItemResponse cartItemResponse = new CartItemResponse();

        cartItemResponse.setProductId( cartItemProductId( cartItem ) );
        cartItemResponse.setProductTitle( cartItemProductTitle( cartItem ) );
        cartItemResponse.setPrice( cartItemProductPrice( cartItem ) );
        cartItemResponse.setId( cartItem.getId() );
        cartItemResponse.setQuantity( cartItem.getQuantity() );

        return cartItemResponse;
    }

    @Override
    public List<CartItemResponse> toResponseList(List<CartItem> cartItems) {
        if ( cartItems == null ) {
            return null;
        }

        List<CartItemResponse> list = new ArrayList<CartItemResponse>( cartItems.size() );
        for ( CartItem cartItem : cartItems ) {
            list.add( toResponse( cartItem ) );
        }

        return list;
    }

    private Long cartItemProductId(CartItem cartItem) {
        Product product = cartItem.getProduct();
        if ( product == null ) {
            return null;
        }
        return product.getId();
    }

    private String cartItemProductTitle(CartItem cartItem) {
        Product product = cartItem.getProduct();
        if ( product == null ) {
            return null;
        }
        return product.getTitle();
    }

    private Double cartItemProductPrice(CartItem cartItem) {
        Product product = cartItem.getProduct();
        if ( product == null ) {
            return null;
        }
        return product.getPrice();
    }
}
