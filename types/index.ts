export interface Product {
    id: string;
    title: string;
    image: string;
    price: number;
    condition: "new" | "used";
    rating?: number;
    vendor?: string;
    category?: string;
}

export interface CartItem extends Product {
    quantity: number;
}
