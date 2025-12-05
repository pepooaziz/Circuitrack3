export interface Product {
    id: string;
    title: string;
    image: string;
    price: number | string; // Allow string for ranges or strictly number
    condition: "new" | "used";
    rating?: number;
    vendor?: string;
    category?: string;
    brand?: string;
    model?: string;
    description?: string;
    specs?: Record<string, any>;
    usage_applications?: string;
    seo_keywords?: string[];
    notes?: string;
}
