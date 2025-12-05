import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AuctionCountdown from './AuctionCountdown';
import { useTranslations } from 'next-intl';

export default function AuctionCard({ auction, locale }: { auction: any, locale: string }) {
    const t = useTranslations("auctions");
    const image = auction.images?.[0] || 'https://via.placeholder.com/300x200';

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all group h-full flex flex-col border-blue-100">
            <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                <img
                    src={image}
                    alt={auction.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <Badge className="absolute top-2 left-2 bg-red-600 animate-pulse">
                    {t("live")}
                </Badge>
            </div>

            <CardHeader className="p-4 pb-0">
                <h3 className="font-semibold text-lg line-clamp-1">{auction.name}</h3>
            </CardHeader>

            <CardContent className="p-4 pt-2 flex-grow">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-sm text-slate-500">{t("currentBid")}</span>
                    <span className="text-xl font-bold text-blue-700">{auction.currency} {auction.auction_current_price}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">{t("endingIn")}</span>
                    <AuctionCountdown endDate={auction.auction_end_at} />
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
                <Link href={`/${locale}/auctions/${auction.id}`} className="w-full">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        {t("placeBid")}
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
