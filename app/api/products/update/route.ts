import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json({ ok: false, message: "Product ID is required" }, { status: 400 });
        }

        // Isolate detailed_description construction
        const detailed_description = {
            en: updates.description_en,
            ar: updates.description_ar,
            zh: updates.description_zh
        };

        // Clean up body for update
        const updatePayload = {
            title_en: updates.title_en,
            title_ar: updates.title_ar,
            title_zh: updates.title_zh,
            brand: updates.brand,
            model: updates.model,
            category: updates.category,
            condition: updates.condition,
            price: updates.price,
            currency: updates.currency,
            stock: updates.stock,
            technical_specs: updates.technical_specs,
            detailed_description,
            seo_keywords: updates.seo_keywords
        };

        const { data, error } = await supabase
            .from("products")
            .update(updatePayload)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("Supabase update error:", error);
            return NextResponse.json(
                { ok: false, message: "Failed to update product", error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { ok: true, message: "Product updated", product: data },
            { status: 200 }
        );
    } catch (err: any) {
        console.error("API /products/update PUT error:", err);
        return NextResponse.json(
            { ok: false, message: "Unexpected error", error: err?.message },
            { status: 500 }
        );
    }
}
