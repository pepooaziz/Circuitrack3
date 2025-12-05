import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
// Note: In a real production app, ensure these env vars are set securely.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase environment variables.");
}

const supabase = createClient(
    supabaseUrl || "",
    supabaseKey || ""
);

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const {
            vendorId,
            title_en,
            title_ar,
            title_zh,
            brand,
            model,
            category,
            condition,
            price,
            currency,
            stock,
            technical_specs,
            description_en,
            description_ar,
            description_zh,
            seo_keywords,
        } = body;

        const { data, error } = await supabase
            .from("products")
            .insert({
                vendor_id: vendorId ?? null,
                title_en,
                title_ar,
                title_zh,
                brand,
                model,
                category,
                condition,
                price,
                currency,
                stock,
                technical_specs,
                detailed_description: {
                    en: description_en,
                    ar: description_ar,
                    zh: description_zh,
                },
                seo_keywords,
            })
            .select()
            .single();

        if (error) {
            console.error("Supabase insert error:", error);
            return NextResponse.json(
                { ok: false, message: "Failed to save product", error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { ok: true, message: "Product created", product: data },
            { status: 201 }
        );
    } catch (err: any) {
        console.error("API /products POST error:", err);
        return NextResponse.json(
            { ok: false, message: "Unexpected error", error: err?.message },
            { status: 500 }
        );
    }
}
