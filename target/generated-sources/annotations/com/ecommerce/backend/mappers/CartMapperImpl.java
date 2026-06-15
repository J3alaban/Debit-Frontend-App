package com.ecommerce.backend.mappers;

import com.ecommerce.backend.dtos.responses.CartResponse;
import com.ecommerce.backend.entities.Cart;
import com.ecommerce.backend.entities.User;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-01-07T00:16:04+0300",
    comments = "version: 1.6.0.Beta1, compiler: javac, environment: Java 21 (Oracle Corporation)"
)
@Component
public class CartMapperImpl implements CartMapper {

    @Autowired
    private CartItemMapper cartItemMapper;

    @Override
    public CartResponse toResponse(Cart cart) {
        if ( cart == null ) {
            return null;
        }

        CartResponse cartResponse = new CartResponse();

        cartResponse.setCartId( cart.getId() );
        cartResponse.setUserId( cartUserId( cart ) );
        cartResponse.setItems( cartItemMapper.toResponseList( cart.getCartItems() ) );

        return cartResponse;
    }

    private Long cartUserId(Cart cart) {
        User user = cart.getUser();
        if ( user == null ) {
            return null;
        }
        return user.getId();
    }
}
