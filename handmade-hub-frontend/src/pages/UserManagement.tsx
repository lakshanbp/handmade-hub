import React, { useEffect, useState } from 'react';
import { fetchUsers, deleteUser } from '../services/api';
import { Table, Button, Typography, Alert, Spin, Modal, Card, Space } from 'antd';

const { Title } = Typography;

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    artisanStatus: string;
}

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const loadUsers = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await fetchUsers();
            setUsers(data);
        } catch (err: any) {
            setError(err?.response?.data?.error || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadUsers(); }, []);

    const handleDelete = async (id: string) => {
        Modal.confirm({
            title: 'Delete this user?',
            content: 'Are you sure you want to delete this user?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    await deleteUser(id);
                    setSuccess('User deleted');
                    loadUsers();
                } catch (err: any) {
                    setError(err?.response?.data?.error || 'Delete failed');
                }
            }
        });
    };

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Role', dataIndex: 'role', key: 'role' },
        { title: 'Artisan Status', dataIndex: 'artisanStatus', key: 'artisanStatus' },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: User) => (
                <Space>
                    <Button onClick={() => handleDelete(record._id)} type="link" danger>Delete</Button>
                </Space>
            )
        }
    ];

    return (
        <div style={{ maxWidth: 900, margin: '40px auto' }}>
            <Card bordered={false} style={{ borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: 32 }}>
                <Title level={2}>User Management</Title>
                {loading ? <Spin tip="Loading..." style={{ width: '100%', marginTop: 40 }} /> :
                    error ? <Alert message={error} type="error" showIcon style={{ margin: 40 }} /> :
                        <Table columns={columns} dataSource={users} rowKey="_id" pagination={{ pageSize: 8 }} />
                }
                {success && <Alert message={success} type="success" showIcon style={{ marginTop: 16 }} />}
            </Card>
        </div>
    );
};

export default UserManagement;
