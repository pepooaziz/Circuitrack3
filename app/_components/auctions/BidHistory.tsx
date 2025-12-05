"use client";

import { useTranslations } from "next-intl";

export default function BidHistory({ bids }: { bids: any[] }) {
    const t = useTranslations("auctions");

    return (
        <div>
            <h3 className="font-semibold text-lg mb-4">{t("bidHistory")}</h3>
            <div className="bg-white rounded-xl border overflow-hidden">
                {bids && bids.length > 0 ? (
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500">
                            <tr>
                                <th className="p-4 font-medium">User</th>
                                <th className="p-4 font-medium">Amount</th>
                                <th className="p-4 font-medium">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {bids.map((bid: any) => (
                                <tr key={bid.id} className="animate-in fade-in slide-in-from-top-1 duration-500">
                                    <td className="p-4 text-slate-600">
                                        User_{bid.user_id ? bid.user_id.slice(0, 4) : "Anon"}
                                    </td>
                                    <td className="p-4 font-semibold text-slate-900">
                                        ${bid.bid_amount}
                                    </td>
                                    <td className="p-4 text-slate-400">
                                        {new Date(bid.created_at).toLocaleTimeString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="p-8 text-center text-slate-500">
                        No bids yet.
                    </div>
                )}
            </div>
        </div>
    );
}
