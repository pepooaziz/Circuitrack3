import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/product';
import { Star, Eye } from 'lucide-react';

interface ProductCardProps {
    product: Product;
    locale: string;
}

export default function ProductCard({ product, locale }: ProductCardProps) {
    const { name, price, currency, images, is_used, condition_rating, id, category } = product;
    const image = images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image';

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all group h-full flex flex-col">
            <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                <img
                    src={image}
                    alt={name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                {is_used && (
                    <Badge variant="secondary" className="absolute top-2 right-2 bg-amber-100 text-amber-800 border-amber-200">
                        Used
                    </Badge>
                )}
                {!is_used && (
                    <Badge className="absolute top-2 right-2 bg-blue-600">
                        New
                    </Badge>
                )}
            </div>

            <CardHeader className="p-4 pb-0">
                <div className="flex justify-between items-start mb-1">
                    <Badge variant="outline" className="text-xs text-slate-500 border-slate-200">
                        {category}
                    </Badge>
                    {is_used && condition_rating && (
                        <div className="flex items-center gap-0.5 text-amber-400">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span className="text-xs font-medium text-slate-700">{condition_rating}/5</span>
                        </div>
                    )}
                </div>
                <h3 className="font-semibold text-lg line-clamp-2 min-h-[3.5rem] group-hover:text-blue-700 transition-colors">
                    {name}
                </h3>
            </CardHeader>

            <CardContent className="p-4 pt-2 flex-grow">
                <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-slate-900">{currency} {price}</span>
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
                <Link href={`/${locale}/products/${id}`} className="w-full">
                    <Button className="w-full gap-2" variant="outline">
                        <Eye className="w-4 h-4" /> View Details
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
