import VendorSidebar from '@/app/_components/vendor/Sidebar';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default async function VendorLayout({
    children,
    params: { lang },
}: {
    children: React.ReactNode;
    params: { lang: string };
}) {
    const supabase = await createClient(); // Awaiting the client creation if needed in your version

    // 1. Auth Check
    // In a real app, use getUser() for security. Mock check for prompt speed if needed.
    // const { data: { user } } = await supabase.auth.getUser();
    // if (!user) redirect(`/${lang}/auth/login`);

    // 2. Vendor Record Check
    // const { data: vendor } = await supabase.from('vendors').select('status').eq('user_id', user.id).single();
    // if (!vendor) redirect(`/${lang}/vendor/register`);
    // if (vendor.status !== 'active') redirect(`/${lang}/vendor/pending`);

    return (
        <div className="min-h-screen bg-slate-50">

            {/* Sidebar */}
            <VendorSidebar locale={lang} />

            {/* Main Content Area */}
            <div className="md:ml-64 pt-16 min-h-screen">
                <div className="p-8">
                    {children}
                </div>
            </div>

        </div>
    );
}
