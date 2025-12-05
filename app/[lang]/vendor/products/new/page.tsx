"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

type Condition = "NEW" | "USED" | "REFURBISHED";

export default function NewProductPage() {
    const router = useRouter();
    const params = useParams();
    const lang = params?.lang as string; // "ar" | "en" | "zh"

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // نموذج بسيط – يمكنك لاحقاً ربطه بـ vendorId من الجلسة
    const [form, setForm] = useState({
        title_en: "",
        title_ar: "",
        title_zh: "",
        brand: "",
        model: "",
        category: "MCCB",
        condition: "USED" as Condition,
        price: "",
        currency: "USD",
        stock: "1",
        // specs JSON كسلسلة – تبقى سهلة في النسخ من برومت الذكاء الاصطناعي
        technical_specs: `{
  "current_rating": "630A",
  "rated_voltage": "690V"
}`,
        description_en: "",
        description_ar: "",
        description_zh: "",
        seo_keywords: "MCCB, Siemens, Circuit Breaker",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            let technicalSpecsParsed: any = null;
            try {
                technicalSpecsParsed = form.technical_specs
                    ? JSON.parse(form.technical_specs)
                    : null;
            } catch {
                setError("صيغة الـ Technical Specs يجب أن تكون JSON صحيح.");
                setLoading(false);
                return;
            }

            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    // TODO: غداً يمكنك ربطه بالـ vendorId الحقيقي من auth
                    vendorId: null,
                    title_en: form.title_en,
                    title_ar: form.title_ar,
                    title_zh: form.title_zh,
                    brand: form.brand,
                    model: form.model,
                    category: form.category,
                    condition: form.condition,
                    price: form.price ? Number(form.price) : null,
                    currency: form.currency,
                    stock: form.stock ? Number(form.stock) : 1,
                    technical_specs: technicalSpecsParsed,
                    description_en: form.description_en,
                    description_ar: form.description_ar,
                    description_zh: form.description_zh,
                    seo_keywords: form.seo_keywords
                        .split(",")
                        .map((k) => k.trim())
                        .filter(Boolean),
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.ok) {
                setError(data?.message || "فشل حفظ المنتج.");
            } else {
                setSuccess("تم إضافة المنتج بنجاح ✅");
                // إعادة توجيه بعد ثانيتين لصفحة منتجات البائع
                setTimeout(() => {
                    router.push(`/${lang}/vendor/products`);
                }, 1500);
            }
        } catch (err: any) {
            console.error(err);
            setError("حدث خطأ غير متوقع.");
        } finally {
            setLoading(false);
        }
    };

    const isArabic = lang === "ar";

    return (
        <div
            className={`max-w-5xl mx-auto px-4 py-8 mt-16 ${isArabic ? "text-right" : "text-left"
                }`}
        >
            <h1 className="text-2xl font-bold mb-4">
                {isArabic ? "إضافة منتج جديد" : "Add New Product"}
            </h1>
            <p className="text-sm text-gray-500 mb-6">
                {isArabic
                    ? "استخدم هذه الصفحة لإدخال منتجات الباور والكنترول والأوتوميشن مثل القواطع والكونتاكتورات…"
                    : "Use this page to add power, control and automation products (MCCBs, contactors, relays, etc.)."}
            </p>

            <form
                onSubmit={handleSubmit}
                className="space-y-6 bg-white shadow-sm border rounded-xl p-6"
            >
                {/* عناوين باللغات الثلاث */}
                <div className="grid md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Title (EN)
                        </label>
                        <input
                            type="text"
                            name="title_en"
                            value={form.title_en}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                            placeholder="Siemens 3VT3 MCCB 630A"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            العنوان (AR)
                        </label>
                        <input
                            type="text"
                            name="title_ar"
                            value={form.title_ar}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                            placeholder="قاطع MCCB سيمنز 630 أمبير"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            标题 (ZH)
                        </label>
                        <input
                            type="text"
                            name="title_zh"
                            value={form.title_zh}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                            placeholder="可选"
                        />
                    </div>
                </div>

                {/* بيانات أساسية */}
                <div className="grid md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Brand / الماركة
                        </label>
                        <input
                            type="text"
                            name="brand"
                            value={form.brand}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                            placeholder="Siemens, ABB, Cutler-Hammer…"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Model / الموديل
                        </label>
                        <input
                            type="text"
                            name="model"
                            value={form.model}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                            placeholder="3VT3 3AA46-0AA0"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Category / الفئة
                        </label>
                        <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                        >
                            <option value="MCCB">MCCB / Circuit Breaker</option>
                            <option value="Contactor">Contactor</option>
                            <option value="Relay">Relay / Protection</option>
                            <option value="Pneumatic">Pneumatic Valve</option>
                            <option value="Remote">Crane Remote</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                {/* السعر والمخزون والحالة */}
                <div className="grid md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Condition / الحالة
                        </label>
                        <select
                            name="condition"
                            value={form.condition}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                        >
                            <option value="NEW">{isArabic ? "جديد" : "New"}</option>
                            <option value="USED">{isArabic ? "مستعمل" : "Used"}</option>
                            <option value="REFURBISHED">
                                {isArabic ? "مُجدد" : "Refurbished"}
                            </option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Price / السعر
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                            placeholder="399.99"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Currency / العملة
                        </label>
                        <input
                            type="text"
                            name="currency"
                            value={form.currency}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                            placeholder="USD / EGP / EUR"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Stock / المخزون
                        </label>
                        <input
                            type="number"
                            name="stock"
                            value={form.stock}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                            placeholder="1"
                        />
                    </div>
                </div>

                {/* Technical Specs JSON */}
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Technical Specs (JSON)
                    </label>
                    <textarea
                        name="technical_specs"
                        value={form.technical_specs}
                        onChange={handleChange}
                        rows={4}
                        className="w-full border rounded-lg px-3 py-2 text-sm font-mono"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        {isArabic
                            ? "انسخ هنا المواصفات التى يولدها الذكاء الاصطناعي بصيغة JSON (تيار، جهد، كسر تيار، معيار IEC...)."
                            : "Paste here the AI-generated technical specs JSON (current, voltage, breaking capacity, IEC standard...)."}
                    </p>
                </div>

                {/* الوصف باللغات الثلاث */}
                <div className="grid md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Description EN
                        </label>
                        <textarea
                            name="description_en"
                            value={form.description_en}
                            onChange={handleChange}
                            rows={3}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            الوصف AR
                        </label>
                        <textarea
                            name="description_ar"
                            value={form.description_ar}
                            onChange={handleChange}
                            rows={3}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            描述 ZH
                        </label>
                        <textarea
                            name="description_zh"
                            value={form.description_zh}
                            onChange={handleChange}
                            rows={3}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                        />
                    </div>
                </div>

                {/* SEO Keywords */}
                <div>
                    <label className="block text-sm font-medium mb-1">
                        SEO Keywords (comma separated)
                    </label>
                    <input
                        type="text"
                        name="seo_keywords"
                        value={form.seo_keywords}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                    />
                </div>

                {/* رسائل الخطأ / النجاح */}
                {error && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
                        {success}
                    </div>
                )}

                {/* الأزرار */}
                <div className="flex items-center gap-3 justify-end">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-4 py-2 text-sm border rounded-lg"
                    >
                        {isArabic ? "إلغاء" : "Cancel"}
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-5 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                    >
                        {loading
                            ? isArabic
                                ? "جارٍ الحفظ..."
                                : "Saving..."
                            : isArabic
                                ? "حفظ المنتج"
                                : "Save Product"}
                    </button>
                </div>
            </form>
        </div>
    );
}
