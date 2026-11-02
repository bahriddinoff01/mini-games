import { createClient } from "@supabase/supabase-js"

// Values come from .env.local (see .env.example). Without them the site still works,
// just without accounts and leaderboards.
const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = url && key ? createClient(url, key) : null
export const isConfigured = supabase !== null
