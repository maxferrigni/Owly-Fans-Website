import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://kketfaaihwjflpdngtvo.supabase.co';
const SUPABASE_KEY = 'your-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
