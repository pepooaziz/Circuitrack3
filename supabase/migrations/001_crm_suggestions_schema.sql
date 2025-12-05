-- ═══════════════════════════════════════════════════════════
-- CircuitRack CRM & Suggestions System - Supabase Schema
-- ═══════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ═══════════════════════════════════════════════════════════
-- 1) SUGGESTIONS TABLE
-- ═══════════════════════════════════════════════════════════
CREATE TABLE public.suggestions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number TEXT UNIQUE NOT NULL DEFAULT 'TKT-' || LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0'),
    
    -- Content
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    
    -- Classification
    category TEXT NOT NULL CHECK (category IN (
        'visitor_suggestion',
        'visitor_complaint',
        'buyer_purchase_issue',
        'buyer_pricing_issue',
        'buyer_payment_issue',
        'buyer_vendor_issue',
        'buyer_technical_issue',
        'vendor_product_listing_issue',
        'vendor_pricing_issue',
        'vendor_earnings_issue',
        'vendor_auction_issue',
        'vendor_dashboard_suggestion',
        'bug_report',
        'new_product_suggestion',
        'new_category_suggestion',
        'frontend_issue',
        'backend_api_issue',
        'design_suggestion',
        'ux_improvement_suggestion'
    )),
    
    reporter_type TEXT NOT NULL CHECK (reporter_type IN ('visitor', 'buyer', 'vendor', 'developer')),
    
    -- Priority & Status
    priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'critical')),
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    
    -- Reporter Info
    email TEXT NOT NULL,
    phone TEXT,
    reporter_name TEXT,
    user_lang TEXT DEFAULT 'en',
    
    -- Attachments
    attachments JSONB DEFAULT '[]'::jsonb,
    
    -- Assignment
    assigned_to UUID REFERENCES auth.users(id),
    
    -- Metadata
    page_url TEXT,
    user_agent TEXT,
    ip_address TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX idx_suggestions_status ON public.suggestions(status);
CREATE INDEX idx_suggestions_category ON public.suggestions(category);
CREATE INDEX idx_suggestions_email ON public.suggestions(email);
CREATE INDEX idx_suggestions_created_at ON public.suggestions(created_at DESC);
CREATE INDEX idx_suggestions_priority ON public.suggestions(priority);

-- ═══════════════════════════════════════════════════════════
-- 2) SUGGESTION REPLIES TABLE
-- ═══════════════════════════════════════════════════════════
CREATE TABLE public.suggestion_replies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    suggestion_id UUID NOT NULL REFERENCES public.suggestions(id) ON DELETE CASCADE,
    
    -- Reply Content
    message TEXT NOT NULL,
    
    -- Sender
    sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'admin', 'system')),
    sender_email TEXT,
    sender_name TEXT,
    admin_id UUID REFERENCES auth.users(id),
    
    -- Attachments
    attachments JSONB DEFAULT '[]'::jsonb,
    
    -- Metadata
    is_internal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_replies_suggestion ON public.suggestion_replies(suggestion_id);
CREATE INDEX idx_replies_created_at ON public.suggestion_replies(created_at DESC);

-- ═══════════════════════════════════════════════════════════
-- 3) CRM LEADS TABLE
-- ═══════════════════════════════════════════════════════════
CREATE TABLE public.crm_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Basic Info
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    country TEXT,
    
    -- Classification
    role TEXT CHECK (role IN ('visitor', 'buyer', 'vendor', 'developer')),
    source TEXT CHECK (source IN (
        'suggestion_form',
        'newsletter_signup',
        'existing_buyer',
        'new_vendor',
        'landing_page',
        'product_inquiry',
        'auction_participant',
        'manual_entry'
    )),
    
    -- Interests
    interests TEXT[],
    
    -- Scoring
    lead_score INTEGER DEFAULT 0 CHECK (lead_score >= 0 AND lead_score <= 100),
    
    -- Status
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'unqualified', 'converted', 'lost')),
    
    -- Engagement Metrics
    total_visits INTEGER DEFAULT 0,
    pages_viewed INTEGER DEFAULT 0,
    products_viewed INTEGER DEFAULT 0,
    time_on_site INTEGER DEFAULT 0, -- in seconds
    suggestions_count INTEGER DEFAULT 0,
    
    -- Assignment
    assigned_to UUID REFERENCES auth.users(id),
    
    -- Conversion
    converted_at TIMESTAMPTZ,
    conversion_value NUMERIC(12, 2),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_contacted_at TIMESTAMPTZ,
    last_activity_at TIMESTAMPTZ
);

