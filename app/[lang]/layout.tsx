import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import { Toaster } from '@/components/ui/sonner';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Header from '@/components/header/Header';
import { StoreProvider } from '@/context/StoreContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'CircuitRack - Electronics Marketplace',
    description: 'Multi-vendor marketplace for new and used electronics, auctions, and trade pricing',
};

export default async function RootLayout({
    children,
    params: { lang },
}: {
    children: React.ReactNode;
    params: { lang: string };
}) {
    // Ensure lang fallback
    const locale = lang || 'en';
    const direction = locale === 'ar' ? 'rtl' : 'ltr';

    // Fetch messages for localization
    const messages = await getMessages();

    return (
        <html lang={locale} dir={direction}>
            <body className={inter.className}>
                <NextIntlClientProvider messages={messages} locale={locale}>
                    <StoreProvider>
                        <Header lang={locale} />
                        <main>{children}</main>
                        <Toaster />
                    </StoreProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
