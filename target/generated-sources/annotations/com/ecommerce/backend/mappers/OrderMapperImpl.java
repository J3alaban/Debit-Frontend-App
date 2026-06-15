package com.ecommerce.backend.mappers;

import com.ecommerce.backend.dtos.requests.OrderRequestDTO;
import com.ecommerce.backend.dtos.requests.OrderStatusRequestDTO;
import com.ecommerce.backend.dtos.responses.DimensionsResponse;
import com.ecommerce.backend.dtos.responses.MetaResponse;
import com.ecommerce.backend.dtos.responses.OrderResponseDTO;
import com.ecommerce.backend.dtos.responses.ProductResponseDTO;
import com.ecommerce.backend.dtos.responses.ReviewResponse;
import com.ecommerce.backend.entities.Address;
import com.ecommerce.backend.entities.Dimensions;
import com.ecommerce.backend.entities.Meta;
import com.ecommerce.backend.entities.Order;
import com.ecommerce.backend.entities.Product;
import com.ecommerce.backend.entities.Review;
import com.ecommerce.backend.entities.User;
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
public class OrderMapperImpl implements OrderMapper {

    @Override
    public Order orderFromRequest(OrderRequestDTO request) {
        if ( request == null ) {
            return null;
        }

        Order order = new Order();

        order.setUser( orderRequestDTOToUser( request ) );
        order.setAddress( orderRequestDTOToAddress( request ) );
        order.setProducts( mapProductIdsToProducts( request.getProductId() ) );
        order.setOrderDate( request.getOrderDate() );
        order.setTotalPrice( request.getTotalPrice() );

        return order;
    }

    @Override
    public OrderResponseDTO responseFromOrder(Order order) {
        if ( order == null ) {
            return null;
        }

        OrderResponseDTO orderResponseDTO = new OrderResponseDTO();

        orderResponseDTO.setUserId( orderUserId( order ) );
        orderResponseDTO.setAddressId( orderAddressId( order ) );
        orderResponseDTO.setProducts( productListToProductResponseDTOList( order.getProducts() ) );
        orderResponseDTO.setId( order.getId() );
        orderResponseDTO.setOrderDate( order.getOrderDate() );
        orderResponseDTO.setTotalPrice( order.getTotalPrice() );

        return orderResponseDTO;
    }

    @Override
    public Order toEntity(OrderStatusRequestDTO orderStatusRequestDTO) {
        if ( orderStatusRequestDTO == null ) {
            return null;
        }

        Order order = new Order();

        if ( orderStatusRequestDTO.getStatus() != null ) {
            order.setOrderStatus( Enum.valueOf( Order.OrderStatus.class, orderStatusRequestDTO.getStatus() ) );
        }

        return order;
    }

    @Override
    public OrderResponseDTO toResponseDTO(Order order) {
        if ( order == null ) {
            return null;
        }

        OrderResponseDTO orderResponseDTO = new OrderResponseDTO();

        if ( order.getOrderStatus() != null ) {
            orderResponseDTO.setStatus( order.getOrderStatus().name() );
        }
        orderResponseDTO.setId( order.getId() );
        orderResponseDTO.setOrderDate( order.getOrderDate() );
        orderResponseDTO.setTotalPrice( order.getTotalPrice() );
        orderResponseDTO.setProducts( productListToProductResponseDTOList1( order.getProducts() ) );

        return orderResponseDTO;
    }

    @Override
    public Product mapProduct(Long productId) {
        if ( productId == null ) {
            return null;
        }

        Product product = new Product();

        product.setId( productId );

        return product;
    }

    protected User orderRequestDTOToUser(OrderRequestDTO orderRequestDTO) {
        if ( orderRequestDTO == null ) {
            return null;
        }

        User user = new User();

        user.setId( orderRequestDTO.getUserId() );

        return user;
    }

    protected Address orderRequestDTOToAddress(OrderRequestDTO orderRequestDTO) {
        if ( orderRequestDTO == null ) {
            return null;
        }

        Address address = new Address();

        address.setId( orderRequestDTO.getAddressId() );

        return address;
    }

    private Long orderUserId(Order order) {
        User user = order.getUser();
        if ( user == null ) {
            return null;
        }
        return user.getId();
    }

    private Long orderAddressId(Order order) {
        Address address = order.getAddress();
        if ( address == null ) {
            return null;
        }
        return address.getId();
    }

    protected DimensionsResponse dimensionsToDimensionsResponse(Dimensions dimensions) {
        if ( dimensions == null ) {
            return null;
        }

        DimensionsResponse dimensionsResponse = new DimensionsResponse();

        dimensionsResponse.setWidth( dimensions.getWidth() );
        dimensionsResponse.setHeight( dimensions.getHeight() );
        dimensionsResponse.setDepth( dimensions.getDepth() );

        return dimensionsResponse;
    }

    protected MetaResponse metaToMetaResponse(Meta meta) {
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

    protected ReviewResponse reviewToReviewResponse(Review review) {
        if ( review == null ) {
            return null;
        }

        ReviewResponse reviewResponse = new ReviewResponse();

        reviewResponse.setRating( review.getRating() );
        reviewResponse.setComment( review.getComment() );
        if ( review.getDate() != null ) {
            reviewResponse.setDate( review.getDate().toString() );
        }
        reviewResponse.setReviewerName( review.getReviewerName() );
        reviewResponse.setReviewerEmail( review.getReviewerEmail() );

        return reviewResponse;
    }

    protected List<ReviewResponse> reviewListToReviewResponseList(List<Review> list) {
        if ( list == null ) {
            return null;
        }

        List<ReviewResponse> list1 = new ArrayList<ReviewResponse>( list.size() );
        for ( Review review : list ) {
            list1.add( reviewToReviewResponse( review ) );
        }

        return list1;
    }

    protected ProductResponseDTO productToProductResponseDTO(Product product) {
        if ( product == null ) {
            return null;
        }

        ProductResponseDTO productResponseDTO = new ProductResponseDTO();

        productResponseDTO.setId( product.getId() );
        productResponseDTO.setTitle( product.getTitle() );
        productResponseDTO.setDescription( product.getDescription() );
        productResponseDTO.setCategory( map( product.getCategory() ) );
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
        productResponseDTO.setDimensions( dimensionsToDimensionsResponse( product.getDimensions() ) );
        productResponseDTO.setMeta( metaToMetaResponse( product.getMeta() ) );
        productResponseDTO.setReviews( reviewListToReviewResponseList( product.getReviews() ) );

        return productResponseDTO;
    }

    protected List<ProductResponseDTO> productListToProductResponseDTOList(List<Product> list) {
        if ( list == null ) {
            return null;
        }

        List<ProductResponseDTO> list1 = new ArrayList<ProductResponseDTO>( list.size() );
        for ( Product product : list ) {
            list1.add( productToProductResponseDTO( product ) );
        }

        return list1;
    }

    protected List<ProductResponseDTO> productListToProductResponseDTOList1(List<Product> list) {
        if ( list == null ) {
            return null;
        }

        List<ProductResponseDTO> list1 = new ArrayList<ProductResponseDTO>( list.size() );
        for ( Product product : list ) {
            list1.add( productToProductResponseDTO( product ) );
        }

        return list1;
    }
}
