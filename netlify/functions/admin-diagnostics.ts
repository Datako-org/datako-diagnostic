import { createClient } from '@supabase/supabase-js';

interface NetlifyEvent {
  httpMethod: string;
  headers: Record<string, string | undefined>;
  queryStringParameters: Record<string, string> | null;
  body: string | null;
}

interface NetlifyResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, x-admin-password',
  'Access-Control-Allow-Methods': 'GET, PATCH, DELETE, OPTIONS',
};

export const handler = async (event: NetlifyEvent): Promise<NetlifyResponse> => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  // Auth
  const providedPassword = event.headers['x-admin-password'];
  if (!providedPassword || providedPassword !== process.env.ADMIN_PASSWORD) {
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  // Env vars
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Missing env vars' }),
    };
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // ── PATCH — update crm_status / internal_notes ───────────────────────────
  if (event.httpMethod === 'PATCH') {
    let body: Record<string, unknown> = {};
    try {
      body = JSON.parse(event.body || '{}');
    } catch {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Invalid JSON' }) };
    }

    if (!body.id) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Missing id' }) };
    }

    const updates: Record<string, unknown> = {};
    if (body.crm_status !== undefined) updates.crm_status = body.crm_status;
    if (body.internal_notes !== undefined) updates.internal_notes = body.internal_notes;
    if (body.deleted_at !== undefined) updates.deleted_at = body.deleted_at;

    const { error } = await supabase
      .from('diagnostics')
      .update(updates)
      .eq('id', body.id as string);

    if (error) {
      return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: error.message }) };
    }

    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: true }) };
  }

  // ── DELETE — soft delete bulk or permanent delete ────────────────────────
  if (event.httpMethod === 'DELETE') {
    let body: Record<string, unknown> = {};
    try {
      body = JSON.parse(event.body || '{}');
    } catch {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Invalid JSON' }) };
    }

    const ids = body.ids as string[];
    if (!Array.isArray(ids) || ids.length === 0) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Missing or empty ids' }) };
    }

    if (body.permanent === true) {
      const { error } = await supabase.from('diagnostics').delete().in('id', ids);
      if (error) {
        return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: error.message }) };
      }
      return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: true, count: ids.length }) };
    }

    const { error } = await supabase
      .from('diagnostics')
      .update({ deleted_at: new Date().toISOString() })
      .in('id', ids);

    if (error) {
      return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: error.message }) };
    }

    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: true, count: ids.length }) };
  }

  const params = event.queryStringParameters || {};

  // ── Detail view ──────────────────────────────────────────────────────────
  if (params.id) {
    const [{ data: diag, error: diagErr }, { data: answers, error: answErr }] = await Promise.all([
      supabase
        .from('diagnostics')
        .select('id, total_score, maturity_level, status, completed_at, axis_scores, organization_id, respondent_id, crm_status, internal_notes, additional_need')
        .eq('id', params.id)
        .single(),
      supabase
        .from('answers')
        .select('id, question_id, answer_value, score')
        .eq('diagnostic_id', params.id),
    ]);

    if (diagErr) {
      return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: diagErr.message }) };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const d = diag as any;

    const [{ data: org }, { data: respondent }] = await Promise.all([
      d.organization_id
        ? supabase.from('organizations').select('name, sector, country, size').eq('id', d.organization_id).single()
        : Promise.resolve({ data: null }),
      d.respondent_id
        ? supabase.from('respondents').select('name, email, phone, role').eq('id', d.respondent_id).single()
        : Promise.resolve({ data: null }),
    ]);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        data: {
          id: d.id,
          total_score: d.total_score,
          maturity_level: d.maturity_level,
          completed_at: d.completed_at,
          axis_scores: d.axis_scores,
          crm_status: d.crm_status ?? 'new',
          internal_notes: d.internal_notes ?? null,
          additional_need: d.additional_need ?? null,
          organizations: org,
          respondents: respondent,
          answers: answErr ? [] : (answers ?? []),
        },
      }),
    };
  }

  // ── List view ─────────────────────────────────────────────────────────────
  const includeDeleted = params.include_deleted === 'true';

  let listQuery = supabase
    .from('diagnostics')
    .select('id, total_score, maturity_level, status, completed_at, axis_scores, organization_id, respondent_id, crm_status, internal_notes, deleted_at')
    .eq('status', 'completed');

  if (!includeDeleted) {
    listQuery = listQuery.is('deleted_at', null);
  }

  const { data: diagnostics, error: diagErr } = await listQuery.order('completed_at', { ascending: false });

  if (diagErr) {
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: diagErr.message }) };
  }

  const rows = diagnostics ?? [];

  const orgIds = [...new Set(rows.map((d) => d.organization_id).filter(Boolean))] as string[];
  const respIds = [...new Set(rows.map((d) => d.respondent_id).filter(Boolean))] as string[];

  const [{ data: orgs }, { data: respondents }] = await Promise.all([
    orgIds.length > 0
      ? supabase.from('organizations').select('id, name, sector, country, size').in('id', orgIds)
      : Promise.resolve({ data: [] }),
    respIds.length > 0
      ? supabase.from('respondents').select('id, name, email, phone, role').in('id', respIds)
      : Promise.resolve({ data: [] }),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orgMap: Record<string, any> = Object.fromEntries((orgs ?? []).map((o: any) => [o.id, o]));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const respMap: Record<string, any> = Object.fromEntries((respondents ?? []).map((r: any) => [r.id, r]));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flatData = rows.map((d: any) => {
    const org = d.organization_id ? orgMap[d.organization_id] : null;
    const resp = d.respondent_id ? respMap[d.respondent_id] : null;
    return {
      id: d.id,
      completed_at: d.completed_at,
      total_score: d.total_score,
      maturity_level: d.maturity_level,
      axis_scores: d.axis_scores,
      crm_status: d.crm_status ?? 'new',
      internal_notes: d.internal_notes ?? null,
      deleted_at: d.deleted_at ?? null,
      org_name: org?.name ?? '',
      sector: org?.sector ?? '',
      country: org?.country ?? '',
      size: org?.size ?? '',
      respondent_name: resp?.name ?? '',
      email: resp?.email ?? '',
      role: resp?.role ?? '',
      phone: resp?.phone ?? null,
    };
  });

  const total = flatData.length;
  const avgScore =
    total > 0 ? Math.round(flatData.reduce((s, d) => s + (d.total_score || 0), 0) / total) : 0;

  const sectorCounts: Record<string, number> = {};
  flatData.forEach((d) => {
    if (d.sector) sectorCounts[d.sector] = (sectorCounts[d.sector] || 0) + 1;
  });

  const advancedCount = flatData.filter(
    (d) => d.maturity_level === 'avance' || d.maturity_level === 'expert'
  ).length;
  const advancedPercent = total > 0 ? Math.round((advancedCount / total) * 100) : 0;

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({
      data: flatData,
      count: total,
      stats: { total, avgScore, sectorCounts, advancedPercent },
    }),
  };
};
