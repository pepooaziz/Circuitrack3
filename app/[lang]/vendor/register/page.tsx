import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function VendorRegisterPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Card className="max-w-xl w-full">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Become a CircuitRack Vendor</CardTitle>
                    <p className="text-center text-slate-500">Join the marketplace for professional electronics trading.</p>
                </CardHeader>
                <CardContent>
                    <form className="space-y-6">
                        <div className="space-y-2">
                            <Label>Company Name</Label>
                            <Input placeholder="Tech Solutions Ltd." />
                        </div>

                        <div className="space-y-2">
                            <Label>Business Email</Label>
                            <Input type="email" placeholder="sales@techsolutions.com" />
                        </div>

                        <div className="space-y-2">
                            <Label>Country / Region</Label>
                            <Input placeholder="United States" />
                        </div>

                        <div className="space-y-2">
                            <Label>Company Bio / Description</Label>
                            <Textarea placeholder="We specialize in..." />
                        </div>

                        <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                            Submit Application
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
