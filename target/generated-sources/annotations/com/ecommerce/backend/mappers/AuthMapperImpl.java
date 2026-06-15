package com.ecommerce.backend.mappers;

import com.ecommerce.backend.dtos.requests.RegisterUserRequestDTO;
import com.ecommerce.backend.dtos.requests.UserRequestDTO;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-01-07T00:16:04+0300",
    comments = "version: 1.6.0.Beta1, compiler: javac, environment: Java 21 (Oracle Corporation)"
)
@Component
public class AuthMapperImpl implements AuthMapper {

    @Override
    public UserRequestDTO addRequestFromRegisterRequest(RegisterUserRequestDTO request) {
        if ( request == null ) {
            return null;
        }

        UserRequestDTO userRequestDTO = new UserRequestDTO();

        userRequestDTO.setFirstName( request.getFirstName() );
        userRequestDTO.setEmail( request.getEmail() );
        userRequestDTO.setPassword( request.getPassword() );
        userRequestDTO.setPhone( request.getPhone() );

        return userRequestDTO;
    }
}
