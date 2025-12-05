import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Gavel, TrendingUp, DollarSign } from 'lucide-react';
import Link from 'next/link';

async function getVendorData() {
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
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (!vendor) {
    return { user: userData, vendor: null, stats: null };
  }

  const { count: productsCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('vendor_id', vendor.id);

  const { count: activeProductsCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('vendor_id', vendor.id)
    .eq('status', 'ACTIVE');

  const { count: auctionsCount } = await supabase
    .from('auctions')
    .select('*', { count: 'exact', head: true })
    .eq('vendor_id', vendor.id);

  const { count: ordersCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('customer_id', user.id);

  return {
    user: userData,
    vendor,
    stats: {
      totalProducts: productsCount || 0,
      activeProducts: activeProductsCount || 0,
      totalAuctions: auctionsCount || 0,
      totalOrders: ordersCount || 0,
    },
  };
}

export default async function VendorDashboardPage() {
  const { user, vendor, stats } = await getVendorData();

  if (!vendor) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header user={user} />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Profile Required</CardTitle>
              <CardDescription>
                You need to create a vendor profile to access the dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/vendor/setup">
                <Button>Create Vendor Profile</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Vendor Dashboard</h1>
          <p className="text-lg text-slate-600">Welcome back, {vendor.company_name}</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.activeProducts} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Auctions</CardTitle>
              <Gavel className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalAuctions}</div>
              <p className="text-xs text-muted-foreground">
                Live and completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                All time
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{vendor.status}</div>
              <p className="text-xs text-muted-foreground">
                Vendor status
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your marketplace presence</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/vendor/products/new" className="block">
                <Button className="w-full">Add New Product</Button>
              </Link>
              <Link href="/vendor/products" className="block">
                <Button variant="outline" className="w-full">Manage Products</Button>
              </Link>
              <Link href="/vendor/auctions/new" className="block">
                <Button variant="outline" className="w-full">Create Auction</Button>
              </Link>
              <Link href="/vendor/campaigns" className="block">
                <Button variant="outline" className="w-full">Promotional Campaigns</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vendor Information</CardTitle>
              <CardDescription>Your business details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-600">Company Name</p>
                <p className="text-lg">{vendor.company_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Vendor Name</p>
                <p className="text-lg">{vendor.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Country</p>
                <p className="text-lg">{vendor.country}</p>
              </div>
              <Link href="/vendor/settings">
                <Button variant="outline" className="w-full">Edit Profile</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
