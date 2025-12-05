import { Product, CartItem } from '@/types';

export const getStorageItem = <T>(key: string): T[] => {
    if (typeof window === 'undefined') return [];
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : [];
};

export const setStorageItem = <T>(key: string, value: T[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
};

export const addToCart = (product: Product) => {
    const cart = getStorageItem<CartItem>('circuicrack_cart');
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
        existing.quantity += 1;
        setStorageItem('circuicrack_cart', cart);
    } else {
        setStorageItem('circuicrack_cart', [...cart, { ...product, quantity: 1 }]);
    }
};

export const removeFromCart = (id: string) => {
    const cart = getStorageItem<CartItem>('circuicrack_cart');
    const newCart = cart.filter((item) => item.id !== id);
    setStorageItem('circuicrack_cart', newCart);
};

export const addToWishlist = (product: Product) => {
    const wishlist = getStorageItem<Product>('circuicrack_wishlist');
    if (!wishlist.find((item) => item.id === product.id)) {
        setStorageItem('circuicrack_wishlist', [...wishlist, product]);
    }
};

export const removeFromWishlist = (id: string) => {
    const wishlist = getStorageItem<Product>('circuicrack_wishlist');
    setStorageItem('circuicrack_wishlist', wishlist.filter((item) => item.id !== id));
};

export const addToCompare = (product: Product) => {
    const compare = getStorageItem<Product>('circuicrack_compare');
    if (!compare.find((item) => item.id === product.id)) {
        // Limit to 4 items
        if (compare.length >= 4) return;
        setStorageItem('circuicrack_compare', [...compare, product]);
    }
};

export const removeFromCompare = (id: string) => {
    const compare = getStorageItem<Product>('circuicrack_compare');
    setStorageItem('circuicrack_compare', compare.filter((item) => item.id !== id));
};
