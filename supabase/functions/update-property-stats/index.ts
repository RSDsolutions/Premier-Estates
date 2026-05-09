import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req: Request) => {
  try {
    const payload = await req.json()
    let propertyId = null
    let statColumn = null

    // Support both visits (views_count proxy) and favorites
    if (payload.table === 'favorites' && payload.type === 'INSERT') {
      propertyId = payload.record.property_id
      statColumn = 'favorites_count'
    } else if (payload.table === 'visits' && payload.type === 'INSERT') {
      propertyId = payload.record.property_id
      statColumn = 'views_count' // Incrementing views on visit logic request
    }

    if (!propertyId || !statColumn) {
       return new Response("Not applicable", { status: 200 })
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    const { data: prop } = await supabaseClient.from('properties').select(statColumn).eq('id', propertyId).single()
    const newValue = (prop?.[statColumn] || 0) + 1
    
    await supabaseClient.from('properties').update({ [statColumn]: newValue }).eq('id', propertyId)

    return new Response("Updated successfully", { status: 200 })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})
