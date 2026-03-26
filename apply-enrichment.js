import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;

// Connection string from run-migrations.js
const pool = new Pool({
    connectionString: 'postgresql://postgres:paraKenya8%23%26%23@db.ygtnjiwdrfldpsmakaqo.supabase.co:5432/postgres',
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runSingleMigration() {
    console.log('🔄 Connecting to Supabase for enrichment migration...');
    try {
        const client = await pool.connect();
        const filePath = path.join(__dirname, 'supabase/migrations/00007_message_persistence_enrichment.sql');
        const sql = fs.readFileSync(filePath, 'utf8');

        console.log('📄 Executing SQL...');
        const statements = sql.split(';').filter(s => s.trim() && !s.trim().startsWith('--'));

        for (const statement of statements) {
            await client.query(statement);
            console.log('   ✅ Statement executed');
        }

        console.log('🎉 Migration 00007 completed successfully!');
        client.release();
        await pool.end();
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    }
}

runSingleMigration();
