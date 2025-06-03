import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import ProductList from '../components/ProductList';
import CommunitySupport from '../components/CommunitySupport';
import { fetchProducts } from '../services/api';
import { Layout, Card, Button, Typography, Row, Col, Spin, Alert, Divider } from 'antd';

const { Content } = Layout;
const { Title, Text } = Typography;

const Home: React.FC = () => {
    const history = useHistory();
    const [products, setProducts] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await fetchProducts();
                setProducts(data);
            } catch (err) {
                setError('Failed to load products');
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, []);

    const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
    const trendingProducts = products.slice(0, 4);
    const filteredProducts = selectedCategory ? products.filter(p => p.category === selectedCategory) : [];

    return (
        <Layout style={{ background: '#fff', minHeight: '100vh' }}>
            <Content style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px' }}>
                {selectedCategory ? (
                    <Card style={{ margin: '32px 0', maxWidth: 900, width: '100%', marginLeft: 'auto', marginRight: 'auto', padding: 32 }}>
                        <Button onClick={() => setSelectedCategory(null)} style={{ marginBottom: 18 }}>Back to Categories</Button>
                        <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>{selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Products</Title>
                        {loading ? <Spin /> : error ? <Alert message={error} type="error" showIcon /> : (
                            <Row gutter={[32, 32]} justify="center" align="top">
                                {filteredProducts.length === 0 ? <Text>No products found in this category.</Text> : filteredProducts.map(product => (
                                    <Col key={product._id} xs={24} sm={12} md={8} lg={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'stretch' }}>
                                        <Card
                                            hoverable
                                            cover={<img src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder.jpg'} alt={product.name} style={{ borderRadius: 12, maxHeight: 160, objectFit: 'cover', width: '100%', margin: '0 auto' }} />}
                                            style={{ borderRadius: 16, margin: '0 auto', width: 260, minHeight: 420, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', justifyContent: 'flex-start', boxShadow: '0 2px 8px #f0f1f2' }}
                                        >
                                            <Title level={4} style={{ whiteSpace: 'normal', wordBreak: 'break-word', margin: '16px 0 8px 0', fontSize: 22, lineHeight: 1.2 }}>{product.name}</Title>
                                            <Text style={{ display: 'block', marginBottom: 12, fontSize: 15, color: '#444', whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: 1.5 }}>{product.description}</Text>
                                            <div style={{ color: '#1890ff', fontWeight: 700, fontSize: '1.18rem', margin: '12px 0' }}>${product.price.toFixed(2)}</div>
                                            <Button type="primary" block style={{ width: 100, margin: '0 auto' }} onClick={() => history.push(`/products/${product._id}`)}>View</Button>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </Card>
                ) : (
                    <>
                        <Card style={{
                            background: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.25)), url('https://images.unsplash.com/photo-1515168833906-d2a3b82b302b?auto=format&fit=crop&w=1200&q=80') center/cover no-repeat`,
                            padding: '60px 0 40px 0',
                            textAlign: 'center',
                            color: '#fff',
                            marginBottom: 32,
                            position: 'relative',
                            overflow: 'hidden',
                        }} bordered={false}>
                            {/* Animated Ant Design hero bubbles for Home page */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                zIndex: 0,
                                pointerEvents: 'none',
                                overflow: 'hidden',
                            }}>
                                <div className="ant-hero-bubbles">
                                    {[...Array(12)].map((_, i) => (
                                        <div key={i} className="ant-hero-bubble" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 6}s` }} />
                                    ))}
                                </div>
                            </div>
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <Title style={{ color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.18)' }}>Discover Unique Handmade Goods</Title>
                                <Text style={{ color: '#f3f3f3', fontSize: '1.2rem', textShadow: '0 1px 6px rgba(0,0,0,0.18)' }}>
                                    Shop artisan-crafted homeware, accessories, gifts, and more. Support local makers and find something truly special.
                                </Text>
                                <div style={{ marginTop: 32 }}>
                                    <a href="#shop" style={{ background: '#222', color: '#fff', padding: '14px 36px', borderRadius: '30px', fontSize: '1.1rem', textDecoration: 'none', fontWeight: 600, letterSpacing: '0.02em', transition: 'background 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }}>Shop All Products</a>
                                </div>
                            </div>
                        </Card>
                        <Row gutter={[32, 32]} justify="center" style={{ margin: '48px 0 32px 0' }}>
                            {['homeware', 'accessories', 'planters', 'gifts'].map(cat => (
                                <Col key={cat} xs={24} sm={12} md={6}>
                                    <Card
                                        hoverable
                                        onClick={() => setSelectedCategory(cat)}
                                        cover={<img src={`/images/image_${cat === 'homeware' ? 4 : cat === 'accessories' ? 5 : cat === 'planters' ? 6 : 7}.jpg`} alt={cat} style={{ borderRadius: 8, maxHeight: 120, objectFit: 'cover' }} />}
                                        style={{ borderRadius: 10, textAlign: 'center', cursor: 'pointer' }}
                                    >
                                        <Title level={4}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</Title>
                                        <Text type="secondary">Shop {cat.charAt(0).toUpperCase() + cat.slice(1)}</Text>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                        <Divider orientation="left">All Products</Divider>
                        {loading ? <Spin /> : error ? <Alert message={error} type="error" showIcon /> : <ProductList />}
                        <Divider orientation="left">Trending Products</Divider>
                        <Row gutter={[32, 32]} justify="start" align="top">
                            {trendingProducts.length === 0 ? <Text>No trending products.</Text> : trendingProducts.map(product => (
                                <Col key={product._id} xs={24} sm={12} md={8} lg={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'stretch' }}>
                                    <Card
                                        hoverable
                                        cover={<img src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder.jpg'} alt={product.name} style={{ borderRadius: 12, maxHeight: 180, objectFit: 'cover', width: '100%', margin: '0 auto' }} />}
                                        style={{ borderRadius: 16, margin: '0 auto', width: 320, minHeight: 420, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', justifyContent: 'flex-start', boxShadow: '0 2px 8px #f0f1f2' }}
                                    >
                                        <Title level={4} style={{ whiteSpace: 'normal', wordBreak: 'break-word', margin: '16px 0 8px 0', fontSize: 26, lineHeight: 1.2 }}>{product.name}</Title>
                                        <Text style={{ display: 'block', marginBottom: 12, fontSize: 16, color: '#444', whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: 1.5 }}>{product.description}</Text>
                                        <div style={{ color: '#1890ff', fontWeight: 700, fontSize: '1.3rem', margin: '12px 0' }}>${product.price.toFixed(2)}</div>
                                        <Button type="primary" block style={{ width: 180, margin: '0 auto' }} onClick={() => history.push(`/products/${product._id}`)}>View</Button>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                        <Divider />
                        <CommunitySupport />
                    </>
                )}
            </Content>
        </Layout>
    );
};

export default Home;