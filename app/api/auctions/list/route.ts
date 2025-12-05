import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const supabase = await createClient();
    const searchParams = req.nextUrl.searchParams;

    const status = searchParams.get('status') || 'running'; // 'scheduled', 'running', 'ended'

    let query = supabase
        .from('products')
        .select('*')
        .eq('is_auction', true);

    if (status !== 'all') {
        query = query.eq('auction_status', status);
    }

    // Sort by ending soonest for running auctions
    query = query.order('auction_end_at', { ascending: true });

    const { data, error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
}
