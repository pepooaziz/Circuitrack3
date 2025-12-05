import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    const supabase = await createClient();
    const body = await req.json();
    const { bid_amount, user_id } = body; // user_id passed from client for demo if no auth
    const productId = params.id;

    // 1. Get Product Current State
    const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

    if (fetchError || !product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.auction_status !== 'running') {
        return NextResponse.json({ error: "Auction is not running" }, { status: 400 });
    }

    const currentPrice = product.auction_current_price || product.auction_start_price;

    // 2. Validate Bid
    if (bid_amount <= currentPrice) {
        return NextResponse.json({ error: `Bid must be higher than ${currentPrice}` }, { status: 400 });
    }

    // 3. Insert Bid
    const { error: bidError } = await supabase
        .from('bids')
        .insert({
            product_id: productId,
            user_id: user_id || null, // Allow anon bids for testing if user_id missing
            bid_amount: bid_amount
        });

    if (bidError) {
        return NextResponse.json({ error: bidError.message }, { status: 500 });
    }

    // 4. Update Product Price
    const { data: updatedProduct, error: updateError } = await supabase
        .from('products')
        .update({
            auction_current_price: bid_amount
        })
        .eq('id', productId)
        .select()
        .single();

    if (updateError) {
        return NextResponse.json({ error: "Failed to update product price" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: updatedProduct });
}
