import React, { useState } from 'react';
import { createOrder } from '../services/api';
import { Card, Typography, List, Button, Spin, Alert } from 'antd';

const { Title, Paragraph, Text } = Typography;

const Checkout: React.FC = () => {
    const [cartItems, setCartItems] = useState<any[]>([]); // TODO: Replace with real cart state
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [paymentStatus, setPaymentStatus] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        setLoading(true);
        setPaymentStatus('');
        try {
            // Backend expects: items: [{ product, quantity }], totalPrice
            const orderData = {
                items: cartItems.map(item => ({ product: item._id, quantity: item.quantity })),
                totalPrice: totalAmount,
            };
            await createOrder(orderData);
            setPaymentStatus('Payment successful!');
            setCartItems([]);
        } catch (error: any) {
            setPaymentStatus(error?.response?.data?.error || 'An error occurred during payment processing.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="checkout" style={{ maxWidth: 500, margin: '40px auto', borderRadius: 12 }}>
            <Title level={2}>Checkout</Title>
            <div style={{ marginBottom: 24 }}>
                <Title level={4}>Your Cart</Title>
                {cartItems.length === 0 ? (
                    <Paragraph type="secondary">Your cart is empty.</Paragraph>
                ) : (
                    <List
                        dataSource={cartItems}
                        renderItem={item => (
                            <List.Item>
                                <Text>{item.name} - ${item.price} x {item.quantity}</Text>
                            </List.Item>
                        )}
                        bordered
                        style={{ marginBottom: 12 }}
                    />
                )}
            </div>
            <div style={{ marginBottom: 18 }}>
                <Title level={5}>Total Amount: ${totalAmount}</Title>
            </div>
            <Button
                type="primary"
                onClick={handleCheckout}
                loading={loading}
                disabled={cartItems.length === 0}
                block
                style={{ marginBottom: 16 }}
            >
                Proceed to Payment
            </Button>
            {paymentStatus && (
                <Alert message={paymentStatus} type={paymentStatus.includes('success') ? 'success' : 'error'} showIcon style={{ marginTop: 8 }} />
            )}
        </Card>
    );
};

export default Checkout;