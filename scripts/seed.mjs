#!/usr/bin/env node
/* eslint-disable no-console */
// ============================================================
// scripts/seed.mjs — Local Development Seed
// LOCAL DEVELOPMENT ONLY — DO NOT USE IN PRODUCTION
// ============================================================
//
// Creates a minimal dataset on the local Supabase instance:
//   1 organization  · 1 admin user · 1 project · 1 building
//   2 apartments    · 2 reports    · 5 defects
//
// Usage:
//   1. Copy .env.seed.local.example → .env.seed.local
//   2. Fill SUPABASE_SECRET_KEY from `npx supabase status`
//   3. `npm run seed`
//
// Idempotent: re-running does not create duplicates (upsert by id).
// Guards: aborts if URL isn't local, key isn't sb_secret_, or prod env.
// ============================================================

import { createClient } from '@supabase/supabase-js';
import { config as loadEnv } from 'dotenv';
import pg from 'pg';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// ------------------------------------------------------------
// Load env from repo root
// ------------------------------------------------------------
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
loadEnv({ path: path.join(repoRoot, '.env.seed.local') });

const {
  SUPABASE_URL,
  SUPABASE_SECRET_KEY,
  SEED_ADMIN_EMAIL,
  SEED_ADMIN_PASSWORD,
  NODE_ENV,
} = process.env;

// ------------------------------------------------------------
// GUARDS — refuse to run unless everything is clearly local
// ------------------------------------------------------------
function abort(msg) {
  console.error(`❌ REFUSING to run: ${msg}`);
  process.exit(1);
}

if (!SUPABASE_URL) abort('SUPABASE_URL missing. Copy .env.seed.local.example to .env.seed.local');
if (!SUPABASE_SECRET_KEY) abort('SUPABASE_SECRET_KEY missing');
if (!SEED_ADMIN_EMAIL) abort('SEED_ADMIN_EMAIL missing');
if (!SEED_ADMIN_PASSWORD) abort('SEED_ADMIN_PASSWORD missing');

if (!/^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?\/?$/.test(SUPABASE_URL)) {
  abort(`SUPABASE_URL is not local: ${SUPABASE_URL}`);
}

if (!SUPABASE_SECRET_KEY.startsWith('sb_secret_')) {
  abort('SUPABASE_SECRET_KEY must use the new format (starts with sb_secret_)');
}

if (NODE_ENV === 'production') {
  abort('NODE_ENV=production');
}

// ------------------------------------------------------------
// Client
// ------------------------------------------------------------
const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Stable UUIDs — keep these constant so upsert is idempotent
const IDS = {
  org: '00000000-0000-0000-0000-000000000001',
  project: '00000000-0000-0000-0000-0000000000a1',
  building: '00000000-0000-0000-0000-0000000000b1',
  apt1: '00000000-0000-0000-0000-0000000000c1',
  apt2: '00000000-0000-0000-0000-0000000000c2',
  report1: '00000000-0000-0000-0000-0000000000d1',
  report2: '00000000-0000-0000-0000-0000000000d2',
  defect1: '00000000-0000-0000-0000-0000000000e1',
  defect2: '00000000-0000-0000-0000-0000000000e2',
  defect3: '00000000-0000-0000-0000-0000000000e3',
  defect4: '00000000-0000-0000-0000-0000000000e4',
  defect5: '00000000-0000-0000-0000-0000000000e5',
};

// ------------------------------------------------------------
// Pre-flight: verify handle_new_user trigger exists & is enabled.
// Uses a direct `pg` connection to query pg_trigger because the
// PostgREST API does not expose pg_catalog.
//
// Local Supabase default DB URL is well-known and stable:
//   postgresql://postgres:postgres@127.0.0.1:54322/postgres
// ------------------------------------------------------------
const LOCAL_DB_URL =
  process.env.SUPABASE_DB_URL || 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';

