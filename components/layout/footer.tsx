import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-slate-50 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-slate-900">CircuitRack</span>
            </div>
            <p className="text-sm text-slate-600">
              Multi-vendor marketplace for electronics, auctions, and trade pricing
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Marketplace</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-slate-600 hover:text-slate-900">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/auctions" className="text-slate-600 hover:text-slate-900">
                  Auctions
                </Link>
              </li>
              <li>
                <Link href="/vendors" className="text-slate-600 hover:text-slate-900">
                  Vendors
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-4">For Vendors</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/vendor/register" className="text-slate-600 hover:text-slate-900">
                  Become a Vendor
                </Link>
              </li>
              <li>
                <Link href="/vendor/dashboard" className="text-slate-600 hover:text-slate-900">
                  Vendor Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-slate-600 hover:text-slate-900">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-600 hover:text-slate-900">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-slate-600">
          © 2024 CircuitRack. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
