"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, Check } from "lucide-react";

export default function LanguageSwitcher({ locale }: { locale: string }) {
    const pathname = usePathname();
    const router = useRouter();

    const locales = [
        { code: "en", label: "English" },
        { code: "ar", label: "العربية" },
        { code: "zh", label: "中文" }
    ];

    const switchLanguage = (lng: string) => {
        if (!pathname) return;
        const segments = pathname.split("/");

        // Replace old language with new one
        segments[1] = lng;

        const newUrl = segments.join("/");
        router.push(newUrl);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                    <Globe className="h-5 w-5 text-slate-700" />
                    <span className="sr-only">Switch Language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[120px]">
                {locales.map((lng) => (
                    <DropdownMenuItem
                        key={lng.code}
                        onClick={() => switchLanguage(lng.code)}
                        className="flex items-center justify-between cursor-pointer"
                    >
                        <span>{lng.label}</span>
                        {locale === lng.code && <Check className="h-4 w-4 text-blue-600" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
