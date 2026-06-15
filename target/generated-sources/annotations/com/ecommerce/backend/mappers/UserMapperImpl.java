package com.ecommerce.backend.mappers;

import com.ecommerce.backend.dtos.requests.UserRequestDTO;
import com.ecommerce.backend.dtos.responses.RegisterUserResponseDTO;
import com.ecommerce.backend.dtos.responses.UserResponseDTO;
import com.ecommerce.backend.entities.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-01-07T00:16:04+0300",
    comments = "version: 1.6.0.Beta1, compiler: javac, environment: Java 21 (Oracle Corporation)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public void updateUserFromRequest(UserRequestDTO request, User user) {
        if ( request == null ) {
            return;
        }

        user.setFirstName( request.getFirstName() );
        user.setLastName( request.getLastName() );
        user.setEmail( request.getEmail() );
        user.setPassword( request.getPassword() );
        user.setPhone( request.getPhone() );
    }

    @Override
    public User userFromRequest(UserRequestDTO dto) {
        if ( dto == null ) {
            return null;
        }

        User user = new User();

        user.setPhone( dto.getPhone() );
        user.setFirstName( dto.getFirstName() );
        user.setLastName( dto.getLastName() );
        user.setEmail( dto.getEmail() );
        user.setPassword( dto.getPassword() );

        return user;
    }

    @Override
    public RegisterUserResponseDTO registerResponseFromUser(User user) {
        if ( user == null ) {
            return null;
        }

        RegisterUserResponseDTO registerUserResponseDTO = new RegisterUserResponseDTO();

        registerUserResponseDTO.setId( user.getId() );
        registerUserResponseDTO.setFirstName( user.getFirstName() );
        registerUserResponseDTO.setLastName( user.getLastName() );
        registerUserResponseDTO.setEmail( user.getEmail() );
        registerUserResponseDTO.setPhone( user.getPhone() );

        return registerUserResponseDTO;
    }

    @Override
    public UserResponseDTO responseFromUser(User user) {
        if ( user == null ) {
            return null;
        }

        UserResponseDTO.UserResponseDTOBuilder userResponseDTO = UserResponseDTO.builder();

        userResponseDTO.phone( user.getPhone() );
        userResponseDTO.id( user.getId() );
        userResponseDTO.firstName( user.getFirstName() );
        userResponseDTO.lastName( user.getLastName() );
        userResponseDTO.email( user.getEmail() );
        if ( user.getRole() != null ) {
            userResponseDTO.role( user.getRole().name() );
        }

        return userResponseDTO.build();
    }
}
