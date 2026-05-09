-- Seed Mock Properties

INSERT INTO properties (id, title, zone, type, operation, price, beds, baths, area, year, featured, amenities) 
VALUES ('00000000-0000-0000-0000-000000000001', 'Casa moderna con vista panorámica', 'Cumbayá', 'Casa', 'Venta', 285000, 4, 3, 280, 2021, true, '{"Piscina","Seguridad 24h","Garaje","Jardín","Pet friendly"}')
ON CONFLICT (id) DO UPDATE SET amenities = EXCLUDED.amenities;
INSERT INTO properties (id, title, zone, type, operation, price, beds, baths, area, year, featured, amenities) 
VALUES ('00000000-0000-0000-0000-000000000002', 'Departamento de lujo torre González', 'González Suárez', 'Departamento', 'Venta', 320000, 3, 3, 175, 2022, true, '{"Gimnasio","Seguridad 24h","Garaje","Amoblado","Pet friendly"}')
ON CONFLICT (id) DO UPDATE SET amenities = EXCLUDED.amenities;
INSERT INTO properties (id, title, zone, type, operation, price, beds, baths, area, year, featured, amenities) 
VALUES ('00000000-0000-0000-0000-000000000003', 'Penthouse con terraza privada', 'La Carolina', 'Departamento', 'Venta', 450000, 3, 3, 220, 2023, true, '{"Piscina","Gimnasio","Seguridad 24h","Terraza","Pet friendly"}')
ON CONFLICT (id) DO UPDATE SET amenities = EXCLUDED.amenities;
INSERT INTO properties (id, title, zone, type, operation, price, beds, baths, area, year, featured, amenities) 
VALUES ('00000000-0000-0000-0000-000000000004', 'Casa familiar con jardín', 'Valle de los Chillos', 'Casa', 'Venta', 185000, 4, 3, 260, 2018, true, '{"Jardín","Garaje"}')
ON CONFLICT (id) DO UPDATE SET amenities = EXCLUDED.amenities;
INSERT INTO properties (id, title, zone, type, operation, price, beds, baths, area, year, featured, amenities) 
VALUES ('00000000-0000-0000-0000-000000000005', 'Oficina prime piso 14', 'La Carolina', 'Oficina', 'Venta', 165000, 0, 2, 120, 2020, true, '{"Seguridad 24h","Garaje"}')
ON CONFLICT (id) DO UPDATE SET amenities = EXCLUDED.amenities;
INSERT INTO properties (id, title, zone, type, operation, price, beds, baths, area, year, featured, amenities) 
VALUES ('00000000-0000-0000-0000-000000000006', 'Loft contemporáneo en Tumbaco', 'Tumbaco', 'Departamento', 'Arriendo', 1200, 1, 1, 75, 2022, true, '{"Gimnasio","Seguridad 24h","Pet friendly","Amoblado"}')
ON CONFLICT (id) DO UPDATE SET amenities = EXCLUDED.amenities;
INSERT INTO properties (id, title, zone, type, operation, price, beds, baths, area, year, featured, amenities) 
VALUES ('00000000-0000-0000-0000-000000000007', 'Suite ejecutiva amoblada', 'Quito Norte', 'Departamento', 'Arriendo', 850, 1, 1, 55, 2021, false, '{"Gimnasio","Amoblado"}')
ON CONFLICT (id) DO UPDATE SET amenities = EXCLUDED.amenities;
INSERT INTO properties (id, title, zone, type, operation, price, beds, baths, area, year, featured, amenities) 
VALUES ('00000000-0000-0000-0000-000000000008', 'Casa colonial restaurada', 'Quito Norte', 'Casa', 'Venta', 215000, 5, 4, 340, 1995, false, '{"Jardín","Garaje","Chimenea"}')
ON CONFLICT (id) DO UPDATE SET amenities = EXCLUDED.amenities;
INSERT INTO properties (id, title, zone, type, operation, price, beds, baths, area, year, featured, amenities) 
VALUES ('00000000-0000-0000-0000-000000000009', 'Local comercial en zona rosa', 'La Carolina', 'Local', 'Arriendo', 2400, 0, 1, 140, 2010, false, '{"Seguridad 24h"}')
ON CONFLICT (id) DO UPDATE SET amenities = EXCLUDED.amenities;
INSERT INTO properties (id, title, zone, type, operation, price, beds, baths, area, year, featured, amenities) 
VALUES ('00000000-0000-0000-0000-000000000010', 'Departamento amplio con vista', 'Cumbayá', 'Departamento', 'Venta', 225000, 3, 2, 140, 2019, false, '{"Piscina","Gimnasio","Seguridad 24h","Pet friendly"}')
ON CONFLICT (id) DO UPDATE SET amenities = EXCLUDED.amenities;
INSERT INTO properties (id, title, zone, type, operation, price, beds, baths, area, year, featured, amenities) 
VALUES ('00000000-0000-0000-0000-000000000011', 'Casa de campo con terreno', 'Tumbaco', 'Casa', 'Venta', 295000, 5, 4, 380, 2017, false, '{"Jardín","Piscina","Garaje"}')
ON CONFLICT (id) DO UPDATE SET amenities = EXCLUDED.amenities;
INSERT INTO properties (id, title, zone, type, operation, price, beds, baths, area, year, featured, amenities) 
VALUES ('00000000-0000-0000-0000-000000000012', 'Studio minimalista céntrico', 'Quito Norte', 'Departamento', 'Arriendo', 680, 1, 1, 45, 2023, false, '{"Seguridad 24h","Pet friendly","Amoblado"}')
ON CONFLICT (id) DO UPDATE SET amenities = EXCLUDED.amenities;
INSERT INTO properties (id, title, zone, type, operation, price, beds, baths, area, year, featured, amenities) 
VALUES ('00000000-0000-0000-0000-000000000013', 'Casa premium en conjunto cerrado', 'Cumbayá', 'Casa', 'Venta', 395000, 4, 4, 320, 2022, false, '{"Piscina","Seguridad 24h","Garaje","Jardín"}')
ON CONFLICT (id) DO UPDATE SET amenities = EXCLUDED.amenities;
INSERT INTO properties (id, title, zone, type, operation, price, beds, baths, area, year, featured, amenities) 
VALUES ('00000000-0000-0000-0000-000000000014', 'Departamento estrenar con balcón', 'Valle de los Chillos', 'Departamento', 'Venta', 135000, 2, 2, 95, 2024, false, '{"Garaje","Seguridad 24h","Pet friendly","Terraza"}')
ON CONFLICT (id) DO UPDATE SET amenities = EXCLUDED.amenities;
INSERT INTO properties (id, title, zone, type, operation, price, beds, baths, area, year, featured, amenities) 
VALUES ('00000000-0000-0000-0000-000000000015', 'Oficina coworking-friendly', 'Quito Norte', 'Oficina', 'Arriendo', 1450, 0, 2, 90, 2021, false, '{"Seguridad 24h"}')
ON CONFLICT (id) DO UPDATE SET amenities = EXCLUDED.amenities;
INSERT INTO properties (id, title, zone, type, operation, price, beds, baths, area, year, featured, amenities) 
VALUES ('00000000-0000-0000-0000-000000000016', 'Casa familiar 3 plantas', 'Valle de los Chillos', 'Casa', 'Venta', 155000, 4, 3, 240, 2015, false, '{"Jardín","Garaje"}')
ON CONFLICT (id) DO UPDATE SET amenities = EXCLUDED.amenities;
INSERT INTO properties (id, title, zone, type, operation, price, beds, baths, area, year, featured, amenities) 
VALUES ('00000000-0000-0000-0000-000000000017', 'Suite González Suárez vista al valle', 'González Suárez', 'Departamento', 'Arriendo', 1100, 2, 2, 110, 2020, false, '{"Gimnasio","Seguridad 24h"}')
ON CONFLICT (id) DO UPDATE SET amenities = EXCLUDED.amenities;
INSERT INTO properties (id, title, zone, type, operation, price, beds, baths, area, year, featured, amenities) 
VALUES ('00000000-0000-0000-0000-000000000018', 'Local esquinero alta circulación', 'Quito Norte', 'Local', 'Venta', 118000, 0, 1, 80, 2008, false, '{}')
ON CONFLICT (id) DO UPDATE SET amenities = EXCLUDED.amenities;
