import { Product } from '@/types/product';
import { supabaseAdmin } from './supabaseClient';

const MOCK_PRODUCTS: Product[] = [
    { id: '101', title: 'Siemens Simatic S7-1200', image: '/products/plc-s7.jpg', price: 450.00, condition: 'new', rating: 4.8, vendor: 'Industrial Automation', category: 'PLC' },
    { id: '102', title: 'Allen Bradley PowerFlex 525', image: '/products/powerflex.jpg', price: 320.00, condition: 'used', rating: 4.5, vendor: 'TechParts LTD', category: 'Drives' },
    { id: '103', title: 'Fluke 87V Multimeter', image: '/products/fluke.jpg', price: 399.99, condition: 'new', rating: 5.0, vendor: 'Precision Tools', category: 'Tools' },
    { id: '104', title: 'Schneider Electric Contactor', image: '/products/contactor.jpg', price: 45.50, condition: 'new', rating: 4.2, vendor: 'Electric World', category: 'Control' },
    { id: '105', title: 'Omron CJ2M CPU', image: '/products/omron.jpg', price: 650.00, condition: 'new', rating: 4.9, vendor: 'J-Tech', category: 'PLC' },
    { id: '106', title: 'Mean Well 24V PSU', image: '/products/psu.jpg', price: 35.00, condition: 'new', rating: 4.6, vendor: 'Power Source', category: 'Power' },
    { id: '107', title: 'Yaskawa V1000 Drive', image: '/products/yaskawa.jpg', price: 280.00, condition: 'used', rating: 4.4, vendor: 'Drive Masters', category: 'Drives' },
    { id: '108', title: 'Keyence Sensor LR-Z', image: '/products/keyence.jpg', price: 120.00, condition: 'new', rating: 4.7, vendor: 'Sensor Hub', category: 'Sensors' },
];

interface FilterOptions {
    limit?: number;
    category?: string;
    vendorId?: string;
}

export async function getSuggestions({ limit = 12, category, vendorId }: FilterOptions): Promise<Product[]> {
    try {
        // 1. Try fetching from Supabase if keys exist
        if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
            let query = supabaseAdmin
                .from('products')
                .select('id, name, images, price, status, shop_id') // Adjust column names to match DB schema
                .limit(limit);

            if (category) {
                // query = query.eq('category_id', category); // Uncomment if category logic exists
            }

            const { data, error } = await query;

            if (!error && data && data.length > 0) {
                // Map DB result to Product type
                return data.map((item: any) => ({
                    id: item.id,
                    title: item.name,
                    image: item.images?.[0] || '',
                    price: item.price,
                    condition: 'new', // Default fallback
                    rating: 5, // Default fallback
                    vendor: item.shop_id,
                    category: 'General'
                }));
            }
        }
    } catch (err) {
        console.error('Supabase fetch failed, falling back to mock.', err);
    }

    // 2. Fallback to Mock Data
    let results = [...MOCK_PRODUCTS];

    if (category) {
        results = results.filter(p => p.category?.toLowerCase() === category.toLowerCase());
    }

    if (vendorId) {
        results = results.filter(p => p.vendor === vendorId);
    }

    return results.slice(0, limit);
}
