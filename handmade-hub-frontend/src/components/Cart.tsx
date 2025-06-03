import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { fetchMyOrders } from '../services/api';
import { Card, Button, Alert, Spin, Typography, List } from 'antd';

const { Title, Text } = Typography;

interface Order {
    _id: string;
    items: { product: { name: string }; quantity: number }[];
    totalPrice: number;
    status: string;
    createdAt: string;
}

const Cart: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const history = useHistory();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        // Check authentication
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
        if (!token) {
            setLoading(false);
            setError('You must be logged in to view your cart.');
            return;
        }
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

    if (loading) return <Spin tip="Loading..." style={{ width: '100%', marginTop: 80 }} />;
    if (!isAuthenticated) {
        return (
            <Card style={{ maxWidth: 400, margin: '40px auto', textAlign: 'center' }}>
                <Title level={2}>Cart</Title>
                <Alert message="You must be logged in to view your cart." type="warning" showIcon style={{ marginBottom: 16 }} />
                <Button type="primary" onClick={() => history.push('/login')}>Go to Login</Button>
            </Card>
        );
    }
    if (error) return <Alert message={error} type="error" showIcon style={{ margin: 40 }} />;

    return (
        <Card style={{ maxWidth: 700, margin: '40px auto' }}>
            <Title level={2}>Your Orders</Title>
            {orders.length === 0 ? (
                <Text type="secondary">You have no orders yet.</Text>
            ) : (
                <List
                    itemLayout="vertical"
                    dataSource={orders}
                    renderItem={order => (
                        <Card key={order._id} style={{ marginBottom: 18 }}>
                            <Title level={4} style={{ marginBottom: 4 }}>Order #{order._id}</Title>
                            <Text>Status: <b>{order.status}</b></Text><br />
                            <Text>Total: <b>${order.totalPrice}</b></Text>
                            <List
                                size="small"
                                dataSource={order.items}
                                renderItem={item => (
                                    <List.Item>
                                        <Text>{item.product.name} x {item.quantity}</Text>
                                    </List.Item>
                                )}
                                style={{ margin: '10px 0' }}
                            />
                            <Text type="secondary">Placed: {new Date(order.createdAt).toLocaleString()}</Text>
                        </Card>
                    )}
                />
            )}
        </Card>
    );
};

export default Cart;