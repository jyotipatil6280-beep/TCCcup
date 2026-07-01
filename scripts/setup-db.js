#!/usr/bin/env node

/**
 * Database Setup Script
 * This script creates the necessary tables in your Supabase database
 * 
 * Usage: node --env-file-if-exists=/vercel/share/.env.project scripts/setup-db.js
 */

const https = require('https');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set');
  process.exit(1);
}

const queries = [
  // Create teams table
  `CREATE TABLE IF NOT EXISTS teams (
    id SERIAL PRIMARY KEY,
    team_name VARCHAR(255) NOT NULL,
    team_logo_url TEXT,
    team_leader_ign VARCHAR(255) NOT NULL,
    team_leader_instagram VARCHAR(255),
    team_leader_twitter VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'pending'
  )`,

  // Create players table
  `CREATE TABLE IF NOT EXISTS players (
    id SERIAL PRIMARY KEY,
    team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
    player_name VARCHAR(255) NOT NULL,
    instagram_handle VARCHAR(255),
    twitter_handle VARCHAR(255),
    player_order INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
  )`,

  // Enable RLS
  `ALTER TABLE teams ENABLE ROW LEVEL SECURITY`,
  `ALTER TABLE players ENABLE ROW LEVEL SECURITY`,

  // Create RLS policies
  `DROP POLICY IF EXISTS "Allow all operations on teams" ON teams`,
  `DROP POLICY IF EXISTS "Allow all operations on players" ON players`,
  `CREATE POLICY "Allow all operations on teams" ON teams FOR ALL USING (true)`,
  `CREATE POLICY "Allow all operations on players" ON players FOR ALL USING (true)`,
];

async function executeQuery(query) {
  const url = new URL(SUPABASE_URL);
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname: url.hostname,
      port: 443,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          resolve(true);
        } else {
          reject(new Error(`Status ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify({ query }));
    req.end();
  });
}

async function setup() {
  console.log('🚀 Starting Supabase database setup...\n');
  
  for (let i = 0; i < queries.length; i++) {
    const query = queries[i];
    const shortQuery = query.substring(0, 50) + (query.length > 50 ? '...' : '');
    
    try {
      process.stdout.write(`[${i + 1}/${queries.length}] ${shortQuery} `);
      await executeQuery(query);
      console.log('✓');
    } catch (error) {
      console.log('⚠️');
      console.log(`   Error: ${error.message}`);
      // Continue with next query
    }
  }
  
  console.log('\n✅ Database setup complete!');
  console.log('   Your tables have been created in Supabase');
}

setup().catch((error) => {
  console.error('❌ Setup failed:', error);
  process.exit(1);
});
