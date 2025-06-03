import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Typography, Alert, Card, Spin } from 'antd';

const { Title, Text } = Typography;

const ForgotPassword: React.FC = () => {
    const [form] = Form.useForm();
    const [email, setEmail] = useState('');
    const [messageText, setMessageText] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setMessageText('');
        setError('');
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setMessageText('If an account with that email exists, a password reset link has been sent.');
        }, 1200);
    };

    return (
        <div style={{ maxWidth: 400, margin: '40px auto' }}>
            <Card bordered={false} style={{ borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: 32 }}>
                <Title level={2}>Forgot Password</Title>
                <Text style={{ color: '#555', marginBottom: 18, display: 'block' }}>Enter your email address and we'll send you a link to reset your password.</Text>
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please enter your email', type: 'email' }]}>
                        <Input value={email} onChange={e => setEmail(e.target.value)} />
                    </Form.Item>
                    {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 12 }} />}
                    {messageText && <Alert message={messageText} type="success" showIcon style={{ marginBottom: 12 }} />}
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </Button>
                    </Form.Item>
                </Form>
                <div style={{ marginTop: 18, textAlign: 'center' }}>
                    <Link to="/login" style={{ color: '#007bff', textDecoration: 'underline', fontWeight: 500 }}>Back to Login</Link>
                </div>
            </Card>
        </div>
    );
};

export default ForgotPassword;
