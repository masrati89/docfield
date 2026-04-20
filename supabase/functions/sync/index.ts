// Edge Function: sync
// WatermelonDB sync endpoint for offline-first mobile app
//
// Protocol: POST /functions/v1/sync
// Request body:
//   {
//     lastSyncedAt: string (ISO timestamp),
//     changes: {
//       [tableName]: {
//         created: Row[],
//         updated: Row[],
//         deleted: string[] (IDs)
//       }
//     }
//   }
//
// Response:
//   {
//     changes: { [tableName]: { created, updated, deleted } },
//     timestamp: string (ISO timestamp)
//   }
//
// Conflict resolution: last_write_wins (safe because each inspector
// works on their own reports — no concurrent edits on same record)
//
// TODO: Implement full sync logic in a dedicated task
// This is a placeholder that returns the correct structure

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SYNCED_TABLES = [
  'projects',
  'buildings',
  'apartments',
  'delivery_reports',
  'checklist_results',
  'defects',
  'defect_photos',
  'signatures',
  'clients',
] as const;

interface SyncRequest {
  lastSyncedAt: string | null;
  changes: Record<
    string,
    {
      created: Record<string, unknown>[];
      updated: Record<string, unknown>[];
      deleted: string[];
    }
  >;
}

interface SyncResponse {
  changes: Record<
    string,
    {
      created: Record<string, unknown>[];
      updated: Record<string, unknown>[];
      deleted: string[];
    }
  >;
  timestamp: string;
}

// Allowed CORS origins for dev/local environments.
// For production, set ALLOWED_ORIGIN env var to your deployed domain.
const ALLOWED_ORIGINS = [
  'http://localhost:8081',
  'http://localhost:5173',
  'http://localhost:3000',
];

function getCorsOrigin(request: Request): string | null {
  const origin = request.headers.get('Origin');
  if (!origin) return null;

  const envOrigin = Deno.env.get('ALLOWED_ORIGIN');
  if (envOrigin && origin === envOrigin) return origin;

  if (ALLOWED_ORIGINS.includes(origin)) return origin;

  return null;
}

function corsHeaders(request: Request): Record<string, string> {
  const origin = getCorsOrigin(request);
  if (!origin) return {};
  return { 'Access-Control-Allow-Origin': origin };
}

serve(async (request: Request) => {
  // CORS preflight
  if (request.method === 'OPTIONS') {
    const origin = getCorsOrigin(request);
    if (!origin) {
      return new Response(null, { status: 204 });
    }
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, content-type',
      },
    });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Authenticate
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: 'Missing authorization header' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } }
  );

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Parse request
  const _body: SyncRequest = await request.json();
  const timestamp = new Date().toISOString();

  // TODO: Implement full sync logic
  // 1. PUSH: Apply device changes to database (body.changes)
  //    - For each table in SYNCED_TABLES:
  //      - INSERT created records
  //      - UPDATE updated records (last_write_wins)
  //      - DELETE (soft) deleted records
  //    - All within organization_id scope (RLS enforces this)
  //
  // 2. PULL: Get server changes since lastSyncedAt
  //    - For each table in SYNCED_TABLES:
  //      - SELECT * WHERE updated_at > lastSyncedAt
  //      - Return as created/updated/deleted

  // Placeholder: return empty changes
  const emptyChanges: SyncResponse['changes'] = {};
  for (const table of SYNCED_TABLES) {
    emptyChanges[table] = { created: [], updated: [], deleted: [] };
  }

  const response: SyncResponse = {
    changes: emptyChanges,
    timestamp,
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(request),
    },
  });
});
