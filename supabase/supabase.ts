import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://nqgtmpkgiobyzbqkblzj.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xZ3RtcGtnaW9ieXpicWtibHpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5NjQ5NDgsImV4cCI6MjA1NzU0MDk0OH0._VnhlAjKu0E5KO7-WkjqYjqnS6JcMwC3QLYeGOVHI5M";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
