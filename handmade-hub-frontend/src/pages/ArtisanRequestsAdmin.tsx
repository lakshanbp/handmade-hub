import React, { useEffect, useState } from 'react';
import { fetchArtisanRequests, handleArtisanRequest, deleteArtisanRequest } from '../services/api';
import { Table, Button, Typography, Alert, Spin, Modal, Space, Card } from 'antd';

const { Title } = Typography;

interface ArtisanRequest {
    _id: string;
    user: { name: string; email: string };
    status: string;
    createdAt: string;
}

const ArtisanRequestsAdmin: React.FC = () => {
    const [requests, setRequests] = useState<ArtisanRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const loadRequests = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await fetchArtisanRequests();
            setRequests(data);
        } catch (err: any) {
            setError(err?.response?.data?.error || 'Failed to load requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadRequests(); }, []);

    const handleAction = async (id: string, status: 'approved' | 'rejected') => {
        try {
            await handleArtisanRequest(id, status);
            setSuccess(`Request ${status}`);
            loadRequests();
        } catch (err: any) {
            setError(err?.response?.data?.error || 'Action failed');
        }
    };
    const handleDelete = async (id: string) => {
        Modal.confirm({
            title: 'Delete this request?',
            content: 'Are you sure you want to delete this request?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    await deleteArtisanRequest(id);
                    setSuccess('Request deleted');
                    loadRequests();
                } catch (err: any) {
                    setError(err?.response?.data?.error || 'Delete failed');
                }
            }
        });
    };

    const columns = [
        { title: 'User', dataIndex: ['user', 'name'], key: 'user' },
        { title: 'Email', dataIndex: ['user', 'email'], key: 'email' },
        { title: 'Status', dataIndex: 'status', key: 'status' },
        { title: 'Created', dataIndex: 'createdAt', key: 'createdAt', render: (v: string) => new Date(v).toLocaleString() },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: ArtisanRequest) => (
                <Space>
                    {record.status === 'pending' && <>
                        <Button onClick={() => handleAction(record._id, 'approved')} type="link">Approve</Button>
                        <Button onClick={() => handleAction(record._id, 'rejected')} type="link" danger>Reject</Button>
                    </>}
                    <Button onClick={() => handleDelete(record._id)} type="link" danger>Delete</Button>
                </Space>
            )
        }
    ];

    return (
        <div style={{ maxWidth: 900, margin: '40px auto' }}>
            <Card bordered={false} style={{ borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: 32 }}>
                <Title level={2}>Artisan Requests</Title>
                {loading ? <Spin tip="Loading..." style={{ width: '100%', marginTop: 40 }} /> :
                    error ? <Alert message={error} type="error" showIcon style={{ margin: 40 }} /> :
                        <Table columns={columns} dataSource={requests} rowKey="_id" pagination={{ pageSize: 8 }} />
                }
                {success && <Alert message={success} type="success" showIcon style={{ marginTop: 16 }} />}
            </Card>
        </div>
    );
};

export default ArtisanRequestsAdmin;
