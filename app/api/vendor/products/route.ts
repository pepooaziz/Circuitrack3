import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
        const { vendorId } = await req.json();

        if (!vendorId) {
            return NextResponse.json(
                { ok: false, message: "Vendor ID is required" },
                { status: 400 }
            );
        }

        // In a real scenario, you usually filter by the authenticated user's ID
        // But here we accept a vendorId for demonstration/admin purposes
        const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("vendor_id", vendorId) // Ensure your DB column is indeed vendor_id
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Supabase fetch error:", error);
            return NextResponse.json(
                { ok: false, message: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ ok: true, products: data });
    } catch (err: any) {
        console.error("API /vendor/products error:", err);
        return NextResponse.json({ ok: false, message: "Internal Server Error" }, { status: 500 });
    }
}
