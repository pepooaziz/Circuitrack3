import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const body = await req.json();
    const { product_id, start_price, end_at } = body;

    // 1. Validate Admin or Vendor (Placeholder check)
    // const { data: { user } } = await supabase.auth.getUser();
    // if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 2. Enable Auction Mode on Product
    const { data, error } = await supabase
        .from('products')
        .update({
            is_auction: true,
            auction_start_price: start_price,
            auction_current_price: start_price,
            auction_end_at: end_at,
            auction_status: 'running' // Automatically start for simplicity now
        })
        .eq('id', product_id)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 3. Log Event
    await supabase.from('auction_events').insert({
        product_id,
        event_type: 'auction_created',
        event_data: { start_price, end_at }
    });

    return NextResponse.json({ success: true, data });
}
