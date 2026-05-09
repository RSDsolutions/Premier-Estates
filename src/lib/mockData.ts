import type { Property, Notification, AdminClient, AdminVisitRow } from '../types'

export const MOCK_PROPERTIES: Property[] = [
  { id: '1',  title: 'Casa moderna con vista panorámica',     zone: 'Cumbayá',             type: 'Casa',         operation: 'Venta',   price: 285000, beds: 4, baths: 3, area: 280, year: 2021, featured: true,  amenities: ['Piscina','Seguridad 24h','Garaje','Jardín','Pet friendly'],           pin: {x:72,y:55}, location: { lat: -0.1952, lng: -78.4250 } },
  { id: '2',  title: 'Departamento de lujo torre González',    zone: 'González Suárez',     type: 'Departamento', operation: 'Venta',   price: 320000, beds: 3, baths: 3, area: 175, year: 2022, featured: true,  amenities: ['Gimnasio','Seguridad 24h','Garaje','Amoblado','Pet friendly'],                   pin: {x:48,y:48}, location: { lat: -0.2085, lng: -78.4840 } },
  { id: '3',  title: 'Penthouse con terraza privada',          zone: 'La Carolina',         type: 'Departamento', operation: 'Venta',   price: 450000, beds: 3, baths: 3, area: 220, year: 2023, featured: true,  amenities: ['Piscina','Gimnasio','Seguridad 24h','Terraza','Pet friendly'],        pin: {x:42,y:38}, location: { lat: -0.1730, lng: -78.4820 } },
  { id: '4',  title: 'Casa familiar con jardín',               zone: 'Valle de los Chillos',type: 'Casa',         operation: 'Venta',   price: 185000, beds: 4, baths: 3, area: 260, year: 2018, featured: true,  amenities: ['Jardín','Garaje'],                                    pin: {x:65,y:78}, location: { lat: -0.3150, lng: -78.4460 } },
  { id: '5',  title: 'Oficina prime piso 14',                  zone: 'La Carolina',         type: 'Oficina',      operation: 'Venta',   price: 165000, beds: 0, baths: 2, area: 120, year: 2020, featured: true,  amenities: ['Seguridad 24h','Garaje'],                             pin: {x:38,y:42}, location: { lat: -0.1760, lng: -78.4850 } },
  { id: '6',  title: 'Loft contemporáneo en Tumbaco',          zone: 'Tumbaco',             type: 'Departamento', operation: 'Arriendo',price: 1200,   beds: 1, baths: 1, area: 75,  year: 2022, featured: true,  amenities: ['Gimnasio','Seguridad 24h','Pet friendly','Amoblado'],                           pin: {x:80,y:48}, location: { lat: -0.2195, lng: -78.4030 } },
  { id: '7',  title: 'Suite ejecutiva amoblada',               zone: 'Quito Norte',         type: 'Departamento', operation: 'Arriendo',price: 850,    beds: 1, baths: 1, area: 55,  year: 2021, featured: false, amenities: ['Gimnasio','Amoblado'],                                           pin: {x:32,y:30}, location: { lat: -0.1285, lng: -78.4900 } },
  { id: '8',  title: 'Casa colonial restaurada',               zone: 'Quito Norte',         type: 'Casa',         operation: 'Venta',   price: 215000, beds: 5, baths: 4, area: 340, year: 1995, featured: false, amenities: ['Jardín','Garaje','Chimenea'],                         pin: {x:30,y:35}, location: { lat: -0.1320, lng: -78.4870 } },
  { id: '9',  title: 'Local comercial en zona rosa',           zone: 'La Carolina',         type: 'Local',        operation: 'Arriendo',price: 2400,   beds: 0, baths: 1, area: 140, year: 2010, featured: false, amenities: ['Seguridad 24h'],                                      pin: {x:45,y:45}, location: { lat: -0.1750, lng: -78.4810 } },
  { id: '10', title: 'Departamento amplio con vista',          zone: 'Cumbayá',             type: 'Departamento', operation: 'Venta',   price: 225000, beds: 3, baths: 2, area: 140, year: 2019, featured: false, amenities: ['Piscina','Gimnasio','Seguridad 24h','Pet friendly'],                 pin: {x:75,y:58}, location: { lat: -0.1980, lng: -78.4300 } },
  { id: '11', title: 'Casa de campo con terreno',              zone: 'Tumbaco',             type: 'Casa',         operation: 'Venta',   price: 295000, beds: 5, baths: 4, area: 380, year: 2017, featured: false, amenities: ['Jardín','Piscina','Garaje'],                          pin: {x:82,y:52}, location: { lat: -0.2240, lng: -78.4080 } },
  { id: '12', title: 'Studio minimalista céntrico',            zone: 'Quito Norte',         type: 'Departamento', operation: 'Arriendo',price: 680,    beds: 1, baths: 1, area: 45,  year: 2023, featured: false, amenities: ['Seguridad 24h','Pet friendly','Amoblado'],                                      pin: {x:34,y:28}, location: { lat: -0.1270, lng: -78.4860 } },
  { id: '13', title: 'Casa premium en conjunto cerrado',       zone: 'Cumbayá',             type: 'Casa',         operation: 'Venta',   price: 395000, beds: 4, baths: 4, area: 320, year: 2022, featured: false, amenities: ['Piscina','Seguridad 24h','Garaje','Jardín'],           pin: {x:74,y:60}, location: { lat: -0.2005, lng: -78.4265 } },
  { id: '14', title: 'Departamento estrenar con balcón',       zone: 'Valle de los Chillos',type: 'Departamento', operation: 'Venta',   price: 135000, beds: 2, baths: 2, area: 95,  year: 2024, featured: false, amenities: ['Garaje','Seguridad 24h','Pet friendly','Terraza'],                             pin: {x:62,y:75}, location: { lat: -0.3195, lng: -78.4490 } },
  { id: '15', title: 'Oficina coworking-friendly',             zone: 'Quito Norte',         type: 'Oficina',      operation: 'Arriendo',price: 1450,   beds: 0, baths: 2, area: 90,  year: 2021, featured: false, amenities: ['Seguridad 24h'],                                      pin: {x:36,y:32}, location: { lat: -0.1300, lng: -78.4920 } },
  { id: '16', title: 'Casa familiar 3 plantas',                zone: 'Valle de los Chillos',type: 'Casa',         operation: 'Venta',   price: 155000, beds: 4, baths: 3, area: 240, year: 2015, featured: false, amenities: ['Jardín','Garaje'],                                    pin: {x:64,y:80}, location: { lat: -0.3175, lng: -78.4445 } },
  { id: '17', title: 'Suite González Suárez vista al valle',   zone: 'González Suárez',     type: 'Departamento', operation: 'Arriendo',price: 1100,   beds: 2, baths: 2, area: 110, year: 2020, featured: false, amenities: ['Gimnasio','Seguridad 24h'],                           pin: {x:50,y:50}, location: { lat: -0.2110, lng: -78.4855 } },
  { id: '18', title: 'Local esquinero alta circulación',       zone: 'Quito Norte',         type: 'Local',        operation: 'Venta',   price: 118000, beds: 0, baths: 1, area: 80,  year: 2008, featured: false, amenities: [],                                                     pin: {x:30,y:32}, location: { lat: -0.1335, lng: -78.4885 } },
]

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'Nueva visita confirmada', body: 'María L. agendó para Casa Cumbayá Hills · Vie 10 Mayo, 11:00', time: 'hace 12 min', icn: 'calendar', read: false },
  { id: '2', title: 'Consulta nueva', body: 'Andrés P. preguntó por la alícuota mensual del Depto González Suárez Tower', time: 'hace 38 min', icn: 'comment', read: false },
  { id: '3', title: 'Pago confirmado', body: 'Listado destacado · $ 1.200 acreditados a tu cuenta', time: 'hace 1 h', icn: 'dollar-sign', read: false },
  { id: '4', title: 'Contrato firmado', body: 'Lucía R. firmó digitalmente el contrato de arriendo PE-CTR-2026-1041', time: 'hace 3 h', icn: 'signature', read: true },
  { id: '5', title: 'Propiedad publicada', body: 'Oficina La Carolina ya está visible en el sitio público', time: 'hoy 09:14', icn: 'house-chimney', read: true },
  { id: '6', title: 'Resumen semanal', body: 'Esta semana: 38 visitas, 17 leads, +22% vs anterior', time: 'ayer 18:00', icn: 'chart-line', read: true },
]

