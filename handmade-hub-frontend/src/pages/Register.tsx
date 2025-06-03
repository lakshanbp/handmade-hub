import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { registerUser } from '../services/api';
import { Form, Input, Button, Select, Typography, Alert, Card, Spin } from 'antd';

const { Title, Text } = Typography;
const { Option } = Select;

const Register = () => {
    const [form] = Form.useForm();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const handleSubmit = async (values: any) => {
        setError('');
        setSuccess('');
        setLoading(true);
        if (values.password !== values.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }
        try {
            await registerUser({ name: values.name, email: values.email, password: values.password, role: values.role });
            setSuccess('Registration successful! Please log in.');
            setTimeout(() => history.push('/login'), 1200);
        } catch (err: any) {
            setError(err?.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 420, margin: '40px auto' }}>
            <Card bordered={false} style={{ borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: 32 }}>
                <Title level={2}>Register</Title>
                <Text style={{fontSize: '0.95rem', color: '#555', marginBottom: '10px', display: 'block'}}>Choose your account type. You can register as a customer or as a seller (artisan). Seller accounts will require approval before you can list products.</Text>
                {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 12 }} />}
                {success && <Alert message={success} type="success" showIcon style={{ marginBottom: 12 }} />}
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{ role: 'customer' }}
                >
                    <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter your name' }]}> <Input /> </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please enter your email', type: 'email' }]}> <Input /> </Form.Item>
                    <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please enter your password' }]}> <Input.Password /> </Form.Item>
                    <Form.Item name="confirmPassword" label="Confirm Password" rules={[{ required: true, message: 'Please confirm your password' }]}> <Input.Password /> </Form.Item>
                    <Form.Item name="role" label="Account Type" rules={[{ required: true, message: 'Please select account type' }]}> 
                        <Select>
                            <Option value="customer">Customer</Option>
                            <Option value="artisan">Seller (Artisan)</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>Register</Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Register;