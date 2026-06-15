package com.ecommerce.backend.mappers;

import com.ecommerce.backend.dtos.responses.MetaResponse;
import com.ecommerce.backend.entities.Meta;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-01-07T00:16:04+0300",
    comments = "version: 1.6.0.Beta1, compiler: javac, environment: Java 21 (Oracle Corporation)"
)
@Component
public class MetaMapperImpl implements MetaMapper {

    @Override
    public MetaResponse toResponse(Meta meta) {
        if ( meta == null ) {
            return null;
        }

        MetaResponse metaResponse = new MetaResponse();

        if ( meta.getCreatedAt() != null ) {
            metaResponse.setCreatedAt( meta.getCreatedAt().toString() );
        }
        if ( meta.getUpdatedAt() != null ) {
            metaResponse.setUpdatedAt( meta.getUpdatedAt().toString() );
        }
        metaResponse.setBarcode( meta.getBarcode() );
        metaResponse.setQrCode( meta.getQrCode() );

        return metaResponse;
    }
}
