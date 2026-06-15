package com.ecommerce.backend.mappers;

import com.ecommerce.backend.dtos.requests.ProductRequestDTO;
import com.ecommerce.backend.dtos.responses.ProductResponseDTO;
import com.ecommerce.backend.entities.Category;
import com.ecommerce.backend.entities.Product;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-01-07T00:16:04+0300",
    comments = "version: 1.6.0.Beta1, compiler: javac, environment: Java 21 (Oracle Corporation)"
)
@Component
public class ProductMapperImpl implements ProductMapper {

    @Autowired
    private DimensionsMapper dimensionsMapper;
    @Autowired
    private ReviewMapper reviewMapper;
    @Autowired
    private MetaMapper metaMapper;

    @Override
    public Product productFromRequest(ProductRequestDTO request, Category category) {
        if ( request == null && category == null ) {
            return null;
        }

        Product product = new Product();

        if ( request != null ) {
            product.setTitle( request.getTitle() );
            product.setDescription( request.getDescription() );
            product.setPrice( request.getPrice() );
            if ( request.getStock() != null ) {
                product.setStock( request.getStock() );
            }
            product.setBrand( request.getBrand() );
            product.setSku( request.getSku() );
            product.setDiscountPercentage( request.getDiscountPercentage() );
            product.setWeight( request.getWeight() );
            product.setSize( request.getSize() );
            product.setDimensions( dimensionsMapper.toEntity( request.getDimensions() ) );
            List<String> list = request.getImages();
            if ( list != null ) {
                product.setImages( new ArrayList<String>( list ) );
            }
        }
        if ( category != null ) {
            product.setId( category.getId() );
        }

        return product;
    }

    @Override
    public ProductResponseDTO responseFromProduct(Product product) {
        if ( product == null ) {
            return null;
        }

        ProductResponseDTO productResponseDTO = new ProductResponseDTO();

        productResponseDTO.setCategory( productCategorySlug( product ) );
        productResponseDTO.setId( product.getId() );
        productResponseDTO.setTitle( product.getTitle() );
        productResponseDTO.setDescription( product.getDescription() );
        productResponseDTO.setPrice( product.getPrice() );
        productResponseDTO.setDiscountPercentage( product.getDiscountPercentage() );
        productResponseDTO.setRating( product.getRating() );
        productResponseDTO.setStock( product.getStock() );
        productResponseDTO.setSize( product.getSize() );
        productResponseDTO.setBrand( product.getBrand() );
        productResponseDTO.setSku( product.getSku() );
        productResponseDTO.setWeight( product.getWeight() );
        List<String> list = product.getImages();
        if ( list != null ) {
            productResponseDTO.setImages( new ArrayList<String>( list ) );
        }
        productResponseDTO.setDimensions( dimensionsMapper.toResponse( product.getDimensions() ) );
        productResponseDTO.setMeta( metaMapper.toResponse( product.getMeta() ) );
        productResponseDTO.setReviews( reviewMapper.toResponseList( product.getReviews() ) );

        return productResponseDTO;
    }

    private String productCategorySlug(Product product) {
        Category category = product.getCategory();
        if ( category == null ) {
            return null;
        }
        return category.getSlug();
    }
}
