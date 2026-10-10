import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zewjinhymoezmucxypdc.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4cG5zcmd3dW1pb2Z4c3JrYnl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzMjQyNDQsImV4cCI6MjEwNTkwMDI0NH0.fq_cm2nejfNbvZJrhEyPGYoQz6de_3FOnzs5TlxN_3c';

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
