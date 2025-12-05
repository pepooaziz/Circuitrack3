import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Gavel, TrendingUp, Store, Shield, Search } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-slate-900">CircuitRack</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/products" className="text-slate-600 hover:text-slate-900 transition-colors">
                Products
              </Link>
              <Link href="/auctions" className="text-slate-600 hover:text-slate-900 transition-colors">
                Auctions
              </Link>
              <Link href="/vendors" className="text-slate-600 hover:text-slate-900 transition-colors">
                Vendors
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="container mx-auto px-4 py-20">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4" variant="secondary">
              Multi-Vendor Marketplace
            </Badge>
            <h1 className="text-5xl font-bold text-slate-900 mb-6">
              Your Complete Electronics Trading Platform
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              Buy and sell new and used electronics, participate in auctions, and access wholesale trade pricing. Built for vendors and buyers.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="text-lg px-8">
                  Start Selling
                </Button>
              </Link>
              <Link href="/products">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Browse Products
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-20">
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <ShoppingBag className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Multi-Vendor Products</CardTitle>
                <CardDescription>
                  Browse thousands of new and used electronics from verified vendors worldwide
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/products">
                  <Button variant="link" className="px-0">
                    Explore Products →
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Gavel className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Live Auctions</CardTitle>
                <CardDescription>
                  Participate in real-time auctions for electronics and get the best deals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/auctions">
                  <Button variant="link" className="px-0">
                    View Auctions →
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-orange-600 mb-4" />
                <CardTitle>Trade Pricing</CardTitle>
                <CardDescription>
                  Access wholesale and secondary market pricing for bulk purchases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/trade">
                  <Button variant="link" className="px-0">
                    Learn More →
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="bg-slate-900 rounded-2xl p-12 text-white">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Become a Vendor</h2>
                <p className="text-slate-300 mb-6">
                  Join thousands of vendors selling electronics on our platform. Get access to powerful tools, analytics, and a global customer base.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <Store className="h-5 w-5 text-green-400" />
                    <span>Full vendor dashboard</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-green-400" />
                    <span>Secure payment processing</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Search className="h-5 w-5 text-green-400" />
                    <span>Marketing & promotional tools</span>
                  </li>
                </ul>
                <Link href="/vendor/register">
                  <Button size="lg" variant="secondary">
                    Apply as Vendor
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="text-4xl font-bold mb-2">10K+</div>
                  <div className="text-slate-300">Active Products</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="text-4xl font-bold mb-2">500+</div>
                  <div className="text-slate-300">Vendors</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="text-4xl font-bold mb-2">50K+</div>
                  <div className="text-slate-300">Customers</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="text-4xl font-bold mb-2">99%</div>
                  <div className="text-slate-300">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-slate-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-slate-900">CircuitRack</span>
            </div>
            <div className="text-sm text-slate-600">
              © 2024 CircuitRack. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
