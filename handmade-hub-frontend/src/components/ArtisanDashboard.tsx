import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { fetchMyOrders } from '../services/api';
import { Card, Row, Col, Typography, Button, Spin, Alert } from 'antd';

const { Title, Paragraph } = Typography;

interface Order {
    _id: string;
    items: { product: { name: string }; quantity: number }[];
    totalPrice: number;
    status: string;
    createdAt: string;
}

const trackOrderInfo = `Track the status of your orders in real time. Update delivery status and communicate with buyers.`;

const deliveryInfo = `Manage your deliveries, mark orders as shipped, and provide tracking information to customers.`;

const paymentInfo = `Payments are processed securely. You can view your payment history and manage payout options.`;

const productInfo = `Add, edit, or remove your handmade products. Manage inventory and showcase your best work.`;

const ArtisanDashboard: React.FC = () => {
    const history = useHistory();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const data = await fetchMyOrders();
                setOrders(data);
            } catch (err: any) {
                setError(err?.response?.data?.error || 'Failed to load orders');
            } finally {
                setLoading(false);
            }
        };
        loadOrders();
    }, []);

    // Only show the dashboard if the user's role is 'artisan' AND their artisanStatus is 'approved'
    const user = (() => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return null;
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload;
        } catch {
            return null;
        }
    })();

    if (!user || user.role !== 'artisan' || user.artisanStatus !== 'approved') {
        return (
            <div style={{ maxWidth: 600, margin: '60px auto', padding: 32, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', textAlign: 'center', color: '#d8000c', fontWeight: 600 }}>
                Your seller (artisan) account is not yet approved. Please wait for admin approval.
            </div>
        );
    }

    if (loading) {
        return <Spin size="large" style={{ display: 'block', margin: '40px auto' }} />;
    }

    if (error) {
        return <Alert message={error} type="error" showIcon style={{ margin: '40px auto', maxWidth: 600 }} />;
    }

    return (
        <div className="artisan-dashboard" style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 16px' }}>
            <Title level={2} style={{ marginBottom: 10 }}>Artisan Dashboard</Title>
            <Paragraph style={{ color: '#555', marginBottom: 32 }}>Welcome to your dashboard! Manage your shop, orders, and payments all in one place.</Paragraph>
            <Row gutter={[28, 28]}>
                <Col xs={24} sm={12} md={12} lg={8}>
                    <Card bordered style={{ borderRadius: 12, minHeight: 120 }}>
                        <Title level={4} style={{ marginBottom: 8, fontSize: '1.2rem' }}>Orders</Title>
                        <Paragraph style={{ color: '#444', marginBottom: 8 }}>View and manage all your customer orders.</Paragraph>
                        <Button type="primary" href="/dashboard" block>View Orders</Button>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={12} lg={8}>
                    <Card bordered style={{ borderRadius: 12, minHeight: 120 }}>
                        <Title level={4} style={{ marginBottom: 8, fontSize: '1.2rem' }}>Track Orders</Title>
                        <Paragraph style={{ color: '#444', marginBottom: 8 }}>{trackOrderInfo}</Paragraph>
                        <Button type="primary" href="/dashboard" block>Track Orders</Button>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={12} lg={8}>
                    <Card bordered style={{ borderRadius: 12, minHeight: 120 }}>
                        <Title level={4} style={{ marginBottom: 8, fontSize: '1.2rem' }}>Delivery</Title>
                        <Paragraph style={{ color: '#444', marginBottom: 8 }}>{deliveryInfo}</Paragraph>
                        <Button type="primary" href="/dashboard" block>Manage Delivery</Button>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={12} lg={8}>
                    <Card bordered style={{ borderRadius: 12, minHeight: 120 }}>
                        <Title level={4} style={{ marginBottom: 8, fontSize: '1.2rem' }}>Payment</Title>
                        <Paragraph style={{ color: '#444', marginBottom: 8 }}>{paymentInfo}</Paragraph>
                        <Button type="primary" href="/dashboard" block>View Payments</Button>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={12} lg={8}>
                    <Card bordered style={{ borderRadius: 12, minHeight: 120 }}>
                        <Title level={4} style={{ marginBottom: 8, fontSize: '1.2rem' }}>Product Management</Title>
                        <Paragraph style={{ color: '#444', marginBottom: 8 }}>{productInfo}</Paragraph>
                        <Button type="primary" href="/product-management" block>Manage Products</Button>
                    </Card>
                </Col>
            </Row>
            {user && user.role === 'artisan' && (
                <div style={{ margin: '24px 0' }}>
                    <Button type="dashed" size="large" onClick={() => history.push('/artisan-request')}>
                        Request to Become a Seller
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ArtisanDashboard;