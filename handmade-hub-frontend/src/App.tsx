import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import { Button } from 'antd';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetails from './pages/ProductDetails';
import NotFound from './pages/NotFound';
import ArtisanDashboard from './components/ArtisanDashboard';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import AdminPanel from './components/AdminPanel';
import Ratings from './components/Ratings';
import CommunitySupport from './components/CommunitySupport';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import UserManagement from './pages/UserManagement';
import ArtisanRequestsAdmin from './pages/ArtisanRequestsAdmin';
import ProductManagement from './pages/ProductManagement';
import ArtisanRequest from './pages/ArtisanRequest';
import OurStory from './pages/OurStory';
import AdminDashboard from './components/AdminDashboard';
import GiftCard from './pages/GiftCard';
import ResetPassword from './pages/ResetPassword';
import ProductInfo from './pages/ProductInfo';
import './styles/main.css';

const App = () => {

  const history = useHistory();
  // Simple role check from JWT (for demo; use context/auth in real app)
  const getRole = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role;
    } catch {
      return null;
    }
  };
  const role = getRole();

  return (
    <Router>
        <NavBar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/products" component={ProductList} />
          <Route path="/products/:id" component={ProductDetails} />
          <Route path="/dashboard" render={() => role === 'admin' ? <AdminPanel /> : <ArtisanDashboard />} />
          <Route path="/cart" component={Cart} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/admin" render={() => role === 'admin' ? <AdminPanel /> : <NotFound />} />
          <Route path="/usermanagement" render={() => role === 'admin' ? <UserManagement /> : <NotFound />} />
          <Route path="/artisan-requests-admin" render={() => role === 'admin' ? <ArtisanRequestsAdmin /> : <NotFound />} />
          <Route path="/product-management" render={() => (role === 'admin' || role === 'artisan') ? <ProductManagement /> : <NotFound />} />
          <Route path="/artisan-request" render={() => role === 'artisan' ? <ArtisanRequest /> : <NotFound />} />
          <Route path="/ratings" component={Ratings} />
          <Route path="/community" component={CommunitySupport} />
          <Route path="/our-story" component={OurStory} />
          <Route path="/admin-dashboard" render={() => role === 'admin' ? <AdminDashboard /> : <NotFound />} />
          <Route path="/gift-card" component={GiftCard} />
          <Route path="/forgot-password" component={require('./pages/ForgotPassword').default} />
          <Route path="/reset-password" component={ResetPassword} />
          <Route path="/product-info" component={ProductInfo} />
          <Route component={NotFound} />
        </Switch>
        <Footer />
      </Router>

  );
};

export default App;