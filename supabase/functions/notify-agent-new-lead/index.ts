import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req: Request) => {
  try {
    const payload = await req.json()
    if (payload.type !== 'INSERT' || payload.table !== 'leads') {
        return new Response('Not applicable', { status: 200 })
    }
    
    const lead = payload.record
    const agentId = lead.agent_id
    
    if (!agentId) return new Response('No agent assigned', { status: 200 })

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    await supabaseClient.from('notifications').insert({
      user_id: agentId,
      title: 'Nuevo Lead Interesado',
      message: `${lead.name} acaba de solicitar información a tu propiedad.`,
      type: 'system',
      read: false
    })

    return new Response("Notification generated", { status: 200 })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})
