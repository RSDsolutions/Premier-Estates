import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  // Docuseal webhook: submission completed
  if (req.method === 'POST' && req.headers.get('x-docuseal-event')) {
    const payload = await req.json()
    if (payload.event_type === 'submission.completed') {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      )
      await supabase.from('documents')
        .update({ status: 'signed', signed_at: new Date().toISOString() })
        .eq('docuseal_submission_id', String(payload.data?.submission?.id ?? ''))
    }
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Create new Docuseal submission
  try {
    const { template_id, email, full_name, property_id, user_id } = await req.json()

    const docusealUrl = Deno.env.get('DOCUSEAL_API_URL') ?? 'https://api.docuseal.com'
    const docusealToken = Deno.env.get('DOCUSEAL_API_TOKEN')!

    const res = await fetch(`${docusealUrl}/submissions`, {
      method: 'POST',
      headers: {
        'X-Auth-Token': docusealToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        template_id,
        send_email: true,
        submitters: [{ role: 'First Party', email, name: full_name }],
      }),
    })

    if (!res.ok) {
      const txt = await res.text()
      throw new Error(`Docuseal error ${res.status}: ${txt}`)
    }

    const data = await res.json()
    const submissionId = data[0]?.submission_id ?? data?.id

    // Record in DB
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )
    await supabase.from('documents').insert({
      property_id: property_id ?? null,
      user_id: user_id ?? null,
      docuseal_submission_id: String(submissionId),
      doc_type: 'purchase_contract',
      status: 'sent',
    })

    return new Response(JSON.stringify({ submission_id: submissionId, embed_url: data[0]?.embed_src }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
