import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminAuctionsPage({ params: { lang } }: { params: { lang: string } }) {
    const supabase = createClient();

    // Fetch all auctions (running or ended)
    const { data: auctions } = await (await supabase)
        .from('products')
        .select('*')
        .eq('is_auction', true)
        .order('created_at', { ascending: false });

    return (
        <div className="min-h-screen bg-slate-100 py-10">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">Admin Auction Control</h1>
                    <Badge variant="outline" className="bg-white">Admin Access</Badge>
                </div>

                <div className="bg-white rounded-xl shadow border overflow-hidden">
                    <table className="w-full text-left hidden md:table">
                        <thead className="bg-slate-50 border-b">
                            <tr>
                                <th className="p-4 font-semibold text-slate-600">Product</th>
                                <th className="p-4 font-semibold text-slate-600">Status</th>
                                <th className="p-4 font-semibold text-slate-600">Current Price</th>
                                <th className="p-4 font-semibold text-slate-600">Ends At</th>
                                <th className="p-4 font-semibold text-slate-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {auctions?.map((auction: any) => (
                                <tr key={auction.id} className="hover:bg-slate-50">
                                    <td className="p-4 font-medium text-slate-900">{auction.name}</td>
                                    <td className="p-4">
                                        <Badge className={
                                            auction.auction_status === 'running' ? 'bg-green-600' :
                                                auction.auction_status === 'ended' ? 'bg-slate-500' : 'bg-yellow-600'
                                        }>
                                            {auction.auction_status}
                                        </Badge>
                                    </td>
                                    <td className="p-4">${auction.auction_current_price}</td>
                                    <td className="p-4 text-sm text-slate-500">
                                        {new Date(auction.auction_end_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <Link href={`/${lang}/auctions/${auction.id}`}>
                                                <Button size="sm" variant="outline">View</Button>
                                            </Link>
                                            {/* In a real app, these buttons would trigger server actions or API calls */}
                                            {auction.auction_status === 'running' && (
                                                <Button size="sm" variant="destructive">Force End</Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Mobile View Placeholder */}
                    <div className="md:hidden p-4 text-center text-slate-500">
                        Please use desktop for admin actions.
                    </div>
                </div>
            </div>
        </div>
    );
}
