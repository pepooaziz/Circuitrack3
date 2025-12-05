import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';

export default function VendorEarningsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Earnings & Payouts</h1>
                <p className="text-slate-500">Track your revenue and request withdrawals.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-green-50 border-green-100">
                    <CardContent className="p-6">
                        <p className="text-green-600 font-medium mb-1">Available Balance</p>
                        <h3 className="text-3xl font-bold text-green-700">$1,250.00</h3>
                        <Button className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white">
                            Request Payout
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <p className="text-slate-500 font-medium mb-1">Total Earnings (All Time)</p>
                        <h3 className="text-3xl font-bold text-slate-900">$15,420.00</h3>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <p className="text-slate-500 font-medium mb-1">Pending Clearance</p>
                        <h3 className="text-3xl font-bold text-slate-900">$340.00</h3>
                    </CardContent>
                </Card>
            </div>

            {/* Transaction History Mock */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="p-3 font-medium text-slate-600">Date</th>
                                <th className="p-3 font-medium text-slate-600">Description</th>
                                <th className="p-3 font-medium text-slate-600">Status</th>
                                <th className="p-3 font-medium text-slate-600 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            <tr>
                                <td className="p-3 text-slate-500">Oct 24, 2024</td>
                                <td className="p-3 font-medium">Order #1024 - Circuit Breaker</td>
                                <td className="p-3"><span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">Cleared</span></td>
                                <td className="p-3 text-right font-bold text-green-600">+$450.00</td>
                            </tr>
                            <tr>
                                <td className="p-3 text-slate-500">Oct 23, 2024</td>
                                <td className="p-3 font-medium">Payout Request</td>
                                <td className="p-3"><span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs">Processing</span></td>
                                <td className="p-3 text-right font-bold text-slate-900">-$2,000.00</td>
                            </tr>
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
