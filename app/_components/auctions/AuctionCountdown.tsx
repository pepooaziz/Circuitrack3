"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function AuctionCountdown({ endDate }: { endDate: string }) {
    const t = useTranslations("auctions");
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const end = new Date(endDate).getTime();
            const difference = end - now;

            if (difference <= 0) {
                clearInterval(timer);
                setTimeLeft(t("ended"));
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        }, 1000);

        return () => clearInterval(timer);
    }, [endDate, t]);

    return (
        <div className="font-mono text-sm font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">
            {timeLeft}
        </div>
    );
}
