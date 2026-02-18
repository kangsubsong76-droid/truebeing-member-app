import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function inspectMember() {
    const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('name', '고유진');

    if (error) {
        console.error(error);
        return;
    }

    console.log('Member 고유진 in DB:', data);
}

inspectMember();
