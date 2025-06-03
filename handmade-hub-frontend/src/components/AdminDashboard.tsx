import React, { useEffect, useState } from 'react';
import { fetchOrderAnalytics } from '../services/api';
import { Card, Row, Col, Typography, Button, Spin, Alert } from 'antd';

const { Title, Paragraph, Text } = Typography;

const getUserFromToken = () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return null;
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload;
    } catch {
        return null;
    }
};

const AdminDashboard: React.FC = () => {
    const user = getUserFromToken();
    const [analytics, setAnalytics] = useState<{ totalOrders: number; totalRevenue: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadAnalytics = async () => {
            try {
                const data = await fetchOrderAnalytics();
                setAnalytics(data);
            } catch (err: any) {
                // Show backend error message if available
                let msg = 'Failed to load order analytics';
                if (err?.response?.data?.error) {
                    msg += ': ' + err.response.data.error;
                } else if (err?.message) {
                    msg += ': ' + err.message;
                }
                setError(msg);
            } finally {
                setLoading(false);
            }
        };
        loadAnalytics();
    }, []);

    if (!user || user.role !== 'admin') {
        return (
            <Card style={{ maxWidth: 500, margin: '60px auto', padding: 32, textAlign: 'center', color: '#d8000c', fontWeight: 600 }}>
                Only admin accounts can access this page.
            </Card>
        );
    }
    return (
        <div className="admin-dashboard" style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 16px' }}>
            <Title level={2} style={{ marginBottom: 10 }}>Admin Dashboard</Title>
            {loading ? (
                <Spin tip="Loading analytics..." style={{ marginBottom: 24 }} />
            ) : error ? (
                <Alert message={error} type="error" showIcon style={{ marginBottom: 18 }} />
            ) : analytics && (
                <Row gutter={32} style={{ marginBottom: 32 }}>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Card bordered style={{ background: '#f5f5f5', borderRadius: 8, textAlign: 'center' }}>
                            <Text style={{ fontSize: '1.1rem', color: '#555', marginBottom: 6, display: 'block' }}>Total Orders</Text>
                            <Title level={3} style={{ color: '#007bff', margin: 0 }}>{analytics.totalOrders}</Title>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Card bordered style={{ background: '#f5f5f5', borderRadius: 8, textAlign: 'center' }}>
                            <Text style={{ fontSize: '1.1rem', color: '#555', marginBottom: 6, display: 'block' }}>Total Revenue</Text>
                            <Title level={3} style={{ color: '#28a745', margin: 0 }}>${analytics.totalRevenue.toFixed(2)}</Title>
                        </Card>
                    </Col>
                </Row>
            )}
            <Paragraph style={{ color: '#555', marginBottom: 32 }}>Welcome, admin! Manage users, products, orders, and artisan requests from one place.</Paragraph>
            <Row gutter={[28, 28]}>
                <Col xs={24} sm={12} md={12} lg={6}>
                    <Card bordered style={{ borderRadius: 12, minHeight: 120 }}>
                        <Title level={4} style={{ marginBottom: 8 }}>User Management</Title>
                        <Paragraph style={{ color: '#444', marginBottom: 8 }}>View, edit, or remove users.</Paragraph>
                        <Button type="primary" href="/usermanagement" block>Manage Users</Button>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6}>
                    <Card bordered style={{ borderRadius: 12, minHeight: 120 }}>
                        <Title level={4} style={{ marginBottom: 8 }}>Product Management</Title>
                        <Paragraph style={{ color: '#444', marginBottom: 8 }}>Add, edit, or remove products.</Paragraph>
                        <Button type="primary" href="/product-management" block>Manage Products</Button>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6}>
                    <Card bordered style={{ borderRadius: 12, minHeight: 120 }}>
                        <Title level={4} style={{ marginBottom: 8 }}>Order Management</Title>
                        <Paragraph style={{ color: '#444', marginBottom: 8 }}>View and manage all orders.</Paragraph>
                        <Button type="primary" href="/admin" block>View Orders</Button>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6}>
                    <Card bordered style={{ borderRadius: 12, minHeight: 120 }}>
                        <Title level={4} style={{ marginBottom: 8 }}>Artisan Requests</Title>
                        <Paragraph style={{ color: '#444', marginBottom: 8 }}>Review and approve artisan seller requests.</Paragraph>
                        <Button type="primary" href="/artisan-requests-admin" block>Review Requests</Button>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AdminDashboard;
