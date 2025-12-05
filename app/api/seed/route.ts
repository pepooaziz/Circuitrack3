import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
    const supabase = await createClient();

    // 1. Create a Demo Vendor
    const { data: vendor, error: vendorError } = await supabase
        .from('vendors')
        .insert({
            name: 'CircuitPro Supplies',
            email: 'sales@circuitpro.demo'
        })
        .select()
        .single();

    // If vendor table doesn't exist yet or fails, we might need to handle it. 
    // For now assuming the SQL migration was run.
    // If vendor creation fails (e.g. duplicate), try to fetch the existing one.
    let vendorId = vendor?.id;

    if (!vendorId) {
        const { data: existing } = await supabase.from('vendors').select('id').limit(1).single();
        vendorId = existing?.id;
    }

    if (!vendorId) {
        return NextResponse.json({ error: "Could not create or find vendor. Please run the SQL migrations first." }, { status: 500 });
    }

    // 2. Insert Products
    const products = [
        {
            vendor_id: vendorId,
            name: 'Cutler-Hammer E125S Industrial Circuit Breaker 100A',
            description: 'Original Cutler-Hammer E125S 3-Pole Circuit Breaker. 100 Amps, 600 VAC. Cat# EGS3100AFG. Condition: New Surplus in Box. Perfect for industrial panels.',
            category: 'Circuit Breakers',
            price: 450.00,
            currency: 'USD',
            is_used: false,
            images: ['https://m.media-amazon.com/images/I/71u+m+22+TL._AC_SL1500_.jpg'], // Using a similar public image for demo
            status: 'approved',

            // Auction Settings
            is_auction: true,
            auction_start_price: 150.00,
            auction_current_price: 150.00,
            auction_end_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(), // Ends in 3 days
            auction_status: 'running'
        },
        {
            vendor_id: vendorId,
            name: 'Siemens 3RT1054-1AP36 Contactor',
            description: 'Heavy duty power contactor, AC-3 115 A, 55 kW / 400 V. Used, tested working.',
            category: 'Contactors',
            price: 120.00,
            currency: 'USD',
            is_used: true,
            condition_rating: 4,
            images: ['https://m.media-amazon.com/images/I/61k8Q1+2+TL._AC_SL1000_.jpg'],
            status: 'approved',
            is_auction: false
        },
        {
            vendor_id: vendorId,
            name: 'Fluke 87V Industrial Multimeter',
            description: 'The standard for industrial troubleshooting. Includes leads and case.',
            category: 'Test Equipment',
            price: 350.00,
            currency: 'USD',
            is_used: false,
            images: ['https://m.media-amazon.com/images/I/61Kq-Pz-yuL._AC_SL1500_.jpg'],
            status: 'approved',

            // Auction Settings
            is_auction: true,
            auction_start_price: 200.00,
            auction_current_price: 260.00, // Has bids
            auction_end_at: new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString(), // Ends in 4 hours
            auction_status: 'running'
        }
    ];

    const { error: productsError } = await supabase
        .from('products')
        .insert(products);

    if (productsError) {
        return NextResponse.json({ error: productsError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Database seeded with Cutler-Hammer E125S and other items." });
}
