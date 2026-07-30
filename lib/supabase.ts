import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ibbempaalqptzmqbnspc.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "тут_ваш_ключ_з_env_local";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);