"use client";

import { useStore } from "@/context/StoreContext";
import { useTranslations } from "next-intl";
import { Repeat2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTitle, getConditionLabel } from "@/lib/productUtils";

export default function ComparePage({ params: { lang } }: { params: { lang: string } }) {
    const t = useTranslations("compare");
    const { compare, removeFromCompare } = useStore();

    if (compare.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center mt-16">
                <div className="bg-orange-50 p-6 rounded-full mb-6">
                    <Repeat2 size={48} className="text-orange-500" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">{t("empty")}</h1>
                <p className="text-slate-600">{lang === 'ar' ? "لم تقم بإضافة أي منتجات للمقارنة بعد" : "You haven't added any products to compare yet"}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-10 mt-16">
            <h1 className="text-3xl font-bold mb-8 text-slate-900">{t("title")}</h1>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-xl shadow-sm overflow-hidden">
                    <thead>
                        <tr className="bg-slate-100">
                            <th className="p-4 text-left font-semibold text-slate-700 border-b">
                                {lang === 'ar' ? "المواصفة" : "Specification"}
                            </th>
                            {compare.map((product) => (
                                <th key={product.id} className="p-4 border-b relative">
                                    <button
                                        onClick={() => removeFromCompare(product.id)}
                                        className="absolute top-2 right-2 p-1 hover:bg-red-50 rounded-full text-red-500"
                                    >
                                        <X size={16} />
                                    </button>
                                    <div className="text-sm font-semibold text-slate-900 line-clamp-2">
                                        {getTitle(product, lang)}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {/* Image Row */}
                        <tr className="border-b">
                            <td className="p-4 font-medium text-slate-600">{lang === 'ar' ? "الصورة" : "Image"}</td>
                            {compare.map((product) => (
                                <td key={product.id} className="p-4">
                                    <div className="w-32 h-32 mx-auto bg-slate-50 rounded-lg flex items-center justify-center">
                                        <img
                                            src={product.image}
                                            alt={getTitle(product, lang)}
                                            className="object-contain max-h-full max-w-full mix-blend-multiply"
                                        />
                                    </div>
                                </td>
                            ))}
                        </tr>

                        {/* Brand Row */}
                        <tr className="border-b bg-slate-50">
                            <td className="p-4 font-medium text-slate-600">{lang === 'ar' ? "الماركة" : "Brand"}</td>
                            {compare.map((product) => (
                                <td key={product.id} className="p-4 text-center">{product.brand || "-"}</td>
                            ))}
                        </tr>

                        {/* Model Row */}
                        <tr className="border-b">
                            <td className="p-4 font-medium text-slate-600">{lang === 'ar' ? "الموديل" : "Model"}</td>
                            {compare.map((product) => (
                                <td key={product.id} className="p-4 text-center">{product.model || "-"}</td>
                            ))}
                        </tr>

                        {/* Condition Row */}
                        <tr className="border-b bg-slate-50">
                            <td className="p-4 font-medium text-slate-600">{lang === 'ar' ? "الحالة" : "Condition"}</td>
                            {compare.map((product) => (
                                <td key={product.id} className="p-4 text-center">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${product.condition === 'NEW' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {getConditionLabel(product.condition, lang)}
                                    </span>
                                </td>
                            ))}
                        </tr>

                        {/* Price Row */}
                        <tr className="border-b">
                            <td className="p-4 font-medium text-slate-600">{lang === 'ar' ? "السعر" : "Price"}</td>
                            {compare.map((product) => (
                                <td key={product.id} className="p-4 text-center">
                                    <div className="font-bold text-lg text-blue-600" dir="rtl">
                                        {product.price.toLocaleString()} {product.currency || 'ج.م'}
                                    </div>
                                </td>
                            ))}
                        </tr>

                        {/* Category Row */}
                        <tr className="border-b bg-slate-50">
                            <td className="p-4 font-medium text-slate-600">{lang === 'ar' ? "الفئة" : "Category"}</td>
                            {compare.map((product) => (
                                <td key={product.id} className="p-4 text-center">{product.category || "-"}</td>
                            ))}
                        </tr>

                        {/* Specs Rows - Dynamic based on available specs */}
                        {compare.some(p => p.specs) && Object.keys(compare[0].specs || {}).map((specKey) => (
                            <tr key={specKey} className="border-b">
                                <td className="p-4 font-medium text-slate-600 capitalize">{specKey.replace(/_/g, ' ')}</td>
                                {compare.map((product) => (
                                    <td key={product.id} className="p-4 text-center text-sm">
                                        {product.specs?.[specKey] || "-"}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 text-center">
                <Button
                    variant="outline"
                    onClick={() => compare.forEach(p => removeFromCompare(p.id))}
                    className="text-red-500 hover:bg-red-50"
                >
                    {lang === 'ar' ? "مسح الكل" : "Clear All"}
                </Button>
            </div>
        </div>
    );
}
