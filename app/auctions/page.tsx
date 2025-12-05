import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Gavel } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

async function getAuctions() {
  const supabase = await createClient();

  const { data: auctions, error } = await supabase
    .from('auctions')
    .select(`
      *,
      product:products(
        name_en,
        product_images(url, is_primary)
      ),
      vendor:vendors(name, company_name)
    `)
    .in('status', ['ACTIVE', 'PENDING_APPROVAL'])
    .order('end_at', { ascending: true })
    .limit(12);

  if (error) {
    console.error('Error fetching auctions:', error);
    return [];
  }

  return auctions || [];
}

async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: userData } = await supabase
    .from('users')
    .select('email, role')
    .eq('id', user.id)
    .single();

  return userData;
}

function getTimeRemaining(endDate: string) {
  const now = new Date();
  const end = new Date(endDate);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return 'Ended';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `${days}d ${hours}h`;
  return `${hours}h`;
}

export default async function AuctionsPage() {
  const auctions = await getAuctions();
  const user = await getUser();

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Live Auctions</h1>
          <p className="text-lg text-slate-600">Bid on electronics and get the best deals</p>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {auctions.map((auction: any) => {
            const primaryImage = auction.product?.product_images?.find((img: any) => img.is_primary)?.url ||
                                auction.product?.product_images?.[0]?.url ||
                                'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400';

            const timeRemaining = getTimeRemaining(auction.end_at);
            const isActive = auction.status === 'ACTIVE';

            return (
              <Card key={auction.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 bg-slate-100">
                  <Image
                    src={primaryImage}
                    alt={auction.product?.name_en || 'Auction item'}
                    fill
                    className="object-cover"
                  />
                  <Badge
                    className="absolute top-2 right-2"
                    variant={isActive ? "default" : "secondary"}
                  >
                    {isActive ? 'Active' : 'Pending'}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-2">{auction.product?.name_en}</CardTitle>
                  <p className="text-sm text-slate-600">{auction.vendor?.company_name}</p>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm text-slate-600">Current Bid</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${auction.current_price || auction.start_price}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="h-4 w-4" />
                    <span>{timeRemaining}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/auctions/${auction.id}`} className="w-full">
                    <Button className="w-full">
                      <Gavel className="h-4 w-4 mr-2" />
                      Place Bid
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {auctions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-slate-600">No active auctions at the moment.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
