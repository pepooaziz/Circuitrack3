"use client";

import { useStore } from "@/context/StoreContext";
import { useTranslations } from "next-intl";
import { ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CartPage({ params: { lang } }: { params: { lang: string } }) {
    const t = useTranslations("cart");
    const { cart, removeFromCart, updateCartQty } = useStore();

    // Calculate total price accurately (ensure price is treated as number)
    const total = cart.reduce((acc, item) => {
        const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
        return acc + (price || 0) * item.quantity;
    }, 0);

    if (cart.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center mt-16">
                <div className="bg-blue-50 p-6 rounded-full mb-6">
                    <ShoppingCart size={48} className="text-blue-500" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">{t("empty")}</h1>
                <Link href={`/${lang}/products`}>
                    <Button className="mt-4 bg-primary text-white hover:bg-blue-700">
                        {t("startShopping")}
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-10 mt-16">
            <h1 className="text-3xl font-bold mb-8 text-slate-900">{t("title")}</h1>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {cart.map((item) => (
                        <div
                            key={item.id}
                            className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border shadow-sm"
                        >
                            <div className="relative w-24 h-24 flex-shrink-0 bg-slate-50 rounded-lg overflow-hidden flex items-center justify-center">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="object-contain max-h-full max-w-full mix-blend-multiply"
                                />
                            </div>

                            <div className="flex-1 text-center sm:text-left sm:rtl:text-right">
                                <h3 className="font-semibold text-slate-900">{item.title}</h3>
                                <p className="text-sm text-slate-500 mb-2">{item.condition === 'new' ? 'جديد' : 'مستعمل'}</p>
                                <div className="font-bold text-primary" dir="rtl">
                                    {(typeof item.price === 'number' ? item.price : parseFloat(item.price)).toLocaleString()} ج.م
                                </div>
                            </div>

                            {/* Qty & Actions */}
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border rounded-lg">
                                    <button
                                        onClick={() => updateCartQty(item.id, item.quantity - 1)}
                                        className="px-3 py-1 hover:bg-slate-50"
                                    >
                                        -
                                    </button>
                                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                                    <button
                                        onClick={() => updateCartQty(item.id, item.quantity + 1)}
                                        className="px-3 py-1 hover:bg-slate-50"
                                    >
                                        +
                                    </button>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                    onClick={() => removeFromCart(item.id)}
                                >
                                    <Trash2 size={18} />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl border shadow-sm sticky top-24">
                        <h2 className="text-xl font-bold mb-4">{t("total")}</h2>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-slate-600">
                                <span>المجموع الفرعي</span>
                                <span dir="rtl">{total.toLocaleString()} ج.م</span>
                            </div>
                            <div className="border-t pt-3 flex justify-between font-bold text-lg text-slate-900">
                                <span>{t("total")}</span>
                                <span dir="rtl">{total.toLocaleString()} ج.م</span>
                            </div>
                        </div>

                        <Button className="w-full bg-primary hover:bg-blue-700 text-white py-6 text-lg rounded-xl shadow-blue-200 shadow-lg">
                            {t("checkout")} <ArrowRight className="ml-2 w-5 h-5 rtl:rotate-180" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
