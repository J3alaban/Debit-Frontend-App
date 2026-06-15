package com.ecommerce.backend.mappers;

import com.ecommerce.backend.dtos.requests.DimensionsRequest;
import com.ecommerce.backend.dtos.responses.DimensionsResponse;
import com.ecommerce.backend.entities.Dimensions;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-01-07T00:16:04+0300",
    comments = "version: 1.6.0.Beta1, compiler: javac, environment: Java 21 (Oracle Corporation)"
)
@Component
public class DimensionsMapperImpl implements DimensionsMapper {

    @Override
    public Dimensions toEntity(DimensionsRequest request) {
        if ( request == null ) {
            return null;
        }

        Dimensions dimensions = new Dimensions();

        dimensions.setWidth( request.getWidth() );
        dimensions.setHeight( request.getHeight() );
        dimensions.setDepth( request.getDepth() );

        return dimensions;
    }

    @Override
    public DimensionsResponse toResponse(Dimensions dimensions) {
        if ( dimensions == null ) {
            return null;
        }

        DimensionsResponse dimensionsResponse = new DimensionsResponse();

        dimensionsResponse.setWidth( dimensions.getWidth() );
        dimensionsResponse.setHeight( dimensions.getHeight() );
        dimensionsResponse.setDepth( dimensions.getDepth() );

        return dimensionsResponse;
    }
}
