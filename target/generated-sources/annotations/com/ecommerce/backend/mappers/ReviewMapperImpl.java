package com.ecommerce.backend.mappers;

import com.ecommerce.backend.dtos.responses.ReviewResponse;
import com.ecommerce.backend.entities.Review;
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
public class ReviewMapperImpl implements ReviewMapper {

    @Override
    public ReviewResponse toResponse(Review review) {
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

    @Override
    public List<ReviewResponse> toResponseList(List<Review> reviews) {
        if ( reviews == null ) {
            return null;
        }

        List<ReviewResponse> list = new ArrayList<ReviewResponse>( reviews.size() );
        for ( Review review : reviews ) {
            list.add( toResponse( review ) );
        }

        return list;
    }
}
