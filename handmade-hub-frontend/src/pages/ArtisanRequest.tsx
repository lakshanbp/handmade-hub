import React, { useState } from 'react';
import { Form, Input, Button, Typography, Card, Alert } from 'antd';

const { Title, Paragraph } = Typography;

const ArtisanRequest: React.FC = () => {
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        shopName: '',
        description: '',
        portfolio: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setError('');
        if (!formState.name || !formState.email || !formState.shopName || !formState.description) {
            setError('Please fill in all required fields.');
            return;
        }
        setTimeout(() => {
            setSubmitted(true);
        }, 800);
    };

    // Get user from token
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

    if (!user || user.role !== 'artisan') {
        return (
            <Card style={{ maxWidth: 500, margin: '60px auto', padding: 32, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', textAlign: 'center', color: '#d8000c', fontWeight: 600 }}>
                Only artisan accounts can access this page.
            </Card>
        );
    }

    if (submitted) {
        return (
            <Card style={{ maxWidth: 500, margin: '60px auto', padding: 32, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', textAlign: 'center' }}>
                <Title level={2} style={{ fontWeight: 700, marginBottom: 18 }}>Request Submitted!</Title>
                <Paragraph style={{ fontSize: '1.1rem', color: '#333' }}>Thank you for your interest in joining Handmade Hub as an artisan seller. Our team will review your request and get in touch soon.</Paragraph>
            </Card>
        );
    }

    return (
        <Card style={{ maxWidth: 600, margin: '60px auto', padding: 32, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            <Title level={2} style={{ fontWeight: 700, fontSize: '2rem', marginBottom: 18, textAlign: 'center' }}>Artisan Seller Request</Title>
            <Paragraph style={{ textAlign: 'center', color: '#555', marginBottom: 28 }}>
                Interested in selling your handmade goods on Handmade Hub? Fill out the form below and our team will review your request.
            </Paragraph>
            <Form layout="vertical" onFinish={handleSubmit}>
                <Form.Item label="Full Name *" required>
                    <Input name="name" value={formState.name} onChange={handleChange} />
                </Form.Item>
                <Form.Item label="Email *" required>
                    <Input name="email" type="email" value={formState.email} onChange={handleChange} />
                </Form.Item>
                <Form.Item label="Shop Name *" required>
                    <Input name="shopName" value={formState.shopName} onChange={handleChange} />
                </Form.Item>
                <Form.Item label="Tell us about your work *" required>
                    <Input.TextArea name="description" value={formState.description} onChange={handleChange} rows={4} />
                </Form.Item>
                <Form.Item label="Portfolio/Website (optional)">
                    <Input name="portfolio" type="url" value={formState.portfolio} onChange={handleChange} placeholder="https://yourportfolio.com" />
                </Form.Item>
                {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
                <Form.Item>
                    <Button type="primary" htmlType="submit" block>Submit Request</Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default ArtisanRequest;
