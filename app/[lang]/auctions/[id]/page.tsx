import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import LiveAuctionContainer from '@/app/_components/auctions/LiveAuctionContainer';

// Ensure dynamic rendering
export const dynamic = 'force-dynamic';

export default async function AuctionDetailPage({ params }: { params: { id: string } }) {
    const supabase = createClient();

    // Fetch Auction Data Server Side
    const { data: auction } = await (await supabase)
        .from('products')
        .select('*')
        .eq('id', params.id)
        .single();

    if (!auction) return notFound();

    // Fetch Initial Bids
    const { data: bids } = await (await supabase)
        .from('bids')
        .select('*')
        .eq('product_id', params.id)
        .order('created_at', { ascending: false })
        .limit(20);

    return (
        <div className="min-h-screen bg-slate-50 py-10">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-10">

                    {/* Static Image Gallery (Left Side) */}
                    <div className="space-y-4">
                        <div className="aspect-[4/3] bg-white rounded-2xl overflow-hidden shadow-sm border">
                            <img
                                src={auction.images?.[0] || 'https://via.placeholder.com/600x400'}
                                alt={auction.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Realtime Interactive Section (Right Side) */}
                    <LiveAuctionContainer
                        initialAuction={auction}
                        initialBids={bids || []}
                        auctionId={auction.id}
                    />

                </div>
            </div>
        </div>
    );
}
