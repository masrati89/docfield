/**
 * inField — End-to-end smoke test
 * Exercises the full MVP flow against Supabase:
 * 1. Auth login
 * 2. Create report (wizard simulation)
 * 3. Checklist state persistence
 * 4. Defect insert + read
 * 5. Status transitions
 * 6. Signature immutability
 * 7. Cleanup
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://iewhmokzrmmkqdfozpwh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlld2htb2t6cm1ta3FkZm96cHdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNTg4NDMsImV4cCI6MjA5MDczNDg0M30.nX_pveSHpoMUJYxL3jT759VK_HprVvnsMZpVXuG0ObA';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let testReportId = null;
let testDefectId = null;
let userId = null;
let orgId = null;
let apartmentId = null;

const results = [];
function log(test, status, detail = '') {
  const icon = status === 'pass' ? '✅' : status === 'fail' ? '❌' : '⚠️';
  results.push({ test, status, detail });
  console.log(`${icon} ${test}${detail ? ` — ${detail}` : ''}`);
}

// ============================================================
// TEST 1: Auth — Login
// ============================================================
async function testAuth() {
  console.log('\n─── TEST 1: Auth Login ───');

  const RUN_ID = Date.now().toString(36);
  const TEST_EMAIL = `smoke-${RUN_ID}@infield.test`;
  const TEST_PASS = 'SmokeTest2026!';
  console.log(`  Using email: ${TEST_EMAIL}`);

  // Step 1: Sign up fresh user
  const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
    email: TEST_EMAIL,
    password: TEST_PASS,
    options: {
      data: { full_name: 'Smoke Test User' },
    },
  });

  if (signUpErr) {
    log('Signup', 'fail', signUpErr.message);
    return false;
  }

  let data;
  if (!signUpData.session) {
    // Email confirmation required — try login
    console.log('  No session from signup, trying login...');
    const { data: loginData, error: loginErr } = await supabase.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: TEST_PASS,
    });
    if (loginErr) {
      log('Login after signup', 'fail', `${loginErr.message} (email confirmation may be required)`);
      return false;
    }
    data = loginData;
  } else {
    data = signUpData;
  }
  log('Signup', 'pass', `Session obtained for ${TEST_EMAIL}`);

  // Debug: verify auth state
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  console.log(`  Auth check: uid=${currentUser?.id ?? 'NULL'}, role=${currentUser?.role ?? 'NULL'}`);

  // Step 2: Create org (generate UUID client-side — SELECT policy needs user profile)
  const newOrgId = crypto.randomUUID();
  const { error: orgErr } = await supabase
    .from('organizations')
    .insert({ id: newOrgId, name: `Smoke Test Org ${RUN_ID}` });

  if (orgErr) {
    log('Create org', 'fail', orgErr.message);
    return false;
  }
  log('Create org', 'pass', `id=${newOrgId}`);

  // Step 3: Create user profile (manually, like register.tsx)
  const authUserId = data.user?.id;
  const { error: profileErr } = await supabase.from('users').insert({
    id: authUserId,
    organization_id: newOrgId,
    email: TEST_EMAIL,
    full_name: 'Smoke Test User',
    role: 'admin',
    is_active: true,
  });

  if (profileErr) {
    log('Create profile', 'fail', profileErr.message);
    // May already exist from trigger — continue anyway
  } else {
    log('Create profile', 'pass');
  }

  // Need to refresh session so RLS picks up the new profile
  const { data: refreshed } = await supabase.auth.refreshSession();
  if (refreshed?.session) {
    data = refreshed;
  }

  const error = null;

  if (!data.session) {
    log('Login', 'fail', 'No session returned');
    return false;
  }

  log('Login', 'pass', `user=${data.user.email}`);
  userId = data.user.id;

  // Fetch profile
  const { data: profile, error: profileFetchErr } = await supabase
    .from('users')
    .select('id, full_name, role, organization_id')
    .eq('id', userId)
    .single();

  if (profileFetchErr || !profile) {
    log('Profile fetch', 'fail', profileFetchErr?.message || 'No profile');
    return false;
  }

  orgId = profile.organization_id;
  log('Profile fetch', 'pass', `name=${profile.full_name}, org=${orgId}`);

  // Check session has access token
  if (!data.session.access_token) {
    log('Session token', 'fail', 'No access token');
    return false;
  }
  log('Session token', 'pass');

  return true;
}

// ============================================================
// TEST 2: Wizard — Create Report
// ============================================================
async function testCreateReport() {
  console.log('\n─── TEST 2: Create Report (Wizard Simulation) ───');

  // Create project → building → apartment (simulating wizard flow)
  const { data: project, error: projErr } = await supabase
    .from('projects')
    .insert({ organization_id: orgId, name: 'פרויקט טסט', status: 'active' })
    .select('id')
    .single();

  if (projErr || !project) {
    log('Create project', 'fail', projErr?.message || 'No data');
    return false;
  }
  log('Create project', 'pass', `id=${project.id}`);

  const { data: building, error: buildErr } = await supabase
    .from('buildings')
    .insert({ project_id: project.id, organization_id: orgId, name: 'בניין א' })
    .select('id')
    .single();

  if (buildErr || !building) {
    log('Create building', 'fail', buildErr?.message || 'No data');
    return false;
  }
  log('Create building', 'pass', `id=${building.id}`);

  const { data: apt, error: aptErr } = await supabase
    .from('apartments')
    .insert({ building_id: building.id, organization_id: orgId, number: '1', floor: 1 })
    .select('id')
    .single();

  if (aptErr || !apt) {
    log('Create apartment', 'fail', aptErr?.message || 'No data');
    return false;
  }
  apartmentId = apt.id;
  log('Create apartment', 'pass', `id=${apartmentId}`);

  // Insert delivery report (simulating wizard submit)
  const { data: report, error: reportErr } = await supabase
    .from('delivery_reports')
    .insert({
      apartment_id: apartmentId,
      organization_id: orgId,
      inspector_id: userId,
      report_type: 'delivery',
      status: 'draft',
      round_number: 1,
      report_date: new Date().toISOString().split('T')[0],
      project_name_freetext: 'Smoke Test Project',
      apartment_label_freetext: 'דירה טסט',
    })
    .select('id, status, report_type')
    .single();

  if (reportErr || !report) {
    log('Create report', 'fail', reportErr?.message || 'No data returned');
    return false;
  }

  testReportId = report.id;
  log('Create report', 'pass', `id=${testReportId}, type=${report.report_type}, status=${report.status}`);

  // Verify report is readable
  const { data: readBack, error: readErr } = await supabase
    .from('delivery_reports')
    .select('id, status, report_type, apartment_id')
    .eq('id', testReportId)
    .single();

  if (readErr || !readBack) {
    log('Read report back', 'fail', readErr?.message || 'Not found');
    return false;
  }
  log('Read report back', 'pass');

  return true;
}

// ============================================================
// TEST 3: Checklist — Persist State
// ============================================================
async function testChecklist() {
  console.log('\n─── TEST 3: Checklist State Persistence ───');

  const checklistState = {
    statuses: {
      'kitchen_sink': 'ok',
      'kitchen_faucet': 'defect',
      'kitchen_cabinet': 'partial',
      'bathroom_shower': 'skip',
    },
    defectTexts: {
      'kitchen_faucet': 'נזילה בברז',
      'kitchen_cabinet': 'ציר שבור',
    },
    bathTypes: {
      'bath_master': 'shower',
    },
  };

  // Save checklist state
  const { error: saveErr } = await supabase
    .from('delivery_reports')
    .update({ checklist_state: checklistState })
    .eq('id', testReportId);

  if (saveErr) {
    log('Save checklist state', 'fail', saveErr.message);
    return false;
  }
  log('Save checklist state', 'pass');

  // Read it back
  const { data: readBack, error: readErr } = await supabase
    .from('delivery_reports')
    .select('checklist_state')
    .eq('id', testReportId)
    .single();

  if (readErr || !readBack) {
    log('Read checklist state', 'fail', readErr?.message || 'Not found');
    return false;
  }

  const state = readBack.checklist_state;
  if (!state || !state.statuses || state.statuses.kitchen_faucet !== 'defect') {
    log('Verify checklist data', 'fail', `Got: ${JSON.stringify(state)}`);
    return false;
  }
  log('Verify checklist data', 'pass', `4 statuses, 2 defect texts`);

  return true;
}

// ============================================================
// TEST 4: Defect — Insert + Read
// ============================================================
async function testDefect() {
  console.log('\n─── TEST 4: Defect Insert + Read ───');

  // Insert defect
  const { data: defect, error: defectErr } = await supabase
    .from('defects')
    .insert({
      delivery_report_id: testReportId,
      organization_id: orgId,
      description: 'סדק בקיר — smoke test',
      room: 'סלון',
      category: 'טיח וצבע',
      standard_reference: 'ת"י 1920 סעיף 6.1',
      severity: 'medium',
      source: 'manual',
    })
    .select('id, description, category')
    .single();

  if (defectErr || !defect) {
    log('Insert defect', 'fail', defectErr?.message || 'No data');
    return false;
  }

  testDefectId = defect.id;
  log('Insert defect', 'pass', `id=${testDefectId}`);

  // Read defect back via report
  const { data: defects, error: readErr } = await supabase
    .from('defects')
    .select('id, description, category, room, severity')
    .eq('delivery_report_id', testReportId);

  if (readErr) {
    log('Read defects for report', 'fail', readErr.message);
    return false;
  }

  if (!defects || defects.length === 0) {
    log('Read defects for report', 'fail', 'No defects found');
    return false;
  }

  const found = defects.find(d => d.id === testDefectId);
  if (!found) {
    log('Verify defect data', 'fail', 'Defect not in results');
    return false;
  }
  log('Read defects for report', 'pass', `Found ${defects.length} defect(s)`);
  log('Verify defect fields', 'pass', `cat=${found.category}, room=${found.room}`);

  return true;
}

// ============================================================
// TEST 5: Status Transitions
// ============================================================
async function testStatusTransitions() {
  console.log('\n─── TEST 5: Status Transitions ───');

  // draft → in_progress
  const { error: err1 } = await supabase
    .from('delivery_reports')
    .update({ status: 'in_progress' })
    .eq('id', testReportId);

  if (err1) {
    log('draft → in_progress', 'fail', err1.message);
    return false;
  }
  log('draft → in_progress', 'pass');

  // in_progress → completed (with completed_at)
  const { error: err2 } = await supabase
    .from('delivery_reports')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
    })
    .eq('id', testReportId);

  if (err2) {
    log('in_progress → completed', 'fail', err2.message);
    return false;
  }
  log('in_progress → completed', 'pass');

  // Verify completed_at is set
  const { data: report } = await supabase
    .from('delivery_reports')
    .select('status, completed_at')
    .eq('id', testReportId)
    .single();

  if (!report?.completed_at) {
    log('Verify completed_at', 'fail', 'completed_at is null');
    return false;
  }
  log('Verify completed_at', 'pass', `completed_at=${report.completed_at}`);

  // completed → in_progress (reopen for editing)
  const { error: err3 } = await supabase
    .from('delivery_reports')
    .update({ status: 'in_progress' })
    .eq('id', testReportId);

  if (err3) {
    log('completed → in_progress (reopen)', 'fail', err3.message);
    return false;
  }
  log('completed → in_progress (reopen)', 'pass');

  return true;
}

// ============================================================
// TEST 6: Signatures — Insert + Immutability
// ============================================================
async function testSignatures() {
  console.log('\n─── TEST 6: Signatures ───');

  // Insert inspector signature
  const { data: sig, error: sigErr } = await supabase
    .from('signatures')
    .insert({
      delivery_report_id: testReportId,
      organization_id: orgId,
      signer_type: 'inspector',
      signer_name: 'חיים מסראתי',
      image_url: 'https://example.com/test-signature.png',
      signed_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (sigErr) {
    log('Insert signature', 'fail', sigErr.message);
    return false;
  }
  log('Insert inspector signature', 'pass', `id=${sig.id}`);

  // Try to UPDATE — should fail (immutable policy)
  const { error: updateErr } = await supabase
    .from('signatures')
    .update({ signer_name: 'Hacked Name' })
    .eq('id', sig.id);

  if (updateErr) {
    log('UPDATE signature blocked', 'pass', `Error: ${updateErr.message}`);
  } else {
    // Check if it actually changed
    const { data: check } = await supabase
      .from('signatures')
      .select('signer_name')
      .eq('id', sig.id)
      .single();

    if (check?.signer_name === 'Hacked Name') {
      log('UPDATE signature blocked', 'fail', 'UPDATE succeeded — SECURITY ISSUE');
    } else {
      log('UPDATE signature blocked', 'pass', 'No RLS error but data unchanged');
    }
  }

  // Try to DELETE — should fail
  const { error: deleteErr } = await supabase
    .from('signatures')
    .delete()
    .eq('id', sig.id);

  if (deleteErr) {
    log('DELETE signature blocked', 'pass', `Error: ${deleteErr.message}`);
  } else {
    // Check if it still exists
    const { data: check2 } = await supabase
      .from('signatures')
      .select('id')
      .eq('id', sig.id)
      .single();

    if (!check2) {
      log('DELETE signature blocked', 'fail', 'DELETE succeeded — SECURITY ISSUE');
    } else {
      log('DELETE signature blocked', 'pass', 'Record still exists');
    }
  }

  return true;
}

// ============================================================
// CLEANUP
// ============================================================
async function cleanup() {
  console.log('\n─── CLEANUP ───');

  // Delete in reverse order: defects → report
  if (testDefectId) {
    await supabase.from('defects').delete().eq('id', testDefectId);
    console.log(`  Deleted defect ${testDefectId}`);
  }

  if (testReportId) {
    // Delete signatures first (if still deletable via service role — won't work with anon)
    await supabase.from('signatures').delete().eq('delivery_report_id', testReportId);
    await supabase.from('delivery_reports').delete().eq('id', testReportId);
    console.log(`  Deleted report ${testReportId}`);
  }

  await supabase.auth.signOut();
  console.log('  Signed out');
}

// ============================================================
// MAIN
// ============================================================
async function main() {
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║     inField — MVP Smoke Test                ║');
  console.log('╚══════════════════════════════════════════════╝');

  const authOk = await testAuth();
  if (!authOk) {
    console.log('\n🛑 Auth failed — cannot continue');
    return;
  }

  const reportOk = await testCreateReport();
  if (!reportOk) {
    console.log('\n🛑 Report creation failed — cannot continue');
    await cleanup();
    return;
  }

  await testChecklist();
  await testDefect();
  await testStatusTransitions();
  await testSignatures();

  // Summary
  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║             RESULTS SUMMARY                 ║');
  console.log('╚══════════════════════════════════════════════╝');

  const passed = results.filter(r => r.status === 'pass').length;
  const failed = results.filter(r => r.status === 'fail').length;
  const warned = results.filter(r => r.status === 'warn').length;

  console.log(`\n  ✅ Passed: ${passed}`);
  console.log(`  ❌ Failed: ${failed}`);
  console.log(`  ⚠️  Warned: ${warned}`);
  console.log(`  Total: ${results.length}\n`);

  if (failed > 0) {
    console.log('Failed tests:');
    results.filter(r => r.status === 'fail').forEach(r => {
      console.log(`  ❌ ${r.test}: ${r.detail}`);
    });
  }

  await cleanup();

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('Unexpected error:', err);
  cleanup();
  process.exit(1);
});
