"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Product } from "@/types/product";

export interface CartItem extends Product {
    quantity: number;
}

interface StoreContextType {
    cart: CartItem[];
    wishlist: Product[];
    compare: Product[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateCartQty: (productId: string, qty: number) => void;
    toggleWishlist: (product: Product) => void;
    addToCompare: (product: Product) => void;
    removeFromCompare: (productId: string) => void;
    isInWishlist: (productId: string) => boolean;
    isInCompare: (productId: string) => boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [wishlist, setWishlist] = useState<Product[]>([]);
    const [compare, setCompare] = useState<Product[]>([]);
    const [mounted, setMounted] = useState(false);

    // Load from LocalStorage on mount
    useEffect(() => {
        try {
            const savedCart = localStorage.getItem("circuitrack_cart");
            const savedWishlist = localStorage.getItem("circuitrack_wishlist");
            const savedCompare = localStorage.getItem("circuitrack_compare");

            if (savedCart) setCart(JSON.parse(savedCart));
            if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
            if (savedCompare) setCompare(JSON.parse(savedCompare));
        } catch (error) {
            console.error("Failed to load store data", error);
        }
        setMounted(true);
    }, []);

    // Save to LocalStorage on change
    useEffect(() => {
        if (!mounted) return;
        localStorage.setItem("circuitrack_cart", JSON.stringify(cart));
        localStorage.setItem("circuitrack_wishlist", JSON.stringify(wishlist));
        localStorage.setItem("circuitrack_compare", JSON.stringify(compare));
    }, [cart, wishlist, compare, mounted]);

    const addToCart = (product: Product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: string) => {
        setCart((prev) => prev.filter((item) => item.id !== productId));
    };

    const updateCartQty = (productId: string, qty: number) => {
        if (qty < 1) return;
        setCart((prev) =>
            prev.map((item) => (item.id === productId ? { ...item, quantity: qty } : item))
        );
    };

    const toggleWishlist = (product: Product) => {
        setWishlist((prev) => {
            if (prev.find((item) => item.id === product.id)) {
                return prev.filter((item) => item.id !== product.id);
            }
            return [...prev, product];
        });
    };

    const addToCompare = (product: Product) => {
        setCompare((prev) => {
            if (prev.find((item) => item.id === product.id)) return prev;
            if (prev.length >= 4) {
                alert("لا يمكنك مقارنة أكثر من 4 منتجات");
                return prev;
            }
            return [...prev, product];
        });
    };

    const removeFromCompare = (productId: string) => {
        setCompare((prev) => prev.filter((item) => item.id !== productId));
    };

    const isInWishlist = (productId: string) => wishlist.some((p) => p.id === productId);
    const isInCompare = (productId: string) => compare.some((p) => p.id === productId);

    if (!mounted) return null;

    return (
        <StoreContext.Provider
            value={{
                cart,
                wishlist,
                compare,
                addToCart,
                removeFromCart,
                updateCartQty,
                toggleWishlist,
                addToCompare,
                removeFromCompare,
                isInWishlist,
                isInCompare,
            }}
        >
            {children}
        </StoreContext.Provider>
    );
}

export const useStore = () => {
    const context = useContext(StoreContext);
    if (context === undefined) {
        throw new Error("useStore must be used within a StoreProvider");
    }
    return context;
};
