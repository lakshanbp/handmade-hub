import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Helper to get JWT token
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// PRODUCTS
export const fetchProducts = async () => {
    const res = await axios.get(`${API_BASE_URL}/products`);
    return res.data;
};

export const getProductById = async (id: string | number) => {
    const res = await axios.get(`${API_BASE_URL}/products/${id}`);
    return res.data;
};

export const createProduct = async (productData: any) => {
    const res = await axios.post(`${API_BASE_URL}/products`, productData, { headers: getAuthHeaders() });
    return res.data;
};

export const updateProduct = async (productId: string | number, productData: any) => {
    const res = await axios.put(`${API_BASE_URL}/products/${productId}`, productData, { headers: getAuthHeaders() });
    return res.data;
};

export const deleteProduct = async (productId: string | number) => {
    const res = await axios.delete(`${API_BASE_URL}/products/${productId}`, { headers: getAuthHeaders() });
    return res.data;
};

export const fetchProductAnalytics = async (productId: string | number) => {
    const res = await axios.get(`${API_BASE_URL}/products/${productId}/analytics`);
    return res.data;
};

// AUTH
export const registerUser = async (userData: { name: string; email: string; password: string; role?: string }) => {
    const res = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    return res.data;
};

export const loginUser = async (credentials: { email: string; password: string }) => {
    const res = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    if (res.data.token) localStorage.setItem('token', res.data.token);
    return res.data;
};

export const forgotPassword = async (email: string) => {
    const res = await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
    return res.data;
};

export const resetPassword = async (token: string, password: string) => {
    const res = await axios.post(`${API_BASE_URL}/auth/reset-password`, { token, password });
    return res.data;
};

// ORDERS
export const createOrder = async (orderData: any) => {
    const res = await axios.post(`${API_BASE_URL}/orders`, orderData, { headers: getAuthHeaders() });
    return res.data;
};

export const fetchMyOrders = async () => {
    const res = await axios.get(`${API_BASE_URL}/orders/my`, { headers: getAuthHeaders() });
    return res.data;
};

export const fetchAllOrders = async () => {
    const res = await axios.get(`${API_BASE_URL}/orders`, { headers: getAuthHeaders() });
    return res.data;
};

// ORDER ANALYTICS (admin only)
export const fetchOrderAnalytics = async () => {
    const res = await axios.get(`${API_BASE_URL}/orders/analytics`, { headers: getAuthHeaders() });
    return res.data;
};

// REVIEWS
export const fetchReviewsByProduct = async (productId: string | number) => {
    const res = await axios.get(`${API_BASE_URL}/reviews/product/${productId}`);
    return res.data;
};

export const submitReview = async (productId: string | number, review: { rating: number; comment: string }) => {
    const res = await axios.post(`${API_BASE_URL}/reviews/${productId}`, review, { headers: getAuthHeaders() });
    return res.data;
};

// USERS (admin only)
export const fetchUsers = async () => {
    const res = await axios.get(`${API_BASE_URL}/users`, { headers: getAuthHeaders() });
    return res.data;
};

export const fetchUserById = async (id: string | number) => {
    const res = await axios.get(`${API_BASE_URL}/users/${id}`, { headers: getAuthHeaders() });
    return res.data;
};

export const updateUser = async (id: string | number, userData: any) => {
    const res = await axios.put(`${API_BASE_URL}/users/${id}`, userData, { headers: getAuthHeaders() });
    return res.data;
};

export const deleteUser = async (id: string | number) => {
    const res = await axios.delete(`${API_BASE_URL}/users/${id}`, { headers: getAuthHeaders() });
    return res.data;
};

// ARTISAN REQUESTS
export const requestArtisanRole = async () => {
    const res = await axios.post(`${API_BASE_URL}/auth/request-artisan`, {}, { headers: getAuthHeaders() });
    return res.data;
};

export const fetchArtisanRequests = async () => {
    const res = await axios.get(`${API_BASE_URL}/artisan-requests`, { headers: getAuthHeaders() });
    return res.data;
};

export const handleArtisanRequest = async (requestId: string, status: 'approved' | 'rejected') => {
    const res = await axios.put(`${API_BASE_URL}/artisan-requests/${requestId}`, { status }, { headers: getAuthHeaders() });
    return res.data;
};

export const deleteArtisanRequest = async (requestId: string) => {
    const res = await axios.delete(`${API_BASE_URL}/artisan-requests/${requestId}`, { headers: getAuthHeaders() });
    return res.data;
};