import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Layout, Menu, Dropdown, Avatar, Button, Input, Badge, Typography, Space, message } from 'antd';
import { UserOutlined, ShoppingCartOutlined, DownOutlined, LogoutOutlined, GiftOutlined, HomeOutlined, SearchOutlined, DashboardOutlined } from '@ant-design/icons';

const { Header } = Layout;
const { Text } = Typography;

// Get user from token
const getUserFromToken = () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return null;
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload;
    } catch {
        return null;
    }
};

// ...existing code...
const NavBar: React.FC = () => {
    const [search, setSearch] = useState('');
    const [cartQuantity, setCartQuantity] = useState(0); // Default 0, update when item is added
    const user = getUserFromToken();
    const history = useHistory();

    const handleLogout = () => {
        localStorage.removeItem('token');
        history.push('/login');
        window.location.reload();
    };

    // Dropdown menu for user roles
    const getDropdownMenu = () => {
        if (!user) {
            // Return an empty menu to satisfy type requirements
            return <Menu />;
        }
        if (user.role === 'artisan') {
            return (
                <Menu>
                    <Menu.Item key="seller-request">
                        <Link to="/artisan-request"><GiftOutlined /> Seller Request</Link>
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
                        Log Out
                    </Menu.Item>
                </Menu>
            );
        }
        if (user.role === 'admin') {
            return (
                <Menu>
                    <Menu.Item key="admin-dashboard">
                        <Link to="/admin-dashboard"><DashboardOutlined /> Admin Dashboard</Link>
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
                        Log Out
                    </Menu.Item>
                </Menu>
            );
        }
        // Customer
        return (
            <Menu>
                <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
                    Log Out
                </Menu.Item>
            </Menu>
        );
    };

    return (
        <>
            {/* Promo Bar */}
            <div style={{ background: '#deb887', color: '#222', textAlign: 'center', padding: '10px 0', fontSize: '1rem' }}>
                Get 15% off your first purchase. Sign up. + Free shipping on orders over $75
            </div>
            <Header style={{ background: '#fafafa', borderBottom: '1px solid #eee', padding: 0, height: 'auto' }}>
                <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', height: 64 }}>
                    {/* Left nav */}
                    <Menu mode="horizontal" selectable={false} style={{ borderBottom: 'none', background: 'transparent', fontWeight: 500, fontSize: 16, minWidth: 400 }}>
                        <Menu.Item key="shop" icon={<HomeOutlined />}>
                            <Link to="/">SHOP</Link>
                        </Menu.Item>
                        <Menu.Item key="our-story">
                            <Link to="/our-story">OUR STORY</Link>
                        </Menu.Item>
                        {user && user.role === 'artisan' && (
                            <Menu.Item key="dashboard">
                                <Link to="/dashboard">DASHBOARD</Link>
                            </Menu.Item>
                        )}
                        <Menu.Item key="gift-card" icon={<GiftOutlined />}>
                            <Link to="/gift-card">GIFT CARD</Link>
                        </Menu.Item>
                    </Menu>
                    {/* Center logo/title */}
                    <div style={{ fontWeight: 700, fontSize: '1.7rem', fontFamily: 'inherit', letterSpacing: '-1px' }}>
                        Handmade Hub
                    </div>
                    {/* Right nav */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <Space size={0} align="center" style={{ gap: 24, height: 64 }}>
                            {/* User icon and Login link */}
                            {user ? (
                                <Dropdown overlay={getDropdownMenu()} placement="bottomRight" trigger={["click"]}>
                                    <Button type="text" style={{ display: 'flex', alignItems: 'center', height: 40, marginTop: 2, paddingLeft: 0, fontWeight: 500, color: '#222', background: 'none', border: 'none', boxShadow: 'none' }}>
                                        <UserOutlined style={{ fontSize: 20, marginRight: 6 }} />
                                        {user.name || user.email || user.role}
                                    </Button>
                                </Dropdown>
                            ) : (
                                <Button type="link" onClick={() => history.push('/login')} icon={<UserOutlined />} style={{ display: 'flex', alignItems: 'center', height: 40, marginTop: 2, paddingLeft: 0 }}>Log In</Button>
                            )}
                            {/* Cart icon with item count */}
                            {cartQuantity > 0 ? (
                                <Badge count={cartQuantity} size="small" offset={[-2, 2]}>
                                    <Button type="text" onClick={() => history.push('/cart')} icon={<ShoppingCartOutlined style={{ fontSize: 22, verticalAlign: 'middle' }} />} style={{ display: 'flex', alignItems: 'center', height: 40, marginTop: 2, padding: 0 }} />
                                </Badge>
                            ) : (
                                <Button type="text" onClick={() => history.push('/cart')} icon={<ShoppingCartOutlined style={{ fontSize: 22, verticalAlign: 'middle' }} />} style={{ display: 'flex', alignItems: 'center', height: 40, marginTop: 2, padding: 0 }} />
                            )}
                            {/* Search Bar */}
                            <div style={{ display: 'flex', alignItems: 'center', height: 40, marginLeft: 8 }}>
                                <input
                                    type="text"
                                    placeholder="Search products"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    style={{
                                        height: 40,
                                        border: 'none',
                                        outline: 'none',
                                        borderRadius: '30px 0 0 30px',
                                        background: '#fff',
                                        fontSize: 16,
                                        paddingLeft: 16,
                                        width: 200,
                                    }}
                                />
                                <button
                                    onClick={() => message.info(`Searching for: ${search}`)}
                                    style={{
                                        height: 40,
                                        width: 48,
                                        minWidth: 40,
                                        border: 'none',
                                        borderRadius: '0 30px 30px 0',
                                        background: '#deb887',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        marginLeft: 0,
                                        padding: 0,
                                    }}
                                    aria-label="Search"
                                >
                                    <SearchOutlined style={{ color: '#fff', fontSize: 20 }} />
                                </button>
                            </div>
                        </Space>

                    </div>
                </div>
            </Header>
        </>
    );
};

export default NavBar;
