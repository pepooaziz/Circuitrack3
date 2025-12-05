"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client"; // Assumes client-side supabase helper exists, if not I'll use direct createClient
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import AuctionCountdown from "./AuctionCountdown";
import AuctionBidBox from "./AuctionBidBox";
import BidHistory from "./BidHistory";
import { useTranslations } from "next-intl";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"; // Fallback import

interface LiveAuctionProps {
    initialAuction: any;
    initialBids: any[];
    auctionId: string;
}

export default function LiveAuctionContainer({ initialAuction, initialBids, auctionId }: LiveAuctionProps) {
    const [auction, setAuction] = useState(initialAuction);
    const [bids, setBids] = useState(initialBids);
    const t = useTranslations("auctions");

    // Initialize Supabase Client
    // Note: Adjust import based on your actual project structure for Supabase client
    // Using standard createClient for now, assuming public key is exposed
    const supabase = createClientComponentClient ? createClientComponentClient() : null;

    useEffect(() => {
        if (!supabase) return;

        // 1. Subscribe to Product Updates (Price change)
        const productChannel = supabase
            .channel(`product-${auctionId}`)
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'products', filter: `id=eq.${auctionId}` },
                (payload: any) => {
                    setAuction(payload.new);
                }
            )
            .subscribe();

        // 2. Subscribe to New Bids
        const bidsChannel = supabase
            .channel(`bids-${auctionId}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'bids', filter: `product_id=eq.${auctionId}` },
                (payload: any) => {
                    // Add new bid to list instantly
                    setBids((prev) => [payload.new, ...prev]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(productChannel);
            supabase.removeChannel(bidsChannel);
        };
    }, [auctionId, supabase]);

    if (!supabase) {
        // Fallback if supabase client setup is missing in browser
        return <div>Realtime disabled: Supabase client not configured correctly. Refresh manually.</div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <div className="flex gap-2 mb-4">
                    <Badge className="bg-red-600 animate-pulse">{t("live")}</Badge>
                    <Badge variant="outline">{auction.category}</Badge>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">{auction.name}</h1>
                <p className="text-slate-600">{auction.description}</p>
            </div>

            <Card className="p-6 bg-white border-blue-100 shadow-md transition-all duration-300">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <p className="text-sm text-slate-500 uppercase tracking-widest font-semibold">
                            {t("currentBid")}
                        </p>
                        <p className="text-4xl font-bold text-blue-700 mt-1 transition-all duration-500 key={auction.auction_current_price}">
                            ${auction.auction_current_price}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-slate-500 mb-1">{t("endingIn")}</p>
                        <AuctionCountdown endDate={auction.auction_end_at} />
                    </div>
                </div>

                {/* Bid Box Component */}
                <AuctionBidBox auctionId={auction.id} currentPrice={auction.auction_current_price} />
            </Card>

            {/* Realtime Bid History */}
            <BidHistory bids={bids} />
        </div>
    );
}
