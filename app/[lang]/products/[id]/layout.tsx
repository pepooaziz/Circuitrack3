import { products } from "@/lib/productsData";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string; lang: string } }): Promise<Metadata> {
    const product = products.find(p => p.id === params.id);

    if (!product) {
        return {
            title: 'Product Not Found',
            description: 'The requested product could not be found.'
        };
    }

    const title = product.title || 'Product Details';
    const description = product.description?.substring(0, 160) || 'View product details and specifications';

    return {
        title: `${title} | CircuitRack`,
        description,
        openGraph: {
            title,
            description,
            images: product.image ? [product.image] : [],
        },
    };
}

export { default } from './page';
