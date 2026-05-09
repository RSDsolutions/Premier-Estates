import fs from 'fs'
import { MOCK_PROPERTIES } from '../src/lib/mockData.js'

let sql = '-- Seed Mock Properties\n\n'

for (let i = 0; i < MOCK_PROPERTIES.length; i++) {
  const prop = MOCK_PROPERTIES[i];
  const paddedId = prop.id.padStart(12, '0');
  const uuid = `00000000-0000-0000-0000-${paddedId}`;
  
  // Escape strings properly
  const title = prop.title.replace(/'/g, "''");
  const zone = prop.zone.replace(/'/g, "''");
  const type = prop.type;
  const operation = prop.operation;
  
  // Format arrays for PostgreSQL
  const amenitiesStr = prop.amenities.map(a => `"${a.replace(/"/g, '""')}"`).join(',');
  const amenitiesSql = `'{${amenitiesStr}}'`;

  sql += `INSERT INTO properties (id, title, zone, type, operation, price, beds, baths, area, year, featured, amenities) 
VALUES ('${uuid}', '${title}', '${zone}', '${type}', '${operation}', ${prop.price}, ${prop.beds}, ${prop.baths}, ${prop.area}, ${prop.year}, ${prop.featured}, ${amenitiesSql})
ON CONFLICT (id) DO UPDATE SET amenities = EXCLUDED.amenities;\n`;
}

fs.writeFileSync('supabase/seed_data.sql', sql)
console.log('supabase/seed_data.sql created successfully!')
