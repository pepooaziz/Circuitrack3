import { NextRequest, NextResponse } from 'next/server';
import { compareStore } from '@/lib/compareStore';
import { Product } from '@/types/product';

export const dynamic = 'force-dynamic'; // No caching for user-specific lists

// GET: Fetch compare list
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
    }

    const list = compareStore.getList(userId);
    return NextResponse.json(list, { status: 200 });
}

// POST: Add item
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, product }: { userId: string; product: Product } = body;

        if (!userId || !product || !product.id) {
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }

        const updatedList = compareStore.addItem(userId, product);
        return NextResponse.json(updatedList, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
}

// DELETE: Remove item
export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const productId = searchParams.get('id');

    if (!userId || !productId) {
        return NextResponse.json({ error: 'Missing userId or productId' }, { status: 400 });
    }

    const updatedList = compareStore.removeItem(userId, productId);
    return NextResponse.json(updatedList, { status: 200 });
}
