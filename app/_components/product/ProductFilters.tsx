"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';

export default function ProductFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    //   const t = useTranslations('products'); // Assuming keys exist

    // Local State
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
    const [condition, setCondition] = useState<string>(searchParams.get('condition') || 'all');
    const [search, setSearch] = useState<string>(searchParams.get('search') || '');

    // Debounce for URL updates could be added, but manual Apply is safer for now
    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value && value !== 'all') {
                params.set(name, value);
            } else {
                params.delete(name);
            }
            // Reset page when filter changes
            if (name !== 'page') {
                params.set('page', '1');
            }
            return params.toString();
        },
        [searchParams]
    );

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());

        // Condition
        if (condition !== 'all') params.set('condition', condition);
        else params.delete('condition');

        // Price
        params.set('min_price', priceRange[0].toString());
        params.set('max_price', priceRange[1].toString());

        // Search
        if (search) params.set('search', search);
        else params.delete('search');

        params.set('page', '1');

        router.push(`?${params.toString()}`);
    };

    return (
        <Card className="h-fit sticky top-24">
            <CardHeader>
                <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

                {/* Search */}
                <div className="space-y-2">
                    <Label>Search</Label>
                    <Input
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Condition */}
                <div className="space-y-2">
                    <Label>Condition</Label>
                    <RadioGroup value={condition} onValueChange={setCondition}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="all" id="all" />
                            <Label htmlFor="all">All</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="new" id="new" />
                            <Label htmlFor="new">New Only</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="used" id="used" />
                            <Label htmlFor="used">Used Only</Label>
                        </div>
                    </RadioGroup>
                </div>

                {/* Price Range */}
                <div className="space-y-4">
                    <div className="flex justify-between">
                        <Label>Price Range</Label>
                        <span className="text-sm text-slate-500">${priceRange[0]} - ${priceRange[1]}</span>
                    </div>
                    <Slider
                        defaultValue={[0, 5000]}
                        max={5000}
                        step={10}
                        value={priceRange}
                        onValueChange={(val) => setPriceRange([val[0], val[1]])}
                        className="w-full"
                    />
                </div>

                <Button onClick={applyFilters} className="w-full">
                    Apply Filters
                </Button>
            </CardContent>
        </Card>
    );
}
