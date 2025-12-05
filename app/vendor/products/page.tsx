import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Eye } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

async function getVendorProducts() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  const { data: userData } = await supabase
    .from('users')
    .select('email, role')
    .eq('id', user.id)
    .single();

  if (!userData || userData.role !== 'VENDOR') {
    redirect('/');
  }

  const { data: vendor } = await supabase
    .from('vendors')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!vendor) {
    redirect('/vendor/dashboard');
  }

  const { data: products, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(name_en),
      images:product_images(url, is_primary)
    `)
    .eq('vendor_id', vendor.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return { user: userData, products: [] };
  }

  return { user: userData, products: products || [] };
}

export default async function VendorProductsPage() {
  const { user, products } = await getVendorProducts();

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">My Products</h1>
            <p className="text-lg text-slate-600">Manage your product listings</p>
          </div>
          <Link href="/vendor/products/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>

        <div className="grid gap-6">
          {products.map((product: any) => {
            const primaryImage = product.images?.find((img: any) => img.is_primary)?.url ||
                                product.images?.[0]?.url ||
                                'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400';

            const getStatusColor = (status: string) => {
              switch (status) {
                case 'ACTIVE':
                  return 'bg-green-100 text-green-800';
                case 'DRAFT':
                  return 'bg-gray-100 text-gray-800';
                case 'PENDING_APPROVAL':
                  return 'bg-yellow-100 text-yellow-800';
                case 'SUSPENDED':
                  return 'bg-red-100 text-red-800';
                default:
                  return 'bg-gray-100 text-gray-800';
              }
            };

            return (
              <Card key={product.id}>
                <div className="flex flex-col md:flex-row gap-6 p-6">
                  <div className="relative h-48 w-full md:w-48 flex-shrink-0 bg-slate-100 rounded-lg overflow-hidden">
                    <Image
                      src={primaryImage}
                      alt={product.name_en}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900">{product.name_en}</h3>
                        <p className="text-sm text-slate-600 mt-1">{product.category?.name_en}</p>
                      </div>
                      <Badge className={getStatusColor(product.status)}>
                        {product.status.replace('_', ' ')}
                      </Badge>
                    </div>

                    <div className="flex gap-6 text-sm">
                      <div>
                        <span className="text-slate-600">Price: </span>
                        <span className="font-semibold">${product.base_price} {product.currency}</span>
                      </div>
                      <div>
                        <span className="text-slate-600">Stock: </span>
                        <span className="font-semibold">{product.stock}</span>
                      </div>
                      <div>
                        <span className="text-slate-600">Condition: </span>
                        <span className="font-semibold capitalize">{product.condition.toLowerCase()}</span>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 line-clamp-2">
                      {product.description_en}
                    </p>

                    <div className="flex gap-2 pt-2">
                      <Link href={`/products/${product.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                      <Link href={`/vendor/products/${product.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {products.length === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>No Products Yet</CardTitle>
              <CardDescription>
                Start selling by adding your first product
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/vendor/products/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Product
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
}
