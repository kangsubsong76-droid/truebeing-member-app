import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function cleanup() {
    console.log('🧹 Starting Database Cleanup...');

    // 1. Delete members whose phone is not hyphenated (likely bad data from early upload)
    const { data: nonHyphenated, error: fetchError } = await supabase
        .from('members')
        .select('id, name, phone')
        .not('phone', 'ilike', '%-%');

    if (fetchError) {
        console.error(fetchError);
        return;
    }

    console.log(`🔍 Found ${nonHyphenated.length} records without hyphens.`);

    if (nonHyphenated.length > 0) {
        const idsToDelete = nonHyphenated.map(m => m.id);
        const { error: deleteError } = await supabase
            .from('members')
            .delete()
            .in('id', idsToDelete);

        if (deleteError) console.error('❌ Delete Error:', deleteError);
        else console.log(`✅ Deleted ${idsToDelete.length} broken records.`);
    }

    // 2. Double check count
    const { count, error: countError } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true });

    console.log(`📊 Current total member count: ${count}`);
}

cleanup();
