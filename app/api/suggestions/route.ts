import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const {
            title,
            description,
            category,
            reporter_type,
            priority = 'normal',
            email,
            phone,
            reporter_name,
            user_lang = 'en',
            attachments = [],
            page_url,
        } = body;

        // Validate required fields
        if (!title || !description || !category || !reporter_type || !email) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Insert suggestion
        const { data: suggestion, error: suggestionError } = await supabase
            .from('suggestions')
            .insert({
                title,
                description,
                category,
                reporter_type,
                priority,
                email,
                phone,
                reporter_name,
                user_lang,
                attachments,
                page_url,
                status: 'open',
            })
            .select()
            .single();

        if (suggestionError) {
            console.error('Supabase error:', suggestionError);
            return NextResponse.json(
                { success: false, message: 'Failed to create suggestion', error: suggestionError.message },
                { status: 500 }
            );
        }

        // Create or update CRM lead
        const { data: existingLead } = await supabase
            .from('crm_leads')
            .select('*')
            .eq('email', email)
            .single();

        if (existingLead) {
            // Update existing lead
            await supabase
                .from('crm_leads')
                .update({
                    suggestions_count: (existingLead.suggestions_count || 0) + 1,
                    last_activity_at: new Date().toISOString(),
                })
                .eq('id', existingLead.id);

            // Log activity
            await supabase.from('crm_activity').insert({
                lead_id: existingLead.id,
                action: 'form_submitted',
                meta: { suggestion_id: suggestion.id, category },
            });

            // Recalculate lead score
            const newScore = await calculateLeadScore(existingLead.id);
            await supabase
                .from('crm_leads')
                .update({ lead_score: newScore })
                .eq('id', existingLead.id);
        } else {
            // Create new lead
            const { data: newLead } = await supabase
                .from('crm_leads')
                .insert({
                    name: reporter_name,
                    email,
                    phone,
                    role: reporter_type,
                    source: 'suggestion_form',
                    suggestions_count: 1,
                    status: 'new',
                    lead_score: 10, // Initial score
                })
                .select()
                .single();

            if (newLead) {
                await supabase.from('crm_activity').insert({
                    lead_id: newLead.id,
                    action: 'created',
                    meta: { source: 'suggestion_form' },
                });
            }
        }

        // Queue notification emails
        await supabase.from('notifications').insert([
            {
                user_email: email,
                type: 'suggestion_received',
                subject: user_lang === 'ar' ? 'تم استلام مقترحك' : 'Suggestion Received',
                message: user_lang === 'ar'
                    ? `شكراً لك! تم استلام مقترحك برقم ${suggestion.ticket_number}`
                    : `Thank you! Your suggestion has been received with ticket number ${suggestion.ticket_number}`,
                payload: { ticket_number: suggestion.ticket_number, suggestion_id: suggestion.id },
                lang: user_lang,
            },
            {
                user_email: process.env.ADMIN_EMAIL || 'admin@circuitrack.com',
                type: 'admin_alert',
                subject: 'New Suggestion Submitted',
                message: `A new ${category} suggestion has been submitted by ${email}`,
                payload: { suggestion_id: suggestion.id, category, priority },
                lang: 'en',
            },
        ]);

        return NextResponse.json({
            success: true,
            ticket_id: suggestion.id,
            ticket_number: suggestion.ticket_number,
            message: 'Suggestion submitted successfully',
        });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error', error: error.message },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');
        const status = searchParams.get('status');
        const category = searchParams.get('category');
        const limit = parseInt(searchParams.get('limit') || '50');

        let query = supabase
            .from('suggestions')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (email) {
            query = query.eq('email', email);
        }
        if (status) {
            query = query.eq('status', status);
        }
        if (category) {
            query = query.eq('category', category);
        }

        const { data, error } = await query;

        if (error) {
            return NextResponse.json(
                { success: false, message: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, suggestions: data });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

// Helper function to calculate lead score
async function calculateLeadScore(leadId: string): Promise<number> {
    const { data } = await supabase
        .from('crm_leads')
        .select('*')
        .eq('id', leadId)
        .single();

    if (!data) return 0;

    let score = 0;

    // Visits (max 20)
    score += Math.min((data.total_visits || 0) * 2, 20);

    // Pages viewed (max 15)
    score += Math.min(data.pages_viewed || 0, 15);

    // Products viewed (max 20)
    score += Math.min((data.products_viewed || 0) * 5, 20);

    // Time on site (max 15) - 1 point per minute
    score += Math.min(Math.floor((data.time_on_site || 0) / 60), 15);

    // Suggestions (max 15)
    score += Math.min((data.suggestions_count || 0) * 5, 15);

    // Role bonus (max 15)
    if (data.role === 'vendor') score += 15;
    else if (data.role === 'buyer') score += 10;

    return Math.min(score, 100);
}