async function preflightTriggerCheck() {
  const client = new pg.Client({ connectionString: LOCAL_DB_URL });
  try {
    await client.connect();
  } catch (err) {
    abort(
      `Cannot connect to local Postgres at ${LOCAL_DB_URL}: ${err.message}. ` +
        `Is \`supabase start\` running?`
    );
  }

  try {
    const { rows } = await client.query(`
      SELECT t.tgname, t.tgenabled, p.proname
      FROM pg_trigger t
      JOIN pg_class c ON c.oid = t.tgrelid
      JOIN pg_namespace n ON n.oid = c.relnamespace
      JOIN pg_proc p ON p.oid = t.tgfoid
      WHERE n.nspname = 'auth'
        AND c.relname = 'users'
        AND t.tgname = 'on_auth_user_created'
        AND NOT t.tgisinternal;
    `);

    if (rows.length === 0) {
      abort(
        'handle_new_user trigger (on_auth_user_created) is MISSING on auth.users. ' +
          'Run `npx supabase db reset` to re-apply migrations.'
      );
    }

    // pg_trigger.tgenabled: 'O' = ORIGIN/LOCAL (enabled), 'D' = DISABLED,
    // 'R' = REPLICA, 'A' = ALWAYS. Anything other than 'O' / 'A' means
    // it won't fire during normal INSERTs.
    const { tgenabled, proname } = rows[0];
    if (tgenabled === 'D') {
      abort(
        'handle_new_user trigger exists but is DISABLED. ' +
          'Re-enable it or run `npx supabase db reset`.'
      );
    }
    if (proname !== 'handle_new_user') {
      abort(
        `on_auth_user_created trigger points to unexpected function "${proname}" ` +
          '(expected handle_new_user). Re-apply migrations.'
      );
    }
  } finally {
    await client.end().catch(() => {});
  }
}

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------
async function upsertOrUnwrap(label, promise) {
  const { data, error } = await promise;
  if (error) throw new Error(`${label} failed: ${error.message}`);
  return data;
}

async function findAuthUserByEmail(email) {
  const { data, error } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  });
  if (error) throw new Error(`listUsers failed: ${error.message}`);
  return data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase()) ?? null;
}

