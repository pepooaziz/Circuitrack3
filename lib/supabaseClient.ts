import { createClient } from '@supabase/supabase-js';

// Fallback to empty string to prevent build errors if env vars missing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabaseAdmin = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: false,
    },
});
