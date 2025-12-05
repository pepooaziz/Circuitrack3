import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function VendorDashboardPage() {
    const t = useTranslations('vendor');

    // These would be fetched from Supabase in real implementation
    // const supabase = createClient();
    // const { count: productsCount } = await supabase.from('products').select('*', { count: 'exact', head: true });

    const stats = [
        { label: t('totalProducts'), value: "12", icon: Package, color: "text-blue-600", bg: "bg-blue-100" },
        { label: t('totalEarnings'), value: "$4,250.00", icon: DollarSign, color: "text-green-600", bg: "bg-green-100" },
        { label: t('recentOrders'), value: "8", icon: ShoppingCart, color: "text-purple-600", bg: "bg-purple-100" },
        { label: t('boost'), value: "2 Active", icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-100" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">{t('dashboard')}</h1>
                <p className="text-slate-500">Welcome back to your vendor control center.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                                    <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                                </div>
                                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${stat.bg}`}>
                                    <Icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Recent Activity / Charts Placeholders */}
            <div className="grid lg:grid-cols-2 gap-6">
                <Card className="h-80 flex items-center justify-center border-dashed bg-slate-50/50">
                    <p className="text-slate-400">Earnings Chart Placeholder</p>
                </Card>
                <Card className="h-80 flex items-center justify-center border-dashed bg-slate-50/50">
                    <p className="text-slate-400">Recent Orders Table Placeholder</p>
                </Card>
            </div>
        </div>
    );
}
