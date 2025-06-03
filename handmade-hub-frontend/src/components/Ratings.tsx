import React, { useState } from 'react';
import { Rate, Card, Typography, Space } from 'antd';

const { Title, Paragraph } = Typography;

type RatingsProps = {
    productId: number;
};

type Review = {
    id: number;
    rating: number;
    comment: string;
};

const Ratings: React.FC<RatingsProps> = ({ productId }) => {
    const [rating, setRating] = useState<number>(0);
    const [reviews, setReviews] = useState<Review[]>([]);

    const handleRatingChange = (newRating: number) => {
        setRating(newRating);
        // Here you would typically send the new rating to the server
    };

    const fetchReviews = () => {
        // Fetch reviews from the server based on productId
        // This is a placeholder for the actual API call
        const fetchedReviews: Review[] = [
            { id: 1, rating: 5, comment: 'Amazing product!' },
            { id: 2, rating: 4, comment: 'Very good quality.' },
        ];
        setReviews(fetchedReviews);
    };

    React.useEffect(() => {
        fetchReviews();
    }, [productId]);

    return (
        <Card title={<Title level={4} style={{ margin: 0 }}>Ratings & Reviews</Title>} style={{ marginBottom: 24 }}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
                <div>
                    <span>Rate this product: </span>
                    <Rate value={rating} onChange={handleRatingChange} />
                </div>
                <div>
                    {reviews.length === 0 ? (
                        <Paragraph type="secondary">No reviews yet.</Paragraph>
                    ) : (
                        reviews.map((review) => (
                            <Card key={review.id} size="small" style={{ marginBottom: 12 }}>
                                <Rate value={review.rating} disabled style={{ fontSize: 16 }} />
                                <Paragraph style={{ margin: '8px 0 0 0' }}>{review.comment}</Paragraph>
                            </Card>
                        ))
                    )}
                </div>
            </Space>
        </Card>
    );
};

export default Ratings;