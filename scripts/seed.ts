import { createClient } from '@supabase/supabase-js'
import { MOCK_PROPERTIES } from '../src/lib/mockData.js'

const supabase = createClient('https://agywmngwewbbbitvotlk.supabase.co', 'sb_publishable_Y--b-FxX1us6Q77Zb5UyMQ_FiFv28tY')

async function seed() {
  console.log('Inserting mock properties...')
  for (let i = 0; i < MOCK_PROPERTIES.length; i++) {
    const prop = MOCK_PROPERTIES[i];
    // Create a deterministic UUID from the integer ID
    const paddedId = prop.id.padStart(12, '0');
    const uuid = `00000000-0000-0000-0000-${paddedId}`;
    
    // Omit fields that are not in the database or need special formatting
    const { id, pin, location, ...data } = prop;
    
    const { error } = await supabase.from('properties').insert({ 
      ...data, 
      id: uuid 
    });
    
    if (error) {
      console.error(`Error inserting ${prop.title}:`, error.message)
    } else {
      console.log(`Inserted ${prop.title}`)
    }
  }
  console.log('Seeding complete!')
}
seed()
