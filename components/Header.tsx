"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Globe, Heart, ShoppingCart, Repeat } from "lucide-react";
import Image from "next/image";

export default function Header() {
  const { lang } = useParams();

  return (
    <header className="w-full border-b bg-white">
      <div className="container mx-auto flex items-center justify-between py-4 px-4">

        {/* Logo */}
        <Link href={`/${lang}`} className="flex items-center gap-2">
          <Image
            src="/logo-circuitrack.jpg"
            alt="CircuitRack"
            width={160}
            height={50}
            priority
            className="object-contain h-14 w-auto"
          />
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href={`/${lang}/products`}>المنتجات</Link>
          <Link href={`/${lang}/auctions`}>المزادات</Link>
          <Link href={`/${lang}/vendors`}>البائعون</Link>
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-4 text-gray-700">

          <Link href={`/${lang}/wishlist`}>
            <Heart className="text-red-500" size={20} />
          </Link>

          <Link href={`/${lang}/compare`}>
            <Repeat className="text-orange-500" size={20} />
          </Link>

          <Link href={`/${lang}/cart`}>
            <ShoppingCart className="text-blue-600" size={20} />
          </Link>

          {/* Language Switcher */}
          <div className="relative group z-50 py-2">
            <Globe size={20} className="cursor-pointer" />

            <div className="absolute hidden group-hover:block bg-white shadow-lg border rounded p-2 right-0 top-full min-w-[100px]">
              <Link href="/ar" className="block px-2 py-1 hover:bg-gray-100 rounded">العربية</Link>
              <Link href="/en" className="block px-2 py-1 hover:bg-gray-100 rounded">English</Link>
              <Link href="/zh" className="block px-2 py-1 hover:bg-gray-100 rounded">中文</Link>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
}
