export const formatCurrency = (amount: number): string => {
    return `$${amount.toFixed(2)}`;
};

export const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const calculateTotalPrice = (items: { price: number; quantity: number }[]): number => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
};

// Simple cart utility for localStorage
export const getCart = (): any[] => {
    try {
        return JSON.parse(localStorage.getItem('cart') || '[]');
    } catch {
        return [];
    }
};

export const setCart = (cart: any[]) => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

export const addToCart = (item: any) => {
    const cart = getCart();
    cart.push(item);
    setCart(cart);
};

export const clearCart = () => {
    localStorage.removeItem('cart');
};