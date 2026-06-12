import { createClient } from '@supabase/supabase-js';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

const formatSupabaseUrl = (url: string) => {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  // If it is just a project reference ID (e.g. alphanumeric)
  if (/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
    return `https://${trimmed}.supabase.co`;
  }
  return trimmed;
};

const supabaseUrl = formatSupabaseUrl(rawUrl);

const isUrlValid = (url: string) => {
  return url.startsWith('http://') || url.startsWith('https://');
};

// Safely initialize the client. If variables are missing or invalid, the client will be null.
// The data synchronization layer will automatically fall back to Local Storage.
export const supabase = (supabaseUrl && supabaseAnonKey && isUrlValid(supabaseUrl)) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

if (!supabase) {
  console.warn(
    "Supabase credentials missing or invalid. App is running in fully offline mode (LocalStorage only). " +
    "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file to enable database synchronization."
  );
} else {
  console.log("Supabase client initialized successfully with URL:", supabaseUrl);
}
