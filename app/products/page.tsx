import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

async function getProducts() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from('products')
    .select(`
      *,
      vendor:vendors(name, company_name),
      category:categories(name_en),
      images:product_images(url, is_primary)
    `)
    .eq('status', 'ACTIVE')
    .order('created_at', { ascending: false })
    .limit(12);

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return products || [];
}

async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: userData } = await supabase
    .from('users')
    .select('email, role')
    .eq('id', user.id)
    .single();

  return userData;
}

export default async function ProductsPage() {
  const products = await getProducts();
  const user = await getUser();

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Products</h1>
          <p className="text-lg text-slate-600">Browse electronics from verified vendors</p>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product: any) => {
            const primaryImage = product.images?.find((img: any) => img.is_primary)?.url ||
                                product.images?.[0]?.url ||
                                'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400';

            return (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 bg-slate-100">
                  <Image
                    src={primaryImage}
                    alt={product.name_en}
                    fill
                    className="object-cover"
                  />
                  {product.condition !== 'NEW' && (
                    <Badge className="absolute top-2 right-2" variant="secondary">
                      {product.condition}
                    </Badge>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-2">{product.name_en}</CardTitle>
                  <p className="text-sm text-slate-600">{product.vendor?.company_name}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-slate-900">
                      ${product.base_price}
                    </span>
                    <span className="text-sm text-slate-600">{product.currency}</span>
                  </div>
                  {product.stock > 0 ? (
                    <p className="text-sm text-green-600 mt-1">In Stock ({product.stock})</p>
                  ) : (
                    <p className="text-sm text-red-600 mt-1">Out of Stock</p>
                  )}
                </CardContent>
                <CardFooter>
                  <Link href={`/products/${product.id}`} className="w-full">
                    <Button className="w-full">View Details</Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-slate-600">No products available at the moment.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
