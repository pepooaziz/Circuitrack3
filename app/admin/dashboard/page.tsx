import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Package, Gavel, FileCheck, AlertCircle } from 'lucide-react';
import Link from 'next/link';

async function getAdminData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  const { data: userData } = await supabase
    .from('users')
    .select('email, role')
    .eq('id', user.id)
    .single();

  if (!userData || userData.role !== 'ADMIN') {
    redirect('/');
  }

  const { count: usersCount } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });

  const { count: vendorsCount } = await supabase
    .from('vendors')
    .select('*', { count: 'exact', head: true });

  const { count: productsCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  const { count: pendingProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'PENDING_APPROVAL');

  const { count: auctionsCount } = await supabase
    .from('auctions')
    .select('*', { count: 'exact', head: true });

  const { count: pendingAuctions } = await supabase
    .from('auctions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'PENDING_APPROVAL');

  const { count: pendingApprovals } = await supabase
    .from('admin_approvals')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'PENDING');

  return {
    user: userData,
    stats: {
      totalUsers: usersCount || 0,
      totalVendors: vendorsCount || 0,
      totalProducts: productsCount || 0,
      pendingProducts: pendingProducts || 0,
      totalAuctions: auctionsCount || 0,
      pendingAuctions: pendingAuctions || 0,
      pendingApprovals: pendingApprovals || 0,
    },
  };
}

export default async function AdminDashboardPage() {
  const { user, stats } = await getAdminData();

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
          <p className="text-lg text-slate-600">Manage your marketplace</p>
        </div>

        {stats.pendingApprovals > 0 && (
          <Card className="mb-8 border-orange-200 bg-orange-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <CardTitle className="text-orange-900">Pending Approvals</CardTitle>
              </div>
              <CardDescription className="text-orange-700">
                You have {stats.pendingApprovals} items waiting for review
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/approvals">
                <Button variant="default">Review Approvals</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalVendors} vendors
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingProducts} pending review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Auctions</CardTitle>
              <Gavel className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAuctions}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingAuctions} pending review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approvals</CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
              <p className="text-xs text-muted-foreground">
                Pending review
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage marketplace operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/approvals" className="block">
                <Button className="w-full">Review Approvals</Button>
              </Link>
              <Link href="/admin/vendors" className="block">
                <Button variant="outline" className="w-full">Manage Vendors</Button>
              </Link>
              <Link href="/admin/products" className="block">
                <Button variant="outline" className="w-full">Manage Products</Button>
              </Link>
              <Link href="/admin/users" className="block">
                <Button variant="outline" className="w-full">Manage Users</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Platform status overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Database</span>
                <span className="text-sm text-green-600 font-semibold">Healthy</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Authentication</span>
                <span className="text-sm text-green-600 font-semibold">Healthy</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Storage</span>
                <span className="text-sm text-green-600 font-semibold">Healthy</span>
              </div>
              <Link href="/admin/settings">
                <Button variant="outline" className="w-full mt-4">System Settings</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
