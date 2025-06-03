import React, { useEffect, useState } from 'react';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../services/api';
import {
    Layout,
    Table,
    Button,
    Form,
    Input,
    InputNumber,
    Space,
    Typography,
    Alert,
    Spin,
    message,
    Modal,
    Card
} from 'antd';

const { Content } = Layout;
const { Title } = Typography;

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    category?: string;
    stock?: number;
}

const ProductManagement: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [form] = Form.useForm();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [success, setSuccess] = useState('');

    const loadProducts = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await fetchProducts();
            setProducts(data);
        } catch (err: any) {
            setError(err?.response?.data?.error || 'Failed to load products');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => { loadProducts(); }, []);

    const handleEdit = (product: Product) => {
        setEditingId(product._id);
        setModalVisible(true);
        form.setFieldsValue(product);
    };
    const handleDelete = async (id: string) => {
        Modal.confirm({
            title: 'Delete this product?',
            content: 'Are you sure you want to delete this product?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    await deleteProduct(id);
                    message.success('Product deleted');
                    loadProducts();
                } catch (err: any) {
                    setError(err?.response?.data?.error || 'Delete failed');
                }
            }
        });
    };
    const handleModalCancel = () => {
        setModalVisible(false);
        setEditingId(null);
        form.resetFields();
    };
    const handleFinish = async (values: any) => {
        try {
            if (editingId) {
                await updateProduct(editingId, values);
                message.success('Product updated');
            } else {
                await createProduct(values);
                message.success('Product created');
            }
            setModalVisible(false);
            setEditingId(null);
            form.resetFields();
            loadProducts();
        } catch (err: any) {
            setError(err?.response?.data?.error || 'Save failed');
        }
    };

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Description', dataIndex: 'description', key: 'description' },
        { title: 'Price', dataIndex: 'price', key: 'price', render: (v: number) => `$${v}` },
        { title: 'Category', dataIndex: 'category', key: 'category' },
        { title: 'Stock', dataIndex: 'stock', key: 'stock' },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Product) => (
                <Space>
                    <Button onClick={() => handleEdit(record)} type="link">Edit</Button>
                    <Button onClick={() => handleDelete(record._id)} type="link" danger>Delete</Button>
                </Space>
            )
        }
    ];

    return (
        <Layout style={{ background: '#fff', minHeight: '100vh' }}>
            <Content style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 16px' }}>
                <Title level={2}>Product Management</Title>
                <Card bordered={false} style={{ marginBottom: 24 }}>
                    <Button type="primary" onClick={() => { setModalVisible(true); setEditingId(null); form.resetFields(); }}>Add Product</Button>
                </Card>
                {loading ? <Spin tip="Loading..." style={{ width: '100%', marginTop: 40 }} /> :
                    error ? <Alert message={error} type="error" showIcon style={{ margin: 40 }} /> :
                        <Table columns={columns} dataSource={products} rowKey="_id" pagination={{ pageSize: 8 }} />
                }
                <Modal
                    title={editingId ? 'Edit Product' : 'Add Product'}
                    open={modalVisible}
                    onCancel={handleModalCancel}
                    footer={null}
                    destroyOnClose
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleFinish}
                        initialValues={{ name: '', description: '', price: 0, category: '', stock: 0 }}
                    >
                        <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter product name' }]}> <Input /> </Form.Item>
                        <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please enter description' }]}> <Input /> </Form.Item>
                        <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please enter price' }]}> <InputNumber min={0} style={{ width: '100%' }} /> </Form.Item>
                        <Form.Item name="category" label="Category"> <Input /> </Form.Item>
                        <Form.Item name="stock" label="Stock"> <InputNumber min={0} style={{ width: '100%' }} /> </Form.Item>
                        <Form.Item>
                            <Space>
                                <Button type="primary" htmlType="submit">{editingId ? 'Update' : 'Create'}</Button>
                                <Button onClick={handleModalCancel}>Cancel</Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Modal>
            </Content>
        </Layout>
    );
};

export default ProductManagement;
