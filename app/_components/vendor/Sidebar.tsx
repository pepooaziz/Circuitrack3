"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    DollarSign,
    TrendingUp,
    Settings,
    LogOut,
    Gavel
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function VendorSidebar({ locale }: { locale: string }) {
    const t = useTranslations('vendor');
    const pathname = usePathname();

    const links = [
        { href: `/${locale}/vendor/dashboard`, label: t('dashboard'), icon: LayoutDashboard },
        { href: `/${locale}/vendor/products`, label: t('products'), icon: Package },
        { href: `/${locale}/vendor/orders`, label: t('orders'), icon: ShoppingBag },
        { href: `/${locale}/vendor/earnings`, label: t('earnings'), icon: DollarSign },
        { href: `/${locale}/vendor/boost`, label: t('boost'), icon: TrendingUp },
        { href: `/${locale}/vendor/auctions`, label: t('manageAuctions'), icon: Gavel }, // Added Auction management link
        { href: `/${locale}/vendor/settings`, label: t('settings'), icon: Settings },
    ];

    return (
        <aside className="w-64 bg-white border-r h-screen hidden md:flex flex-col fixed top-0 left-0 bottom-0 z-40 pt-16">
            <div className="flex-1 py-6 px-4 space-y-1">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link key={link.href} href={link.href}>
                            <div
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1",
                                    isActive
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {link.label}
                            </div>
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 border-t">
                <form action="/auth/signout" method="post">
                    <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 gap-2">
                        <LogOut className="h-4 w-4" />
                        {t('logout')}
                    </Button>
                </form>
            </div>
        </aside>
    );
}