export const MOCK_CLIENTS: AdminClient[] = [
  { id: '1', name: 'María González',   meta: 'Cliente activo · 4 visitas',       seed: 'maria' },
  { id: '2', name: 'Andrés Paredes',   meta: 'Lead caliente · 2 consultas',      seed: 'andres' },
  { id: '3', name: 'Lucía Romero',     meta: 'Contrato firmado · arriendo',      seed: 'lucia' },
  { id: '4', name: 'Pedro Salinas',    meta: 'Lead nuevo',                       seed: 'pedro' },
  { id: '5', name: 'Carla Vinueza',    meta: 'Cliente recurrente',               seed: 'carla' },
  { id: '6', name: 'Diego Erazo',      meta: 'Lead frío',                        seed: 'diego' },
  { id: '7', name: 'Sofía Mantilla',   meta: 'Cliente activo · 1 visita',        seed: 'sofia' },
  { id: '8', name: 'Juan Carlos T.',   meta: 'Inversionista',                    seed: 'juancarlos' },
]

export const MOCK_VISITS: AdminVisitRow[] = [
  { client: 'María González',  property: 'Casa Cumbayá Hills',          date: 'Vie 10 May', time: '11:00', status: 'Confirmada' },
  { client: 'Andrés Paredes',  property: 'Depto González Suárez',       date: 'Sáb 11 May', time: '15:00', status: 'Pendiente' },
  { client: 'Lucía Romero',    property: 'Penthouse La Carolina',        date: 'Dom 12 May', time: '09:00', status: 'Confirmada' },
  { client: 'Pedro Salinas',   property: 'Loft Tumbaco',                 date: 'Lun 13 May', time: '17:00', status: 'Cancelada' },
  { client: 'Carla Vinueza',   property: 'Casa Valle de los Chillos',    date: 'Mar 14 May', time: '11:00', status: 'Confirmada' },
  { client: 'Diego Erazo',     property: 'Oficina La Carolina',          date: 'Mié 15 May', time: '15:00', status: 'Pendiente' },
]