// ------------------------------------------------------------
// Seed
// ------------------------------------------------------------
async function seed() {
  console.log('🔍 Pre-flight trigger check…');
  await preflightTriggerCheck();

  // 1. Organization
  console.log('📦 Upserting organization…');
  await upsertOrUnwrap(
    'organizations upsert',
    supabase.from('organizations').upsert(
      {
        id: IDS.org,
        name: 'Demo Org',
        mode: 'solo',
        settings: {
          defaultReportType: 'delivery',
          defaultLanguage: 'he',
          pdfBrandingEnabled: true,
          legal_name: 'Demo Org Ltd.',
          address: 'רחוב הדוגמה 1, תל אביב',
          phone: '0501234567',
          email: 'contact@infield.local',
        },
      },
      { onConflict: 'id' }
    )
  );

  // 2. Auth admin user (idempotent)
  console.log('👤 Ensuring admin auth user…');
  let authUser = await findAuthUserByEmail(SEED_ADMIN_EMAIL);
  if (!authUser) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: SEED_ADMIN_EMAIL,
      password: SEED_ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: {
        organization_id: IDS.org,
        full_name: 'חיים דמו',
        role: 'admin',
      },
    });
    if (error) throw new Error(`createUser failed: ${error.message}`);
    authUser = data.user;
    console.log('  ✓ created new auth user');
  } else {
    console.log('  ✓ auth user already exists');
  }

  // Verify public.users row was created by the trigger
  const { data: publicUser, error: publicUserError } = await supabase
    .from('users')
    .select('id, role, organization_id, full_name')
    .eq('id', authUser.id)
    .maybeSingle();

  if (publicUserError) {
    throw new Error(`users select failed: ${publicUserError.message}`);
  }

  if (!publicUser) {
    // Pre-flight passed but public.users row is still missing — this
    // means the trigger exists but is broken (e.g. failing silently
    // on the INSERT). Surface hard error instead of papering over it.
    abort(
      `public.users row missing for ${SEED_ADMIN_EMAIL} after createUser. ` +
        'handle_new_user trigger exists but did not fire. Inspect ' +
        '`select * from pg_trigger where tgname = \'on_auth_user_created\'` ' +
        'and the function body of handle_new_user.'
    );
  } else if (publicUser.organization_id !== IDS.org || publicUser.role !== 'admin') {
    // Keep role/org aligned with seed expectations on re-runs
    await upsertOrUnwrap(
      'users realign',
      supabase
        .from('users')
        .update({ organization_id: IDS.org, role: 'admin' })
        .eq('id', authUser.id)
    );
  }

  const inspectorId = authUser.id;

  // 3. Project
  console.log('🏗  Upserting project…');
  await upsertOrUnwrap(
    'projects upsert',
    supabase.from('projects').upsert(
      {
        id: IDS.project,
        organization_id: IDS.org,
        name: 'פרויקט דמו',
        address: 'רחוב השקמה 15',
        city: 'תל אביב',
        status: 'active',
      },
      { onConflict: 'id' }
    )
  );

  // 4. Building
  console.log('🏢 Upserting building…');
  await upsertOrUnwrap(
    'buildings upsert',
    supabase.from('buildings').upsert(
      {
        id: IDS.building,
        project_id: IDS.project,
        organization_id: IDS.org,
        name: 'בניין A',
        floors_count: 6,
      },
      { onConflict: 'id' }
    )
  );

  // 5. Apartments
  console.log('🏠 Upserting 2 apartments…');
  await upsertOrUnwrap(
    'apartments upsert',
    supabase.from('apartments').upsert(
      [
        {
          id: IDS.apt1,
          building_id: IDS.building,
          organization_id: IDS.org,
          number: '1',
          floor: 1,
          rooms_count: 3,
          apartment_type: 'garden',
          status: 'pending',
        },
        {
          id: IDS.apt2,
          building_id: IDS.building,
          organization_id: IDS.org,
          number: '2',
          floor: 2,
          rooms_count: 4,
          apartment_type: 'regular',
          status: 'in_progress',
        },
      ],
      { onConflict: 'id' }
    )
  );

  // 6. Reports
  // Snapshot fields intentionally left NULL — PDF generation falls back
  // to live values via usePdfGeneration.ts. Matches the prod backfill.
  console.log('📄 Upserting 2 delivery reports…');
  await upsertOrUnwrap(
    'delivery_reports upsert',
    supabase.from('delivery_reports').upsert(
      [
        {
          id: IDS.report1,
          apartment_id: IDS.apt1,
          organization_id: IDS.org,
          inspector_id: inspectorId,
          report_type: 'delivery',
          status: 'draft',
          round_number: 1,
          tenant_name: 'ישראל ישראלי',
          tenant_phone: '0521234567',
        },
        {
          id: IDS.report2,
          apartment_id: IDS.apt2,
          organization_id: IDS.org,
          inspector_id: inspectorId,
          report_type: 'bedek_bait',
          status: 'in_progress',
          round_number: 1,
          tenant_name: 'שרה כהן',
          tenant_phone: '0539876543',
        },
      ],
      { onConflict: 'id' }
    )
  );

  // 7. Defects (5 total: 3 on report1, 2 on report2)
  console.log('🔧 Upserting 5 defects…');
  await upsertOrUnwrap(
    'defects upsert',
    supabase.from('defects').upsert(
      [
        {
          id: IDS.defect1,
          delivery_report_id: IDS.report1,
          organization_id: IDS.org,
          description: 'סדק באריח רצפה במטבח',
          room: 'מטבח',
          category: 'ריצוף',
          severity: 'critical',
          status: 'open',
          source: 'manual',
          sort_order: 1,
        },
        {
          id: IDS.defect2,
          delivery_report_id: IDS.report1,
          organization_id: IDS.org,
          description: 'טיח לא אחיד בקיר הסלון',
          room: 'סלון',
          category: 'טיח',
          severity: 'medium',
          status: 'open',
          source: 'manual',
          sort_order: 2,
        },
        {
          id: IDS.defect3,
          delivery_report_id: IDS.report1,
          organization_id: IDS.org,
          description: 'צבע לא אחיד בקיר חדר השינה',
          room: 'חדר שינה',
          category: 'צבע',
          severity: 'low',
          status: 'open',
          source: 'manual',
          sort_order: 3,
        },
        {
          id: IDS.defect4,
          delivery_report_id: IDS.report2,
          organization_id: IDS.org,
          description: 'נזילה מצנרת במקלחון',
          room: 'חדר רחצה',
          category: 'אינסטלציה',
          severity: 'critical',
          status: 'open',
          source: 'manual',
          sort_order: 1,
        },
        {
          id: IDS.defect5,
          delivery_report_id: IDS.report2,
          organization_id: IDS.org,
          description: 'דלת מרפסת לא נסגרת באיטום',
          room: 'מרפסת',
          category: 'אלומיניום',
          severity: 'medium',
          status: 'open',
          source: 'manual',
          sort_order: 2,
        },
      ],
      { onConflict: 'id' }
    )
  );

  console.log('\n✅ Seed complete.');
  console.log('───────────────────────────────────────────');
  console.log(`  Login:     ${SEED_ADMIN_EMAIL}`);
  console.log(`  Password:  ${SEED_ADMIN_PASSWORD}`);
  console.log(`  Org ID:    ${IDS.org}`);
  console.log('  Dataset:   1 project · 1 building · 2 apartments ·');
  console.log('             2 reports · 5 defects');
  console.log('───────────────────────────────────────────');
}

seed().catch((err) => {
  console.error('\n❌ Seed failed:', err.message);
  process.exit(1);
});
