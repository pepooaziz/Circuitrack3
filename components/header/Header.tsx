"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Heart, Repeat2, Globe } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { useTranslations } from "next-intl";

export default function Header({ lang }: { lang: string }) {
    const t = useTranslations('navbar');
    const pathname = usePathname() || "";
    const { cart, wishlist, compare } = useStore();

    const changeLang = (newLang: string) => {
        if (!pathname) return;

        // Split pathname and replace language segment
        const segments = pathname.split("/");
        segments[1] = newLang;
        const newPath = segments.join("/");

        // Force reload to ensure translations update
        window.location.href = newPath;
    };

    const isActive = (path: string) => pathname.includes(path);

    const cartCount = cart.reduce((acc: number, item: any) => acc + item.quantity, 0);
    const wishlistCount = wishlist.length;
    const compareCount = compare.length;

    return (
        <header className="w-full border-b bg-white/90 backdrop-blur shadow-sm fixed top-0 left-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

                {/* --- Logo Section --- */}
                <Link href={`/${lang}`} className="flex items-center gap-2">
                    <Image
                        src="/logo-circuitrack.png"
                        alt="CircuitRack Logo"
                        width={160}
                        height={60}
                        priority
                        className="object-contain"
                    />
                </Link>

                {/* --- Navigation Menu --- */}
                <nav className="hidden md:flex items-center gap-8 text-[16px] font-medium">
                    <Link
                        href={`/${lang}/products`}
                        className={`hover:text-blue-600 transition-colors ${isActive('/products') ? 'text-blue-600 font-bold' : 'text-slate-600'}`}
                    >
                        {t('products')}
                    </Link>

                    <Link
                        href={`/${lang}/auctions`}
                        className={`hover:text-blue-600 transition-colors ${isActive('/auctions') ? 'text-blue-600 font-bold' : 'text-slate-600'}`}
                    >
                        {t('auctions')}
                    </Link>

                    <Link
                        href={`/${lang}/vendors`}
                        className={`hover:text-blue-600 transition-colors ${isActive('/vendors') ? 'text-blue-600 font-bold' : 'text-slate-600'}`}
                    >
                        {t('vendors')}
                    </Link>
                </nav>

                {/* --- Right Section --- */}
                <div className="flex items-center gap-6">

                    {/* --- Cart Icon --- */}
                    <Link href={`/${lang}/cart`} className="relative cursor-pointer hover:text-blue-600 transition">
                        <ShoppingCart size={24} />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* --- Wishlist Icon --- */}
                    <Link href={`/${lang}/wishlist`} className="relative cursor-pointer hover:text-blue-600 transition">
                        <Heart size={24} />
                        {wishlistCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                {wishlistCount}
                            </span>
                        )}
                    </Link>

                    {/* --- Compare Icon --- */}
                    <Link href={`/${lang}/compare`} className="relative cursor-pointer hover:text-blue-600 transition">
                        <Repeat2 size={24} />
                        {compareCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                {compareCount}
                            </span>
                        )}
                    </Link>

                    {/* --- Language Switcher --- */}
                    <div className="relative group cursor-pointer py-2 px-1">

                        <div className="flex items-center gap-1 text-slate-700 hover:text-blue-600">
                            <Globe size={22} />
                            <span className="uppercase text-sm font-bold">{lang}</span>
                        </div>

                        {/* Invisible bridge */}
                        <div className="absolute top-full right-0 w-full h-2 bg-transparent"></div>

                        <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-md p-2 right-0 mt-2 w-32 top-full border z-50">
                            <button
                                onClick={() => changeLang("en")}
                                className={`flex items-center justify-between w-full text-left px-2 py-1.5 text-sm rounded hover:bg-slate-50 ${lang === 'en' ? 'text-blue-600 font-bold bg-blue-50' : 'text-slate-700'}`}
                            >
                                English
                                {lang === 'en' && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
                            </button>
                            <button
                                onClick={() => changeLang("ar")}
                                className={`flex items-center justify-between w-full text-left px-2 py-1.5 text-sm rounded hover:bg-slate-50 ${lang === 'ar' ? 'text-blue-600 font-bold bg-blue-50' : 'text-slate-700'}`}
                            >
                                العربية
                                {lang === 'ar' && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
                            </button>
                            <button
                                onClick={() => changeLang("zh")}
                                className={`flex items-center justify-between w-full text-left px-2 py-1.5 text-sm rounded hover:bg-slate-50 ${lang === 'zh' ? 'text-blue-600 font-bold bg-blue-50' : 'text-slate-700'}`}
                            >
                                中文
                                {lang === 'zh' && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
                            </button>
                        </div>
                    </div>

                    {/* --- Auth Buttons --- */}
                    <Link
                        href={`/${lang}/auth/login`}
                        className="px-5 py-2 border rounded-md hover:bg-blue-50 text-sm font-medium whitespace-nowrap"
                    >
                        {t('signin')}
                    </Link>

                    <Link
                        href={`/${lang}/auth/register`}
                        className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium whitespace-nowrap"
                    >
                        {t('getStarted')}
                    </Link>
                </div>
            </div>
        </header>
    );
}
