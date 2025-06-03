import React, { useState } from 'react';
import { useLocation, useHistory, Link } from 'react-router-dom';
import { resetPassword } from '../services/api';
import { Form, Input, Button, Typography, Alert, Card } from 'antd';

const { Title } = Typography;

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const ResetPassword: React.FC = () => {
    const query = useQuery();
    const history = useHistory();
    const [form] = Form.useForm();
    const [messageText, setMessageText] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const token = query.get('token') || '';

    const handleSubmit = async (values: { password: string; confirmPassword: string }) => {
        setMessageText('');
        setError('');
        if (!token) {
            setError('Invalid or missing token.');
            return;
        }
        if (values.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        if (values.password !== values.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setLoading(true);
        try {
            await resetPassword(token, values.password);
            setMessageText('Password reset successful! You can now log in.');
            setTimeout(() => history.push('/login'), 1800);
        } catch (err: any) {
            setError(err?.response?.data?.error || 'Reset failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '40px auto' }}>
            <Card bordered={false} style={{ borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: 32 }}>
                <Title level={2}>Reset Password</Title>
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item name="password" label="New Password" rules={[{ required: true, message: 'Please enter your new password' }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item name="confirmPassword" label="Confirm Password" rules={[{ required: true, message: 'Please confirm your password' }]}>
                        <Input.Password />
                    </Form.Item>
                    {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 12 }} />}
                    {messageText && <Alert message={messageText} type="success" showIcon style={{ marginBottom: 12 }} />}
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>
                            {loading ? 'Resetting...' : 'Reset Password'}
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

export default ResetPassword;
