import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { getProductById, fetchReviewsByProduct, submitReview, fetchProductAnalytics } from '../services/api';
import {
    Layout,
    Row,
    Col,
    Card,
    Typography,
    Button,
    Rate,
    Collapse,
    Image,
    Breadcrumb,
    InputNumber,
    Alert,
    Spin,
    Form,
    Input,
    Tag,
    Divider
} from 'antd';
import { ShoppingCartOutlined, DollarOutlined, InfoCircleOutlined } from '@ant-design/icons';
import './ProductDetails.css';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

interface Product {
    _id: string;
    name: string;
    images: string[];
    description: string;
    price: number;
    category?: string;
    stock?: number;
    rating?: number;
    reviewsCount?: number;
}

interface Review {
    _id: string;
    customer: { name: string };
    rating: number;
    comment: string;
    createdAt: string;
}

interface RouteParams {
    id: string;
}

const colorOptions = [
  { color: '#e5e5e0', label: 'White' },
  { color: '#e5e2de', label: 'Beige' },
  { color: '#a47a53', label: 'Brown' },
];

const ProductDetails: React.FC = () => {
    const { id } = useParams<RouteParams>();
    const history = useHistory();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [reviewText, setReviewText] = useState('');
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewError, setReviewError] = useState('');
    const [selectedColor, setSelectedColor] = useState(colorOptions[0].color);
    const [quantity, setQuantity] = useState(1);
    const [analytics, setAnalytics] = useState<{ salesCount: number } | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getProductById(id);
                setProduct(data);
                const revs = await fetchReviewsByProduct(id);
                setReviews(revs);
                const analyticsRes = await fetchProductAnalytics(id);
                setAnalytics(analyticsRes);
            } catch (err) {
                setError('Failed to fetch product details');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleReviewSubmit = async (values: { reviewText: string; reviewRating: number }) => {
        try {
            await submitReview(id, { rating: values.reviewRating, comment: values.reviewText });
            setReviewText('');
            setReviewRating(5);
            form.resetFields();
            const revs = await fetchReviewsByProduct(id);
            setReviews(revs);
            setReviewError('');
        } catch (err: any) {
            setReviewError(err?.response?.data?.error || 'Failed to submit review');
        }
    };

    const handleViewProductInfo = () => {
        if (!product) return;
        history.push({
            pathname: '/product-info',
            state: {
                product: {
                    name: product.name,
                    image: product.images[0],
                    description: product.description,
                    shipping: 'Ships within 2-5 business days. Free shipping on orders over $75.'
                }
            }
        });
    };

    if (loading) return <Spin tip="Loading..." style={{ width: '100%', marginTop: 80 }} />;
    if (error) return <Alert message={error} type="error" showIcon style={{ margin: 40 }} />;
    if (!product) return <Alert message="Product not found." type="warning" showIcon style={{ margin: 40 }} />;

    return (
        <Layout style={{ background: '#fff', minHeight: '100vh' }}>
            <Content style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px' }}>
                <Breadcrumb style={{ marginBottom: 24 }}>
                    <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                    <Breadcrumb.Item>{product.name}</Breadcrumb.Item>
                </Breadcrumb>
                <Row gutter={[48, 32]}>
                    <Col xs={24} md={12}>
                        <Card bordered={false} style={{ boxShadow: '0 2px 8px #f0f1f2', borderRadius: 12 }}>
                            <Image
                                src={product.images && product.images.length > 0 ? product.images[0] : '/images/image_1.jpg'}
                                alt={product.name}
                                width="100%"
                                style={{ borderRadius: 12, objectFit: 'cover', maxHeight: 420 }}
                                fallback="/images/image_1.jpg"
                            />
                        </Card>
                    </Col>
                    <Col xs={24} md={12}>
                        <Card bordered={false} style={{ boxShadow: '0 2px 8px #f0f1f2', borderRadius: 12 }}>
                            <Title level={2} style={{ marginBottom: 8 }}>{product.name}</Title>
                            <Text strong style={{ fontSize: 22, color: '#222' }}>${product.price}</Text>
                            <div style={{ margin: '18px 0' }}>
                                <Text type="secondary">{product.description}</Text>
                            </div>
                            <div style={{ marginBottom: 18 }}>
                                <Text strong>Color: </Text>
                                {colorOptions.map(opt => (
                                    <Tag
                                        key={opt.color}
                                        color={selectedColor === opt.color ? 'processing' : ''}
                                        style={{
                                            background: opt.color,
                                            border: selectedColor === opt.color ? '2px solid #1890ff' : '1px solid #ccc',
                                            borderRadius: 6,
                                            marginRight: 8,
                                            cursor: 'pointer',
                                            width: 32,
                                            height: 28,
                                            display: 'inline-block',
                                        }}
                                        onClick={() => setSelectedColor(opt.color)}
                                    >
                                        {opt.label}
                                    </Tag>
                                ))}
                            </div>
                            <div style={{ marginBottom: 18 }}>
                                <Text strong>Quantity: </Text>
                                <InputNumber min={1} max={product.stock || 99} value={quantity} onChange={(v: number | null) => setQuantity(Number(v) || 1)} style={{ width: 80 }} />
                            </div>
                            <Row gutter={12} style={{ marginBottom: 24 }}>
                                <Col span={12}>
                                    <Button type="primary" icon={<ShoppingCartOutlined />} block>Add to Cart</Button>
                                </Col>
                                <Col span={12}>
                                    <Button icon={<DollarOutlined />} block>Buy Now</Button>
                                </Col>
                            </Row>
                            <Collapse defaultActiveKey={['1']} ghost>
                                <Panel header={<span><InfoCircleOutlined /> Product Info</span>} key="1">
                                    <Paragraph>{product.description}</Paragraph>
                                </Panel>
                                <Panel header="Return & Refund Policy" key="2">
                                    <Paragraph>Returns accepted within 30 days of delivery. See our full policy for details.</Paragraph>
                                </Panel>
                                <Panel header="Shipping Info" key="3">
                                    <Paragraph>Ships within 2-5 business days. Free shipping on orders over $75.</Paragraph>
                                </Panel>
                            </Collapse>
                            {analytics && (
                                <div style={{ marginTop: 18 }}>
                                    <Text type="secondary"><strong>Sales Count:</strong> {analytics.salesCount}</Text>
                                </div>
                            )}
                            <Divider />
                            <Button type="link" onClick={handleViewProductInfo}>View More Product Info</Button>
                        </Card>
                    </Col>
                </Row>
                <Divider orientation="left">Customer Reviews</Divider>
                <Row gutter={[24, 24]}>
                    <Col xs={24} md={14}>
                        {reviews.length === 0 ? (
                            <Text type="secondary">No reviews yet.</Text>
                        ) : (
                            reviews.map(review => (
                                <Card key={review._id} style={{ marginBottom: 16 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                                        <Text strong>{review.customer.name}</Text>
                                        <Rate value={review.rating} disabled style={{ marginLeft: 12, fontSize: 16 }} />
                                        <Text type="secondary" style={{ marginLeft: 16, fontSize: 12 }}>{new Date(review.createdAt).toLocaleDateString()}</Text>
                                    </div>
                                    <Paragraph>{review.comment}</Paragraph>
                                </Card>
                            ))
                        )}
                    </Col>
                    <Col xs={24} md={10}>
                        <Card title="Write a Review" bordered={false}>
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={handleReviewSubmit}
                                initialValues={{ reviewRating: 5, reviewText: '' }}
                            >
                                <Form.Item name="reviewRating" label="Rating" rules={[{ required: true, message: 'Please select a rating' }]}> 
                                    <Rate value={reviewRating} onChange={(v: number) => { setReviewRating(v); form.setFieldsValue({ reviewRating: v }); }} />
                                </Form.Item>
                                <Form.Item name="reviewText" label="Comment" rules={[{ required: true, message: 'Please enter your review' }]}> 
                                    <Input.TextArea rows={3} value={reviewText} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => { setReviewText(e.target.value); form.setFieldsValue({ reviewText: e.target.value }); }} />
                                </Form.Item>
                                {reviewError && <Alert message={reviewError} type="error" showIcon style={{ marginBottom: 12 }} />}
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" block>Submit Review</Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default ProductDetails;