import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    const supabase = await createClient();
    const productId = params.id;

    // 1. Get current auction state
    const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

    if (fetchError || !product) {
        return NextResponse.json({ error: "Auction not found" }, { status: 404 });
    }

    // 2. Find Winner (Highest Bid)
    const { data: highestBid } = await supabase
        .from('bids')
        .select('*')
        .eq('product_id', productId)
        .order('bid_amount', { ascending: false })
        .limit(1)
        .single();

    // 3. Update Auction Status
    const { data: updatedAuction, error: updateError } = await supabase
        .from('products')
        .update({
            auction_status: 'ended',
            // Store winner info if you had a dedicated column, or just rely on bids table
        })
        .eq('id', productId)
        .select()
        .single();

    if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // 4. Log Event
    await supabase.from('auction_events').insert({
        product_id: productId,
        event_type: 'auction_ended',
        event_data: {
            winner_id: highestBid?.user_id || null,
            final_price: highestBid?.bid_amount || product.auction_start_price
        }
    });

    return NextResponse.json({ success: true, winner: highestBid, auction: updatedAuction });
}
