import { Product } from '@/types/product';

// In-memory store for demo purposes (resets on server restart)
// In production, use Redis or Database
const globalCompareStore: Record<string, Product[]> = {};

export const compareStore = {
    getList: (userId: string): Product[] => {
        return globalCompareStore[userId] || [];
    },

    addItem: (userId: string, product: Product): Product[] => {
        const list = globalCompareStore[userId] || [];

        // Check duplicates
        if (list.some(p => p.id === product.id)) {
            return list;
        }

        // Limit to 4
        if (list.length >= 4) {
            return list;
        }

        const newList = [...list, product];
        globalCompareStore[userId] = newList;
        return newList;
    },

    removeItem: (userId: string, productId: string): Product[] => {
        const list = globalCompareStore[userId] || [];
        const newList = list.filter(p => p.id !== productId);
        globalCompareStore[userId] = newList;
        return newList;
    }
};
