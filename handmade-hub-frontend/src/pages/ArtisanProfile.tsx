import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { Card, Typography, Row, Col, Spin, Alert } from 'antd';

const { Title, Text } = Typography;

interface Artisan {
    _id: string;
    name: string;
    email: string;
    artisanStatus: string;
}

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    category?: string;
}

const ArtisanProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [artisan, setArtisan] = useState<Artisan | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchArtisan = async () => {
            try {
                const res = await axios.get(`/api/users/artisan/${id}`);
                setArtisan(res.data.artisan);
                setProducts(res.data.products);
            } catch (err) {
                setError('Failed to load artisan profile');
            } finally {
                setLoading(false);
            }
        };
        fetchArtisan();
    }, [id]);

    if (loading) return <Spin tip="Loading..." style={{ width: '100%', marginTop: 40 }} />;
    if (error) return <Alert message={error} type="error" showIcon style={{ margin: 40 }} />;
    if (!artisan) return <Alert message="Artisan not found." type="warning" showIcon style={{ margin: 40 }} />;

    return (
        <Card style={{ maxWidth: 900, margin: '40px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: 32 }}>
            <Title level={2} style={{ fontWeight: 700, fontSize: '2.1rem', marginBottom: 18 }}>{artisan.name}</Title>
            <Text style={{ color: '#555', marginBottom: 18, display: 'block' }}>Email: {artisan.email}</Text>
            <Text style={{ color: '#007bff', marginBottom: 24, display: 'block' }}>Status: {artisan.artisanStatus}</Text>
            <Title level={4} style={{ fontWeight: 600, fontSize: '1.3rem', marginBottom: 16 }}>Products by {artisan.name}</Title>
            <Row gutter={[24, 24]}>
                {products.length === 0 ? <Text>No products found.</Text> : products.map(product => (
                    <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
                        <ProductCard product={product} onAddToCart={() => {}} />
                    </Col>
                ))}
            </Row>
        </Card>
    );
};

export default ArtisanProfile;
