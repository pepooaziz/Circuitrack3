import { createClient } from '@/lib/supabase/server';
import AuctionCard from '@/app/_components/auctions/AuctionCard';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function AuctionsListPage({ params: { lang } }: { params: { lang: string } }) {
    const t = await getTranslations('auctions');
    const supabase = createClient();

    // Fetch active auctions
    const { data: auctions } = await (await supabase)
        .from('products')
        .select('*')
        .eq('is_auction', true)
        .eq('auction_status', 'running')
        .order('auction_end_at', { ascending: true });

    return (
        <div className="min-h-screen bg-slate-50 py-10">
            <div className="container mx-auto px-4">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">{t('title')}</h1>
                    <p className="text-slate-600">{t('subtitle')}</p>
                </div>

                {auctions && auctions.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {auctions.map((auction: any) => (
                            <AuctionCard key={auction.id} auction={auction} locale={lang} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed">
                        <p className="text-slate-500 text-lg">{t('noLive')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
