import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkData() {
    const { data: members, error } = await supabase
        .from('members')
        .select('name, join_date')
        .order('join_date', { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    const feb2026 = members.filter(m => m.join_date && m.join_date.startsWith('2026-02'));
    console.log(`Total members: ${members.length}`);
    console.log(`Members with Join Date in Feb 2026: ${feb2026.length}`);
    console.log('Sample Feb 2026 members:', feb2026.slice(0, 10));
}

checkData();
