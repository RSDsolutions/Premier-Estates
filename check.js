import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://agywmngwewbbbitvotlk.supabase.co', 'sb_publishable_Y--b-FxX1us6Q77Zb5UyMQ_FiFv28tY')

async function run() {
  const { data, error } = await supabase.from('properties').select('*')
  console.log('Propiedades en la base de datos:', data?.length)
  if (error) console.error('Error:', error)
  if (data?.length === 0) {
    console.log("No hay propiedades porque la tabla fue recien creada.")
  } else {
    console.log("Primeras propiedades:", data?.slice(0, 2))
  }
}
run()
