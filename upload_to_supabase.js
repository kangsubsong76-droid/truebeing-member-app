import { createClient } from '@supabase/supabase-js';
import csv from 'csv-parser';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Supabase credentials missing in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function uploadData() {
    const filePath = path.join(process.cwd(), 'members_for_supabase_fixed.csv');
    console.log('📂 File Path:', filePath);

    if (!fs.existsSync(filePath)) {
        console.error('❌ File not found!');
        process.exit(1);
    }

    const members = [];
    console.log('🚀 Starting robust upload to Supabase...');

    fs.createReadStream(filePath)
        .on('error', (err) => console.error('❌ Stream Error:', err))
        .pipe(csv())
        .on('headers', (headers) => {
            console.log('📝 CSV Headers Detected:', headers);
        })
        .on('data', (row) => {
            const findKey = (candidates) => {
                const keys = Object.keys(row);
                for (const cand of candidates) {
                    const found = keys.find(k => k.toLowerCase().trim().replace(/^\ufeff/, '') === cand.toLowerCase());
                    if (found) return found;
                }
                for (const cand of candidates) {
                    const found = keys.find(k => k.toLowerCase().includes(cand.toLowerCase()));
                    if (found) return found;
                }
                return null;
            };

            const kName = findKey(['name', '이름', '성함', '고객명']);
            const kPhone = findKey(['phone', '전화번호', '연락처', '휴대폰']);
            const kJoin = findKey(['join_date', '가입일', '등록일', '시작일']);
            const kEnd = findKey(['end_date', '마감일', '만기일', '종료일']);
            const kGender = findKey(['gender', '성별', '남여']);
            const kStatus = findKey(['status', '상태', '구분']);
            const kMemo = findKey(['memo', '메모', '비고']);
            const kAddress = findKey(['address', '주소']);

            const name = row[kName]?.trim();
            const rawPhone = row[kPhone];
            let phone = rawPhone ? String(rawPhone).replace(/[^0-9]/g, '') : '';
            if (phone.length === 10 && phone.startsWith('10')) phone = '0' + phone;
            if (phone.length === 11) phone = phone.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');

            if (phone && name) {
                const cleanDate = (d) => {
                    if (!d) return null;
                    const match = String(d).trim().match(/^\d{4}-\d{2}-\d{2}/);
                    return match ? match[0] : null;
                };

                members.push({
                    name: name,
                    phone: phone,
                    status: row[kStatus] || '회원',
                    gender: row[kGender] || '모름',
                    address: row[kAddress] || '',
                    end_date: cleanDate(row[kEnd]),
                    join_date: cleanDate(row[kJoin]),
                    memo: row[kMemo] || ''
                });
            }
        })
        .on('end', async () => {
            console.log(`\n✅ CSV Parsing Finished. Total rows: ${members.length}`);
            const uniqueMembers = members.filter((v, i, a) => a.findIndex(t => (t.phone === v.phone)) === i);
            console.log(`📊 Processing ${uniqueMembers.length} unique records...`);

            try {
                console.log('📡 Sending to Supabase...');
                const { error } = await supabase
                    .from('members')
                    .upsert(uniqueMembers, { onConflict: 'phone' });

                if (error) {
                    console.error('❌ Supabase Upload Error:', error.message);
                } else {
                    console.log('✅ Success! Database has been repaired with correct dates.');
                }
            } catch (err) {
                console.error('❌ Unexpected Error:', err);
            }
        });
}

uploadData();
