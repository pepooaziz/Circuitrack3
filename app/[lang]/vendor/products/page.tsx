"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getTitle, getConditionLabel } from "@/lib/productUtils";

export default function VendorProductsPage() {
    const params = useParams();
    const lang = params?.lang as string;
    const isArabic = lang === "ar";
    const TEST_VENDOR_ID = "TEST-VENDOR-123";

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            // Use the TEST ID to match what we put in the edit page so we see data
            const res = await fetch("/api/vendor/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ vendorId: TEST_VENDOR_ID }),
            });

            const data = await res.json();
            if (data.ok) setProducts(data.products || []);
            setLoading(false);
        }
        load();
    }, [TEST_VENDOR_ID]);

    return (
        <div className={`p-6 mt-16 max-w-7xl mx-auto ${isArabic ? "text-right" : "text-left"}`}>
            <h1 className="text-2xl font-bold mb-4">
                {isArabic ? "منتجاتي" : "My Products"}
            </h1>

            <div className="flex justify-between items-center mb-6">
                <input
                    placeholder={isArabic ? "بحث عن منتج..." : "Search products..."}
                    className="border px-3 py-2 rounded-lg w-64 text-sm"
                />

                <a
                    href={`/${lang}/vendor/products/new`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                    {isArabic ? "إضافة منتج جديد" : "Add New Product"}
                </a>
            </div>

            {loading ? (
                <div className="py-20 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    {isArabic ? "جار التحميل..." : "Loading..."}
                </div>
            ) : products.length === 0 ? (
                <div className="py-20 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <p className="text-gray-500 mb-4">{isArabic ? "لا توجد منتجات حتى الآن" : "No products yet"}</p>
                    <a
                        href={`/${lang}/vendor/products/new`}
                        className="text-blue-600 hover:underline text-sm"
                    >
                        {isArabic ? "ابدأ بإضافة أول منتج" : "Start by adding your first product"}
                    </a>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((p) => {
                        const displayTitle = getTitle(p, lang);
                        const displayCondition = getConditionLabel(p.condition, lang);

                        return (
                            <div
                                key={p.id}
                                className="border rounded-xl p-4 shadow-sm bg-white hover:shadow-md transition flex flex-col"
                            >
                                <div className="flex-1">
                                    <h2 className="font-semibold text-lg mb-2 line-clamp-1">
                                        {displayTitle}
                                    </h2>

                                    <p className="text-xs text-blue-600 font-semibold mb-2 uppercase tracking-wide">
                                        {p.brand} • {p.model}
                                    </p>

                                    <div className="text-sm text-gray-600 space-y-1 mb-4">
                                        <p>
                                            <span className="text-gray-400">{isArabic ? "السعر:" : "Price:"}</span>{" "}
                                            <span className="font-bold text-slate-900">{p.price} {p.currency}</span>
                                        </p>
                                        <p>
                                            <span className="text-gray-400">{isArabic ? "الحالة:" : "Condition:"}</span>{" "}
                                            {/* Condition Label with localized text */}
                                            <span className={`font-medium px-2 py-0.5 rounded text-xs ${p.condition === 'NEW' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {displayCondition}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t flex justify-between items-center text-sm">
                                    <a
                                        href={`/${lang}/vendor/products/edit/${p.id}`}
                                        className="text-blue-600 font-medium hover:bg-blue-50 px-3 py-1.5 rounded transition-colors"
                                    >
                                        {isArabic ? "تعديل" : "Edit"}
                                    </a>

                                    <button
                                        className="text-red-500 font-medium hover:bg-red-50 px-3 py-1.5 rounded transition-colors"
                                        onClick={() => alert("Delete not implemented yet")}
                                    >
                                        {isArabic ? "حذف" : "Delete"}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
