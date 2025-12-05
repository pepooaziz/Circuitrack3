import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Store, Package } from 'lucide-react';
import Link from 'next/link';

async function getVendors() {
  const supabase = await createClient();

  const { data: vendors, error } = await supabase
    .from('vendors')
    .select(`
      *,
      products:products(count)
    `)
    .eq('status', 'ACTIVE')
    .order('created_at', { ascending: false })
    .limit(12);

  if (error) {
    console.error('Error fetching vendors:', error);
    return [];
  }

  return vendors || [];
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

export default async function VendorsPage() {
  const vendors = await getVendors();
  const user = await getUser();

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Vendors</h1>
          <p className="text-lg text-slate-600">Browse verified electronics vendors</p>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {vendors.map((vendor: any) => {
            const productCount = vendor.products?.[0]?.count || 0;

            return (
              <Card key={vendor.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Store className="h-6 w-6 text-blue-600" />
                    </div>
                    <Badge variant="secondary">Verified</Badge>
                  </div>
                  <CardTitle className="line-clamp-1">{vendor.company_name}</CardTitle>
                  <CardDescription className="line-clamp-1">{vendor.name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Package className="h-4 w-4" />
                    <span>{productCount} Products</span>
                  </div>
                  <div className="text-sm text-slate-600">
                    <span className="font-medium">Location: </span>
                    {vendor.country}
                  </div>
                  <Link href={`/vendors/${vendor.id}`}>
                    <Button className="w-full">View Store</Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {vendors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-slate-600">No vendors available at the moment.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
