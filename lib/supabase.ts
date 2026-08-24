import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uiswcwjcinqkpfiokkar.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpc3djd2pjaW5xa3BmaW9ra2FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxOTcwOTQsImV4cCI6MjEwMDc3MzA5NH0.Esw_DkcvOJ_0E6bP2AUcb0DSGLUKpzTiUGb65sND6tE';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
