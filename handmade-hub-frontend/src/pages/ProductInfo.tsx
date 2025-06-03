import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { getProductById } from '../services/api';
import { Layout, Row, Col, Card, Typography, Image, Spin, Alert, Divider } from 'antd';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

interface Product {
    _id: string;
    name: string;
    images: string[];
    description: string;
    price: number;
    category?: string;
    stock?: number;
    rating?: number;
    reviewsCount?: number;
}

const ProductInfo: React.FC = () => {
    const location = useLocation<{ product?: { name: string; image: string; description: string; shipping: string } }>();
    const params = useParams<{ id?: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            if (location.state?.product) {
                setProduct({
                    _id: '',
                    name: location.state.product.name,
                    images: [location.state.product.image],
                    description: location.state.product.description,
                    price: 0,
                });
                setLoading(false);
            } else if (params.id) {
                try {
                    const data = await getProductById(params.id);
                    setProduct(data);
                } catch (err) {
                    setError('Product not found.');
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [location.state, params.id]);

    if (loading) return <Spin tip="Loading..." style={{ width: '100%', marginTop: 80 }} />;
    if (error || !product) return <Alert message={error || 'No product information available.'} type="error" showIcon style={{ margin: 40 }} />;

    return (
        <Layout style={{ background: '#fff', minHeight: '100vh' }}>
            <Content style={{ maxWidth: 900, margin: '40px auto', padding: '0 24px' }}>
                <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
                    <Row gutter={[32, 32]} align="middle">
                        <Col xs={24} md={10}>
                            <Image
                                src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder.jpg'}
                                alt={product.name}
                                width="100%"
                                style={{ borderRadius: 8, objectFit: 'cover', maxWidth: 340, margin: 32 }}
                                fallback="/placeholder.jpg"
                            />
                        </Col>
                        <Col xs={24} md={14}>
                            <Title level={2} style={{ marginBottom: 18 }}>{product.name}</Title>
                            <Divider orientation="left">Product Info</Divider>
                            <Paragraph style={{ fontSize: '1.08rem', color: '#222', marginBottom: 24, lineHeight: 1.7 }}>{product.description}</Paragraph>
                            <Divider orientation="left">Shipping Details</Divider>
                            <Text style={{ fontSize: '1.08rem', color: '#222', lineHeight: 1.7 }}>Ships within 2-5 business days. Free shipping on orders over $75.</Text>
                        </Col>
                    </Row>
                </Card>
            </Content>
        </Layout>
    );
};

export default ProductInfo;
