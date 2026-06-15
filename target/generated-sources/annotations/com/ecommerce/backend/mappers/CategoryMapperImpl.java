package com.ecommerce.backend.mappers;

import com.ecommerce.backend.dtos.requests.CategoryRequestDTO;
import com.ecommerce.backend.dtos.responses.CategoryResponse;
import com.ecommerce.backend.entities.Category;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-01-07T00:16:04+0300",
    comments = "version: 1.6.0.Beta1, compiler: javac, environment: Java 21 (Oracle Corporation)"
)
@Component
public class CategoryMapperImpl implements CategoryMapper {

    @Override
    public Category toEntity(CategoryRequestDTO request) {
        if ( request == null ) {
            return null;
        }

        Category category = new Category();

        category.setSlug( request.getSlug() );
        category.setName( request.getName() );

        return category;
    }

    @Override
    public CategoryResponse toResponse(Category category) {
        if ( category == null ) {
            return null;
        }

        CategoryResponse categoryResponse = new CategoryResponse();

        categoryResponse.setId( category.getId() );
        categoryResponse.setSlug( category.getSlug() );
        categoryResponse.setName( category.getName() );

        categoryResponse.setUrl( "/category/" + category.getSlug() );

        return categoryResponse;
    }
}
