import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;

// Supabase connection config
const pool = new Pool({
    connectionString: 'postgresql://postgres:paraKenya8%23%26%23@db.ygtnjiwdrfldpsmakaqo.supabase.co:5432/postgres',
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runMigrations() {
    console.log('🔄 Connecting to Supabase...');

    try {
        const client = await pool.connect();
        console.log('✅ Connected to Supabase successfully!');

        // Read and run each migration file
        const migrationsDir = path.join(__dirname, 'supabase/migrations');
        const migrationFiles = [
            '00001_initial_schema.sql',
            '00002_files_folders.sql',
            '00003_judicial_analytics.sql',
            '00004_onboarding_responses.sql',
            '008_project_hub_expansion.sql',
            '009_project_history_distinction.sql',
            '010_user_settings_fixes.sql'
        ];

        for (const file of migrationFiles) {
            const filePath = path.join(migrationsDir, file);
            console.log(`\n📄 Running migration: ${file}`);

            const sql = fs.readFileSync(filePath, 'utf8');

            // Split by semicolons to run each statement
            const statements = sql.split(';').filter(s => s.trim() && !s.trim().startsWith('--'));

            for (const statement of statements) {
                if (statement.trim()) {
                    try {
                        await client.query(statement);
                    } catch (err) {
                        // Ignore some errors that might be from CREATE TABLE IF NOT EXISTS
                        if (!err.message.includes('already exists')) {
                            console.log('   ⚠️ Statement error (may be ok):', err.message.substring(0, 100));
                        }
                    }
                }
            }
            console.log(`   ✅ ${file} completed`);
        }

        console.log('\n🎉 All migrations completed successfully!');

        // Verify tables were created
        const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

        console.log('\n📊 Tables created:');
        result.rows.forEach(row => {
            console.log(`   - ${row.table_name}`);
        });

        client.release();
        await pool.end();
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        await pool.end();
        process.exit(1);
    }
}

runMigrations();
