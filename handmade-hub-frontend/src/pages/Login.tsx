import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { loginUser } from '../services/api';
import { Form, Input, Button, Typography, Alert, Card } from 'antd';

const { Title } = Typography;

const Login: React.FC = () => {
    const [form] = Form.useForm();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const handleLogin = async (values: { email: string; password: string }) => {
        setError('');
        setLoading(true);
        try {
            await loginUser({ email: values.email, password: values.password });
            history.push('/');
        } catch (err: any) {
            setError(err?.response?.data?.error || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '40px auto' }}>
            <Card bordered={false} style={{ borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: 32 }}>
                <Title level={2}>Login</Title>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleLogin}
                >
                    <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please enter your email', type: 'email' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please enter your password' }]}>
                        <Input.Password />
                    </Form.Item>
                    {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 12 }} />}
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </Form.Item>
                </Form>
                <div style={{ marginTop: 18, textAlign: 'center' }}>
                    <span style={{ color: '#555', fontSize: '0.97rem' }}>Don't have an account? </span>
                    <Link to="/register" style={{ color: '#007bff', textDecoration: 'underline', fontWeight: 500 }}>Sign up</Link>
                </div>
                <div style={{ marginTop: 10, textAlign: 'center' }}>
                    <Link to="/forgot-password" style={{ color: '#007bff', textDecoration: 'underline', fontWeight: 500 }}>Forgot your password?</Link>
                </div>
            </Card>
        </div>
    );
};

export default Login;