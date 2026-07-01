'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function SetupPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const initializeDatabase = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/init-db', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to initialize database');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during initialization');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="border-slate-700 bg-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Tournament Database Setup</CardTitle>
            <CardDescription>Initialize your Supabase database tables</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-white">Setup Steps:</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Supabase project created and connected
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Environment variables configured
                </li>
                <li className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                  Database tables need to be created (next step)
                </li>
              </ul>
            </div>

            <Alert className="border-blue-500 bg-blue-500/10">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-blue-200">
                Click the button below to create the necessary database tables for your tournament.
              </AlertDescription>
            </Alert>

            <Button
              onClick={initializeDatabase}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Initializing Database...
                </>
              ) : (
                'Initialize Database'
              )}
            </Button>

            {error && (
              <Alert className="border-red-500 bg-red-500/10">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-200">
                  <div className="font-semibold">Error:</div>
                  <div className="mt-1 text-sm">{error}</div>
                  <div className="mt-2 text-xs">
                    Make sure the <code className="bg-red-900 px-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code> environment variable is set.
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {result && (
              <Alert className="border-green-500 bg-green-500/10">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-200">
                  <div className="font-semibold">Success!</div>
                  <div className="mt-2 space-y-1 text-sm">
                    {result.results.map((r: any, i: number) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-green-400">✓</span>
                        <span>{r.query}...</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-xs">Your database is ready!</div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 p-4 bg-slate-700/50 rounded-lg">
          <h3 className="text-sm font-semibold text-white mb-2">Alternative: Manual Setup</h3>
          <p className="text-xs text-slate-300 mb-3">
            If the automatic setup doesn't work, you can run the setup script manually or execute SQL directly in Supabase.
          </p>
          <code className="text-xs bg-slate-900 p-2 rounded block text-slate-200 overflow-auto">
            node --env-file-if-exists=/vercel/share/.env.project scripts/setup-db.js
          </code>
        </div>
      </div>
    </div>
  );
}
