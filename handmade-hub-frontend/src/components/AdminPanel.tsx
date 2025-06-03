import React, { useEffect, useState } from 'react';
import { fetchAllOrders } from '../services/api';
import { Card, Typography, List, Spin, Alert } from 'antd';

const { Title, Paragraph, Text } = Typography;

interface Order {
    _id: string;
    items: { product: { name: string }; quantity: number }[];
    totalPrice: number;
    status: string;
    createdAt: string;
}

const AdminPanel: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const data = await fetchAllOrders();
                setOrders(data);
            } catch (err: any) {
                setError(err?.response?.data?.error || 'Failed to load orders');
            } finally {
                setLoading(false);
            }
        };
        loadOrders();
    }, []);

    if (loading) return <Spin tip="Loading orders..." style={{ width: '100%', marginTop: 80 }} />;
    if (error) return <Alert message={error} type="error" showIcon style={{ margin: 40 }} />;

    return (
        <Card className="admin-panel" style={{ maxWidth: 900, margin: '40px auto', borderRadius: 12 }}>
            <Title level={2}>Admin Panel</Title>
            <section>
                <Title level={4}>All Orders</Title>
                <List
                    dataSource={orders}
                    renderItem={order => (
                        <List.Item key={order._id} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                            <Text strong>Order #{order._id} - {order.status} - ${order.totalPrice}</Text>
                            <List
                                dataSource={order.items}
                                renderItem={(item, idx) => (
                                    <List.Item key={idx} style={{ paddingLeft: 24, border: 'none' }}>
                                        <Text>{item.product.name} x {item.quantity}</Text>
                                    </List.Item>
                                )}
                                size="small"
                                bordered={false}
                            />
                            <Text type="secondary">Placed: {new Date(order.createdAt).toLocaleString()}</Text>
                        </List.Item>
                    )}
                    bordered
                />
            </section>
        </Card>
    );
};

export default AdminPanel;