const COVER_PHOTOS = [
  '1564013799919-ab600027ffc6', // 1  casa moderna piscina
  '1502672260266-1c1ef2d93688', // 2  departamento lujo interior
  '1600596542815-ffad4c1539a9', // 3  villa moderna exterior
  '1512917774080-9991f1c4c750', // 4  casa piscina infinita
  '1613490493576-4d884e6bedd4', // 5  arquitectura moderna
  '1570129477492-45c003edd2be', // 6  casa blanca contemporánea
  '1580587771525-78b9dba3b914', // 7  villa exterior jardín
  '1600607687939-ce8a6c25118c', // 8  casa garaje moderno
  '1558618666-fcd25c85cd64',    // 9  local esquinero noche
  '1574362848149-11496d93a7c7', // 10 casa campo amplia
  '1449844908441-8d4cef973a7e', // 11 casa jardín exterior
  '1505843513577-22bb7d21e455', // 12 studio minimalista
  '1460317442991-0ec209397118', // 13 villa con piscina
  '1600566753376-12c8ab7fb75b', // 14 departamento estrenar
  '1497366216679-aa24d2f30f3f', // 15 oficina corporativa
  '1583847268964-b28dc8f51f92', // 16 casa familiar
  '1416331915194-334e4e7736f6', // 17 suite contemporánea
  '1534430480872-3498386e7856', // 18 propiedad lujo
]

const GALLERY_EXTRA = [
  '1556909114-f6e7ad7d3136',    // cocina moderna
  '1484154218962-a197022b5858', // sala de estar
  '1502005097973-6a7082348e1b', // interior moderno
  '1554995207-c18c203602cb',    // terraza exterior
  '1568605114967-8130f3a36994', // interior lujo
  '1540518614846-7eded433c457', // área piscina
  '1616594039964-ae9021a400a0', // baño moderno
  '1558442086-0f1224b29176',    // dormitorio principal
]

const UNS = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`

export const photoUrl = (id: string, w = 600, h = 400) => {
  const idx = (parseInt(id, 10) - 1 + COVER_PHOTOS.length) % COVER_PHOTOS.length
  return UNS(COVER_PHOTOS[idx], w, h)
}

export const galleryUrls = (id: string): string[] => {
  const seed = parseInt(id, 10) - 1
  const cover = COVER_PHOTOS[seed % COVER_PHOTOS.length]
  const extras = [0, 1, 2, 3].map(i => GALLERY_EXTRA[(seed + i) % GALLERY_EXTRA.length])
  return [cover, ...extras].map(p => UNS(p, 1200, 750))
}

export const fmtPrice = (p: Property): string => {
  const n = p.price.toLocaleString('es-EC')
  return p.operation === 'Arriendo' ? `$ ${n} / mes` : `$ ${n}`
}
