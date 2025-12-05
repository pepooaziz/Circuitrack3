"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditProductPage() {
    const params = useParams();
    const router = useRouter();

    const lang = params?.lang as string;
    const id = params?.id as string;

    const isArabic = lang === "ar";

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        title_en: "",
        title_ar: "",
        title_zh: "",
        desc_en: "",
        desc_ar: "",
        desc_zh: "",
        brand: "",
        model: "",
        price: "",
        currency: "USD",
        condition: "NEW",
        quantity: 1
    });

    // Load current product
    useEffect(() => {
        async function load() {
            try {
                const res = await fetch("/api/vendor/products", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ vendorId: "TEST-VENDOR-123" }) // Or null/specific ID
                });

                const data = await res.json();
                if (data.products) {
                    const product = data.products.find((p: any) => p.id === id);
                    if (product) {
                        // --- MAPPING LOGIC (DB -> Frontend) ---
                        setForm({
                            title_en: product.title_en || "",
                            title_ar: product.title_ar || "",
                            title_zh: product.title_zh || "",

                            // Collapse detailed_description JSON to flat fields
                            desc_en: product.detailed_description?.en || "",
                            desc_ar: product.detailed_description?.ar || "",
                            desc_zh: product.detailed_description?.zh || "",

                            brand: product.brand || "",
                            model: product.model || "",
                            price: product.price || "",
                            currency: product.currency || "USD",

                            // Map REFURBISHED back to REFURB for select option
                            condition: product.condition === 'REFURBISHED' ? 'REFURB' : (product.condition || "NEW"),

                            // Map stock back to quantity
                            quantity: product.stock || 1
                        });
                    }
                }
            } catch (err) {
                console.error("Failed to load product", err);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [id]);

    function update(key: string, value: any) {
        setForm({ ...form, [key]: value });
    }

    async function save() {
        setSaving(true);

        const res = await fetch("/api/vendor/products/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id,
                updates: form
            })
        });

        const data = await res.json();
        setSaving(false);

        if (data.ok) {
            alert(isArabic ? "تم حفظ التعديلات" : "Product updated successfully");
            router.push(`/${lang}/vendor/products`);
        } else {
            alert(data.message || "Failed to update");
        }
    }

    if (loading) return <div className="p-6 text-center text-lg">{isArabic ? "جار التحميل..." : "Loading..."}</div>;

    return (
        <div className={`p-6 max-w-3xl mx-auto mt-16 ${isArabic ? "text-right" : "text-left"}`}>
            <h1 className="text-2xl font-bold mb-6 text-slate-900 border-b pb-4">
                {isArabic ? "تعديل المنتج" : "Edit Product"}
            </h1>

            <div className="grid gap-6 bg-white p-6 rounded-xl border shadow-sm">

                {/* --- TITLES --- */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-slate-700">{isArabic ? "العناوين" : "Titles"}</h3>
                    <input
                        className="w-full border p-2 rounded-lg"
                        placeholder="Title (English)"
                        value={form.title_en}
                        onChange={(e) => update("title_en", e.target.value)}
                    />
                    <input
                        className="w-full border p-2 rounded-lg"
                        placeholder="العنوان (عربي)"
                        value={form.title_ar}
                        onChange={(e) => update("title_ar", e.target.value)}
                        dir="rtl"
                    />
                    <input
                        className="w-full border p-2 rounded-lg"
                        placeholder="标题 (中文)"
                        value={form.title_zh}
                        onChange={(e) => update("title_zh", e.target.value)}
                    />
                </div>

                {/* --- DESCRIPTIONS --- */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-slate-700">{isArabic ? "الوصف" : "Descriptions"}</h3>
                    <textarea
                        className="w-full border p-2 rounded-lg h-24"
                        placeholder="Description (English)"
                        value={form.desc_en}
                        onChange={(e) => update("desc_en", e.target.value)}
                    />
                    <textarea
                        className="w-full border p-2 rounded-lg h-24"
                        placeholder="الوصف (عربي)"
                        value={form.desc_ar}
                        onChange={(e) => update("desc_ar", e.target.value)}
                        dir="rtl"
                    />
                    <textarea
                        className="w-full border p-2 rounded-lg h-24"
                        placeholder="描述 (中文)"
                        value={form.desc_zh}
                        onChange={(e) => update("desc_zh", e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        className="border p-2 rounded-lg"
                        placeholder={isArabic ? "البراند" : "Brand"}
                        value={form.brand}
                        onChange={(e) => update("brand", e.target.value)}
                    />

                    <input
                        className="border p-2 rounded-lg"
                        placeholder={isArabic ? "الموديل" : "Model"}
                        value={form.model}
                        onChange={(e) => update("model", e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* PRICE */}
                    <div className="flex gap-2">
                        <input
                            className="flex-1 border p-2 rounded-lg"
                            placeholder={isArabic ? "السعر" : "Price"}
                            type="number"
                            value={form.price}
                            onChange={(e) => update("price", e.target.value)}
                        />

                        <select
                            className="w-24 border p-2 rounded-lg bg-slate-50"
                            value={form.currency}
                            onChange={(e) => update("currency", e.target.value)}
                        >
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="SAR">SAR</option>
                            <option value="AED">AED</option>
                            <option value="EGP">EGP</option>
                        </select>
                    </div>

                    {/* CONDITION */}
                    <select
                        className="border p-2 rounded-lg bg-white"
                        value={form.condition}
                        onChange={(e) => update("condition", e.target.value)}
                    >
                        <option value="NEW">{isArabic ? "جديد" : "New"}</option>
                        <option value="USED">{isArabic ? "مستعمل" : "Used"}</option>
                        <option value="REFURB">{isArabic ? "مُجدد" : "Refurbished"}</option>
                    </select>

                    {/* QUANTITY */}
                    <input
                        className="border p-2 rounded-lg"
                        type="number"
                        placeholder={isArabic ? "الكمية" : "Quantity"}
                        value={form.quantity}
                        onChange={(e) => update("quantity", e.target.value)}
                    />
                </div>

                <button
                    onClick={save}
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg mt-4 font-bold transition-colors disabled:opacity-50"
                >
                    {saving
                        ? isArabic ? "جار الحفظ..." : "Saving..."
                        : isArabic ? "حفظ التعديلات" : "Save Changes"}
                </button>

            </div>
        </div>
    );
}
