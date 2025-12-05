import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { id, updates } = body;

        if (!id) {
            return NextResponse.json(
                { ok: false, message: "Product ID is required" },
                { status: 400 }
            );
        }

        // --- Schema Mapping (Frontend -> DB) ---
        // The frontend sends 'desc_en', 'quantity', 'REFURB' etc.
        // The DB expects 'detailed_description', 'stock', 'REFURBISHED' etc.

        const dbUpdates: any = {};

        // 1. Direct fields mapping
        if (typeof updates.title_en !== 'undefined') dbUpdates.title_en = updates.title_en;
        if (typeof updates.title_ar !== 'undefined') dbUpdates.title_ar = updates.title_ar;
        if (typeof updates.title_zh !== 'undefined') dbUpdates.title_zh = updates.title_zh;
        if (typeof updates.brand !== 'undefined') dbUpdates.brand = updates.brand;
        if (typeof updates.model !== 'undefined') dbUpdates.model = updates.model;
        if (typeof updates.price !== 'undefined') dbUpdates.price = updates.price;
        if (typeof updates.currency !== 'undefined') dbUpdates.currency = updates.currency;

        // 2. Quantity -> Stock
        if (typeof updates.quantity !== 'undefined') dbUpdates.stock = Number(updates.quantity);

        // 3. Condition mapping (REFURB -> REFURBISHED)
        if (updates.condition) {
            dbUpdates.condition = updates.condition === 'REFURB' ? 'REFURBISHED' : updates.condition;
        }

        // 4. Description mapping (Flat -> JSONB)
        // We need to fetch existing description first OR assume valid partial updates if we merge.
        // For simplicity, we construct the object if any desc field is present.
        if (updates.desc_en || updates.desc_ar || updates.desc_zh) {
            // Note: This overrides the whole object. Ideally we should merge with existing, 
            // but for this snippet we construct it from the form values provided.
            dbUpdates.detailed_description = {
                en: updates.desc_en || "",
                ar: updates.desc_ar || "",
                zh: updates.desc_zh || ""
            };
        }

        const { error } = await supabase
            .from("products")
            .update(dbUpdates)
            .eq("id", id);

        if (error) {
            console.error("Supabase update error:", error);
            return NextResponse.json(
                { ok: false, message: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ ok: true });
    } catch (err: any) {
        console.error("Update API Error:", err);
        return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
    }
}
