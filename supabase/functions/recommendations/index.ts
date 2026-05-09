import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import OpenAI from 'https://esm.sh/openai@4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { zone, type, budget, operation } = await req.json()

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Fetch candidate properties from DB
    let query = supabase
      .from('properties')
      .select('id, title, type, zone, price, operation, beds, baths, area, featured')
      .eq('status', 'active')
      .order('featured', { ascending: false })
      .limit(30)

    if (zone) query = query.eq('zone', zone)
    if (type) query = query.eq('type', type)
    if (operation) query = query.eq('operation', operation)
    if (budget) query = query.lte('price', budget)

    const { data: properties, error } = await query
    if (error) throw error

    if (!properties?.length) {
      return new Response(JSON.stringify({ recommendations: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const openai = new OpenAI({ apiKey: Deno.env.get('OPENAI_API_KEY') })

    const prompt = `Eres un asesor inmobiliario experto en el mercado de Quito, Ecuador.
El cliente busca: tipo="${type ?? 'cualquiera'}", zona="${zone ?? 'cualquiera'}",
operación="${operation ?? 'Venta'}", presupuesto máximo=${budget ? `$${budget.toLocaleString()}` : 'sin límite'}.

Aquí tienes las propiedades disponibles (JSON):
${JSON.stringify(properties, null, 2)}

Selecciona las 3 mejores opciones para este cliente y responde en JSON con este esquema exacto:
{
  "recommendations": [
    { "id": "uuid", "reason": "frase corta de 1 línea explicando por qué es ideal" }
  ]
}
Solo JSON, sin texto adicional.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    })

    const result = JSON.parse(completion.choices[0].message.content ?? '{"recommendations":[]}')

    // Enrich with full property data
    const enriched = result.recommendations.map((rec: { id: string; reason: string }) => {
      const prop = properties.find(p => p.id === rec.id)
      return prop ? { ...prop, aiReason: rec.reason } : null
    }).filter(Boolean)

    return new Response(JSON.stringify({ recommendations: enriched }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
