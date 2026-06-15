package com.ecommerce.backend.mappers;

import com.ecommerce.backend.dtos.requests.AddressRequestDTO;
import com.ecommerce.backend.dtos.responses.AddressResponseDTO;
import com.ecommerce.backend.entities.Address;
import com.ecommerce.backend.entities.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-01-07T00:16:04+0300",
    comments = "version: 1.6.0.Beta1, compiler: javac, environment: Java 21 (Oracle Corporation)"
)
@Component
public class AddressMapperImpl implements AddressMapper {

    @Override
    public Address addressFromRequest(AddressRequestDTO request) {
        if ( request == null ) {
            return null;
        }

        Address address = new Address();

        address.setStreet( request.getStreet() );
        address.setCity( request.getCity() );
        address.setState( request.getState() );
        address.setZipCode( request.getZipCode() );
        address.setCountry( request.getCountry() );

        return address;
    }

    @Override
    public AddressResponseDTO responseFromAddress(Address address) {
        if ( address == null ) {
            return null;
        }

        AddressResponseDTO addressResponseDTO = new AddressResponseDTO();

        addressResponseDTO.setUserId( addressUserId( address ) );
        addressResponseDTO.setId( address.getId() );
        addressResponseDTO.setStreet( address.getStreet() );
        addressResponseDTO.setCity( address.getCity() );
        addressResponseDTO.setState( address.getState() );
        addressResponseDTO.setZipCode( address.getZipCode() );
        addressResponseDTO.setCountry( address.getCountry() );

        return addressResponseDTO;
    }

    private Long addressUserId(Address address) {
        User user = address.getUser();
        if ( user == null ) {
            return null;
        }
        return user.getId();
    }
}
