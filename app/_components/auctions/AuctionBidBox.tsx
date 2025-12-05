"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AuctionBidBox({ auctionId, currentPrice }: { auctionId: string, currentPrice: number }) {
    const t = useTranslations("auctions");
    const router = useRouter();
    const [bidAmount, setBidAmount] = useState<number>(currentPrice + 10);
    const [loading, setLoading] = useState(false);

    const handleBid = async () => {
        if (bidAmount <= currentPrice) {
            toast.error(t("bidTooLow"));
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`/api/auctions/${auctionId}/place-bid`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    bid_amount: bidAmount,
                    // User ID would typically come from auth context
                    user_id: "e43b6f20-xxxx-xxxx-xxxx-xxxxxxxxxxxx" // Mock User ID for demo
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            toast.success(t("bidSuccess"));
            router.refresh();

        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="text-lg font-semibold mb-4">{t("placeBid")}</h3>
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                    <Input
                        type="number"
                        min={currentPrice + 1}
                        value={bidAmount}
                        onChange={(e) => setBidAmount(Number(e.target.value))}
                        className="pl-7"
                    />
                </div>
                <Button onClick={handleBid} disabled={loading} className="bg-blue-600 hover:bg-blue-700 min-w-[100px]">
                    {loading ? "..." : t("submitBid")}
                </Button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
                {t("minBidInfo", { price: currentPrice + 1 })}
            </p>
        </div>
    );
}