CREATE INDEX idx_leads_email ON public.crm_leads(email);
CREATE INDEX idx_leads_status ON public.crm_leads(status);
CREATE INDEX idx_leads_score ON public.crm_leads(lead_score DESC);
CREATE INDEX idx_leads_created_at ON public.crm_leads(created_at DESC);

-- ═══════════════════════════════════════════════════════════
-- 4) CRM ACTIVITY LOG TABLE
-- ═══════════════════════════════════════════════════════════
CREATE TABLE public.crm_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES public.crm_leads(id) ON DELETE CASCADE,
    
    -- Activity Details
    action TEXT NOT NULL CHECK (action IN (
        'created',
        'status_changed',
        'contacted',
        'email_sent',
        'email_opened',
        'link_clicked',
        'form_submitted',
        'product_viewed',
        'page_visited',
        'score_updated',
        'assigned',
        'note_added',
        'converted'
    )),
    
    -- Metadata
    meta JSONB DEFAULT '{}'::jsonb,
    
    -- Actor
    performed_by UUID REFERENCES auth.users(id),
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_lead ON public.crm_activity(lead_id);
CREATE INDEX idx_activity_action ON public.crm_activity(action);
CREATE INDEX idx_activity_created_at ON public.crm_activity(created_at DESC);

-- ═══════════════════════════════════════════════════════════
-- 5) NOTIFICATIONS TABLE
-- ═══════════════════════════════════════════════════════════
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Recipient
    user_email TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    
    -- Notification Details
    type TEXT NOT NULL CHECK (type IN (
        'suggestion_received',
        'suggestion_updated',
        'suggestion_resolved',
        'suggestion_closed',
        'reply_received',
        'lead_created',
        'lead_assigned',
        'admin_alert'
    )),
    
    -- Content
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    payload JSONB DEFAULT '{}'::jsonb,
    
    -- Language
    lang TEXT DEFAULT 'en',
    
    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    sent_at TIMESTAMPTZ,
    error_message TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_email ON public.notifications(user_email);
CREATE INDEX idx_notifications_status ON public.notifications(status);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- ═══════════════════════════════════════════════════════════
-- 6) TRIGGERS FOR AUTO-UPDATE
-- ═══════════════════════════════════════════════════════════

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_suggestions_updated_at
    BEFORE UPDATE ON public.suggestions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON public.crm_leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ═══════════════════════════════════════════════════════════
-- 7) ROW LEVEL SECURITY (RLS) POLICIES
-- ═══════════════════════════════════════════════════════════

-- Enable RLS
ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggestion_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Suggestions: Users can view their own, admins can view all
CREATE POLICY "Users can view own suggestions"
    ON public.suggestions FOR SELECT
    USING (email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Admins can view all suggestions"
    ON public.suggestions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Anyone can insert suggestions (public form)
CREATE POLICY "Anyone can create suggestions"
    ON public.suggestions FOR INSERT
    WITH CHECK (true);

-- Only admins can update suggestions
CREATE POLICY "Admins can update suggestions"
    ON public.suggestions FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Similar policies for other tables...
-- (Add more RLS policies as needed for production)

-- ═══════════════════════════════════════════════════════════
-- 8) HELPER FUNCTIONS
-- ═══════════════════════════════════════════════════════════

-- Function to calculate lead score
CREATE OR REPLACE FUNCTION calculate_lead_score(lead_id UUID)
RETURNS INTEGER AS $$
DECLARE
    score INTEGER := 0;
    lead_record RECORD;
BEGIN
    SELECT * INTO lead_record FROM public.crm_leads WHERE id = lead_id;
    
    -- Base score from visits (max 20 points)
    score := score + LEAST(lead_record.total_visits * 2, 20);
    
    -- Pages viewed (max 15 points)
    score := score + LEAST(lead_record.pages_viewed, 15);
    
    -- Products viewed (max 20 points)
    score := score + LEAST(lead_record.products_viewed * 5, 20);
    
    -- Time on site (max 15 points) - 1 point per minute
    score := score + LEAST(lead_record.time_on_site / 60, 15);
    
    -- Suggestions/engagement (max 15 points)
    score := score + LEAST(lead_record.suggestions_count * 5, 15);
    
    -- Role bonus (max 15 points)
    IF lead_record.role = 'vendor' THEN
        score := score + 15;
    ELSIF lead_record.role = 'buyer' THEN
        score := score + 10;
    END IF;
    
    -- Cap at 100
    score := LEAST(score, 100);
    
    RETURN score;
END;
$$ LANGUAGE plpgsql;

-- ═══════════════════════════════════════════════════════════
-- END OF SCHEMA
-- ═══════════════════════════════════════════════════════════
