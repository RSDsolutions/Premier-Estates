import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req: Request) => {
  try {
    const payload = await req.json()
    // payload represents Postgres webhook body
    // we assume this is called on INSERT via webhook before it returns, or updates it
    const propertyId = payload.record.id
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Generate number: get count of properties this year
    const currentYear = new Date().getFullYear()
    
    const { count } = await supabaseClient
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', `${currentYear}-01-01T00:00:00Z`)

    const sequence = (count || 0) + 1
    const mlsNumber = `MLS-${currentYear}-${String(sequence).padStart(4, '0')}`

    await supabaseClient
      .from('properties')
      .update({ mls_number: mlsNumber })
      .eq('id', propertyId)

    return new Response(JSON.stringify({ mlsNumber }), { status: 200, headers: { "Content-Type": "application/json" } })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})
