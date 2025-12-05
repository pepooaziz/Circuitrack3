"use client";

import Link from "next/link";
import { ShoppingCart, Heart, GitCompare, User } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher"; // Assumes this exists from previous steps

export default function Navbar() {
    const params = useParams();
    const locale = params.lang as string || 'en';
    const t = useTranslations("navbar");

    return (
        <header className="w-full bg-white shadow-sm sticky top-0 z-50 border-b border-slate-100">
            <div className="container mx-auto flex items-center justify-between py-3 px-4">

                {/* --- Logo --- */}
                <Link href={`/${locale}`} className="flex items-center gap-2">
                    {/* Fallback to text if image fails or for simplicity until image is in public folder */}
                    <div className="relative w-10 h-10">
                        <Image
                            src="/logo.png"
                            alt="CircuitRack"
                            fill
                            className="object-contain"
                            onError={(e) => {
                                // Fallback handled by CSS or just ensure image exists
                                // e.currentTarget.style.display = 'none';
                            }}
                        />
                    </div>
                    <span className="text-2xl font-bold text-primary">Circuit<span className="text-secondary">Rack</span></span>
                </Link>

                {/* --- Navigation --- */}
                <nav className="hidden lg:flex gap-8 text-lg font-medium">
                    <Link href={`/${locale}/products`} className="hover:text-primary transition">{t('products')}</Link>
                    <Link href={`/${locale}/auctions`} className="hover:text-primary transition">{t('auctions')}</Link>
                    <Link href={`/${locale}/vendors`} className="hover:text-primary transition">{t('vendors')}</Link>
                    {/* Add more links if translations exist, otherwise keep hardcoded or add keys */}
                </nav>

                {/* --- Actions --- */}
                <div className="flex items-center gap-4">

                    {/* Comparision */}
                    <Link href={`/${locale}/compare`} className="relative hidden sm:block">
                        <GitCompare className="w-6 h-6 text-primary hover:text-secondary transition-colors" />
                    </Link>

                    {/* Wishlist */}
                    <Link href={`/${locale}/wishlist`} className="relative hidden sm:block">
                        <Heart className="w-6 h-6 text-secondary hover:text-primary transition-colors" />
                    </Link>

                    {/* Cart */}
                    <Link href={`/${locale}/cart`} className="relative">
                        <ShoppingCart className="w-6 h-6 text-primary hover:text-secondary transition-colors" />
                        <span className="absolute -top-2 -right-2 bg-secondary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">0</span>
                    </Link>

                    {/* Language Switcher */}
                    <LanguageSwitcher locale={locale} />

                    {/* Login / Auth */}
                    <div className="hidden sm:flex items-center gap-3">
                        <Link href={`/${locale}/auth/login`} className="text-primary font-medium hover:underline">
                            {t('signin')}
                        </Link>
                        <Link href={`/${locale}/auth/register`} className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm hover:shadow">
                            {t('getStarted')}
                        </Link>
                    </div>

                    {/* Mobile User Icon (if space is tight) */}
                    <Link href={`/${locale}/auth/login`} className="sm:hidden text-slate-700">
                        <User className="w-6 h-6" />
                    </Link>

                </div>

            </div>
        </header>
    );
}
