import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { fetchProducts } from '../services/api';
import axios from 'axios';
import { Input, Select, Row, Col, Spin, Alert, Typography } from 'antd';

const { Search } = Input;
const { Option } = Select;
const { Title } = Typography;

// Updated Product type to match backend
interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    category?: string;
    stock?: number;
    rating?: number;
    reviewsCount?: number;
}

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                let productList;
                if (search || category) {
                    const params: any = {};
                    if (search) params.query = search;
                    if (category) params.category = category;
                    const res = await axios.get('/api/products/search', { params });
                    productList = res.data;
                } else {
                    productList = await fetchProducts();
                }
                setProducts(productList);
                // Collect unique categories
                setCategories(Array.from(new Set(productList.map((p: Product) => p.category).filter(Boolean))));
            } catch (err) {
                setError('Failed to load products');
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [search, category]);

    const handleAddToCart = (productId: string) => {
        // Add to cart logic here (update to use _id)
        // TODO: Replace alert with Ant Design message or notification if desired
        alert(`Added product ${productId} to cart!`);
    };

    if (loading) {
        return <Spin tip="Loading products..." style={{ width: '100%', marginTop: 80 }} />;
    }

    if (error) {
        return <Alert message={error} type="error" showIcon style={{ margin: 40 }} />;
    }

    return (
        <div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
                <Search
                    placeholder="Search products..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onSearch={value => setSearch(value)}
                    style={{ minWidth: 220 }}
                    allowClear
                />
                <Select
                    value={category}
                    onChange={value => setCategory(value)}
                    style={{ minWidth: 180 }}
                >
                    <Option value="">All Categories</Option>
                    {categories.map(cat => (
                        <Option key={cat} value={cat}>{cat}</Option>
                    ))}
                </Select>
            </div>
            <Row gutter={[24, 24]} className="product-list">
                {products.map(product => (
                    <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
                        <ProductCard product={product} onAddToCart={handleAddToCart} />
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default ProductList;