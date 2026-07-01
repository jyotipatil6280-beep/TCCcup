import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Create a Supabase admin client for schema operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  db: {
    schema: 'public',
  },
});

const SQL_QUERIES = [
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

export async function POST(request: NextRequest) {
  try {
    const results = [];

    for (const query of SQL_QUERIES) {
      try {
        const { data, error } = await supabase.rpc('exec_sql', {
          query,
        });

        if (error) {
          // Some errors are expected (like if table already exists)
          console.log(`Query executed with note: ${error.message}`);
          results.push({
            query: query.substring(0, 50),
            status: 'executed',
            note: error.message,
          });
        } else {
          results.push({
            query: query.substring(0, 50),
            status: 'success',
          });
        }
      } catch (error: any) {
        // Continue even if individual queries fail
        console.log(`Error executing query: ${error.message}`);
        results.push({
          query: query.substring(0, 50),
          status: 'error',
          error: error.message,
        });
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Database initialization completed',
        results,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Database initialization error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to initialize database',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Allow GET for testing/debugging
  return POST(request);
}
