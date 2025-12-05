"use client";

import { useStore } from "@/context/StoreContext";
import { useTranslations } from "next-intl";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getTitle, getConditionLabel } from "@/lib/productUtils";

export default function WishlistPage({ params: { lang } }: { params: { lang: string } }) {
    const t = useTranslations("wishlist");
    const { wishlist, toggleWishlist, addToCart } = useStore();

    if (wishlist.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center mt-16">
                <div className="bg-red-50 p-6 rounded-full mb-6">
                    <Heart size={48} className="text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">{t("empty")}</h1>
            </div>
        );
    }

    const moveToCart = (item: any) => {
        addToCart(item);
        toggleWishlist(item); // Remove from wishlist after adding to cart
        toast.success("تم نقل المنتج إلى السلة");
    };

    return (
        <div className="container mx-auto px-4 py-10 mt-16">
            <h1 className="text-3xl font-bold mb-8 text-slate-900">{t("title")}</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {wishlist.map((item) => {
                    const displayTitle = getTitle(item, lang);
                    const displayCondition = getConditionLabel(item.condition, lang);

                    return (
                        <div
                            key={item.id}
                            className="bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col p-4 group"
                        >
                            <div className="relative w-full h-48 bg-slate-50 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                                <img
                                    src={item.image}
                                    alt={displayTitle}
                                    className="object-contain max-h-full max-w-full mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                                />
                                <button
                                    onClick={() => toggleWishlist(item)}
                                    className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white rounded-full text-red-500 shadow-sm backdrop-blur-sm"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="flex-1">
                                <h3 className="font-semibold text-slate-900 line-clamp-2 mb-1">{displayTitle}</h3>
                                <p className="text-sm text-slate-500 mb-2">{displayCondition}</p>
                                <div className="font-bold text-lg text-primary" dir="rtl">
                                    {(typeof item.price === 'number' ? item.price : parseFloat(item.price as string)).toLocaleString()} ج.م
                                </div>
                            </div>

                            <Button
                                className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white"
                                onClick={() => moveToCart(item)}
                            >
                                <ShoppingCart className="w-4 h-4 mr-2" /> {t("moveToCart")}
                            </Button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
