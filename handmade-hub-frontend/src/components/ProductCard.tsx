import React from 'react';
import { useHistory } from 'react-router-dom';
import { Card, Button, Image, Typography, Space } from 'antd';
import { UserOutlined, EyeOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

// Updated ProductCardProps to match backend
interface ProductCardProps {
    product: {
        _id: string;
        name: string;
        description: string;
        price: number;
        images: string[];
        category?: string;
        stock?: number;
        rating?: number;
        reviewsCount?: number;
        artisan?: string; // Added artisan field
    };
    onAddToCart: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
    const history = useHistory();
    const handleViewClick = (e: React.MouseEvent) => {
        e.preventDefault();
        history.push(`/products/${product._id}`);
    };
    const handleArtisanClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (product.artisan) {
            history.push(`/artisan/${product.artisan}`);
        }
    };
    return (
        <Card
            hoverable
            cover={
                <Image
                    src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder.jpg'}
                    alt={product.name}
                    style={{ borderRadius: '10px 10px 0 0', width: '100%', height: 180, objectFit: 'cover' }}
                    preview={false}
                    onClick={handleViewClick}
                />
            }
            style={{ borderRadius: 12, boxShadow: '0 2px 8px #f0f1f2', marginBottom: 12 }}
            bodyStyle={{ padding: 16, textAlign: 'center' }}
        >
            <Title level={4} style={{ margin: '10px 0 8px 0', cursor: 'pointer' }} onClick={handleViewClick}>{product.name}</Title>
            <Paragraph ellipsis={{ rows: 2 }} style={{ color: '#555', marginBottom: 10 }}>{product.description}</Paragraph>
            <Text strong style={{ color: '#007bff', fontSize: '1.15rem', display: 'block', marginBottom: 10 }}>${product.price.toFixed(2)}</Text>
            {product.artisan && (
                <Button
                    type="link"
                    icon={<UserOutlined />}
                    onClick={handleArtisanClick}
                    style={{ padding: 0, marginBottom: 8, fontWeight: 600 }}
                >
                    View Artisan Profile
                </Button>
            )}
            <Space direction="vertical" style={{ width: '100%' }}>
                <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    block
                    onClick={handleViewClick}
                    style={{ marginTop: 4 }}
                >
                    View
                </Button>
                <Button
                    onClick={() => onAddToCart(product._id)}
                    block
                >
                    Add to Cart
                </Button>
            </Space>
        </Card>
    );
};

export default ProductCard;