-- ============================================================
-- HungerMap PK — NGO Seed Data
-- Source: Project Plan PDF, page 14 + implementation note.
-- Multi-city NGOs get ONE ROW PER CITY so the matching engine
-- (filters by city + urgency) returns results in every city.
-- Cities covered: Karachi, Lahore, Islamabad, Peshawar, Quetta, Multan.
-- ============================================================

INSERT INTO ngos (name, city, district, address, phone, email, programs, urgency_levels_served, operating_hours, capacity_flag, verified) VALUES

-- Edhi Foundation (Karachi, Lahore, Islamabad)
('Edhi Foundation', 'Karachi', 'Karachi Central', 'Mithadar, near Boulton Market, Karachi', '115', 'info@edhi.org', ARRAY['Food distribution','Emergency rations'], ARRAY['CRITICAL','MODERATE','LOW'], '24/7', true, true),
('Edhi Foundation', 'Lahore', 'Lahore', 'Edhi Home, Ferozepur Road, Lahore', '115', 'info@edhi.org', ARRAY['Food distribution','Emergency rations'], ARRAY['CRITICAL','MODERATE','LOW'], '24/7', true, true),
('Edhi Foundation', 'Islamabad', 'Islamabad', 'Edhi Centre, G-8 Markaz, Islamabad', '115', 'info@edhi.org', ARRAY['Food distribution','Emergency rations'], ARRAY['CRITICAL','MODERATE','LOW'], '24/7', true, true),

-- Saylani Welfare Trust (Karachi, Lahore)
('Saylani Welfare Trust', 'Karachi', 'Karachi East', 'Bahadurabad, Karachi', '021-111-729-526', 'info@saylaniwelfare.com', ARRAY['Daily langar','Ration bags'], ARRAY['CRITICAL','MODERATE','LOW'], 'Mon-Sun 8am-10pm', true, true),
('Saylani Welfare Trust', 'Lahore', 'Lahore', 'Township, Lahore', '021-111-729-526', 'info@saylaniwelfare.com', ARRAY['Daily langar','Ration bags'], ARRAY['CRITICAL','MODERATE','LOW'], 'Mon-Sun 8am-10pm', true, true),

-- Akhuwat Foundation (Lahore, Islamabad)
('Akhuwat Foundation', 'Lahore', 'Lahore', '19 Civic Centre, Township, Lahore', '042-35761999', 'info@akhuwat.org.pk', ARRAY['Food aid','Livelihood support'], ARRAY['MODERATE','LOW'], 'Mon-Fri 9am-5pm', true, true),
('Akhuwat Foundation', 'Islamabad', 'Islamabad', 'F-10 Markaz, Islamabad', '042-35761999', 'info@akhuwat.org.pk', ARRAY['Food aid','Livelihood support'], ARRAY['MODERATE','LOW'], 'Mon-Fri 9am-5pm', true, true),

-- Al-Khidmat Foundation (Nationwide — seeded across all 6 cities)
('Al-Khidmat Foundation', 'Karachi', 'Karachi', 'Al-Khidmat Complex, Gulshan-e-Iqbal, Karachi', '051-2650388', 'info@alkhidmat.org', ARRAY['Ration kits','Emergency relief'], ARRAY['CRITICAL','MODERATE','LOW'], 'Mon-Sat 9am-6pm', true, true),
('Al-Khidmat Foundation', 'Lahore', 'Lahore', 'Mansoorah, Multan Road, Lahore', '051-2650388', 'info@alkhidmat.org', ARRAY['Ration kits','Emergency relief'], ARRAY['CRITICAL','MODERATE','LOW'], 'Mon-Sat 9am-6pm', true, true),
('Al-Khidmat Foundation', 'Islamabad', 'Islamabad', 'G-9 Markaz, Islamabad', '051-2650388', 'info@alkhidmat.org', ARRAY['Ration kits','Emergency relief'], ARRAY['CRITICAL','MODERATE','LOW'], 'Mon-Sat 9am-6pm', true, true),
('Al-Khidmat Foundation', 'Peshawar', 'Peshawar', 'University Road, Peshawar', '051-2650388', 'info@alkhidmat.org', ARRAY['Ration kits','Emergency relief'], ARRAY['CRITICAL','MODERATE','LOW'], 'Mon-Sat 9am-6pm', true, true),
('Al-Khidmat Foundation', 'Quetta', 'Quetta', 'Jinnah Road, Quetta', '051-2650388', 'info@alkhidmat.org', ARRAY['Ration kits','Emergency relief'], ARRAY['CRITICAL','MODERATE','LOW'], 'Mon-Sat 9am-6pm', true, true),
('Al-Khidmat Foundation', 'Multan', 'Multan', 'Bosan Road, Multan', '051-2650388', 'info@alkhidmat.org', ARRAY['Ration kits','Emergency relief'], ARRAY['CRITICAL','MODERATE','LOW'], 'Mon-Sat 9am-6pm', true, true),

-- Rizq (Karachi)
('Rizq (Redistribution)', 'Karachi', 'Karachi South', 'Clifton, Karachi', '021-111-749-7', 'hello@rizq.pk', ARRAY['Food surplus redistribution'], ARRAY['MODERATE','LOW'], 'Mon-Sat 10am-7pm', true, true),

-- Zindagi Trust (Karachi)
('Zindagi Trust', 'Karachi', 'Karachi', 'Garden East, Karachi', '021-34321984', 'info@zindagitrust.org', ARRAY['Community kitchens','Child nutrition'], ARRAY['CRITICAL','MODERATE'], 'Mon-Sat 9am-5pm', true, true),

-- JDC Foundation (Karachi)
('JDC Foundation', 'Karachi', 'Karachi', 'Nazimabad, Karachi', '021-34146288', 'info@jdcwelfare.org', ARRAY['Ration bags','Ramzan food drives'], ARRAY['CRITICAL','MODERATE','LOW'], '24/7', true, true),

-- Government programs (nationwide — seeded across all 6 cities)
('Pakistan Bait-ul-Mal', 'Karachi', 'Karachi', 'PBM Regional Office, Karachi', '051-9245100', 'info@pbm.gov.pk', ARRAY['Food support','Financial assistance'], ARRAY['MODERATE','LOW'], 'Mon-Fri 9am-4pm', true, true),
('Pakistan Bait-ul-Mal', 'Lahore', 'Lahore', 'PBM Regional Office, Lahore', '051-9245100', 'info@pbm.gov.pk', ARRAY['Food support','Financial assistance'], ARRAY['MODERATE','LOW'], 'Mon-Fri 9am-4pm', true, true),
('Pakistan Bait-ul-Mal', 'Islamabad', 'Islamabad', 'PBM Head Office, Shaheed-e-Millat Secretariat, Islamabad', '051-9245100', 'info@pbm.gov.pk', ARRAY['Food support','Financial assistance'], ARRAY['MODERATE','LOW'], 'Mon-Fri 9am-4pm', true, true),
('Pakistan Bait-ul-Mal', 'Peshawar', 'Peshawar', 'PBM Regional Office, Peshawar', '051-9245100', 'info@pbm.gov.pk', ARRAY['Food support','Financial assistance'], ARRAY['MODERATE','LOW'], 'Mon-Fri 9am-4pm', true, true),
('Pakistan Bait-ul-Mal', 'Quetta', 'Quetta', 'PBM Regional Office, Quetta', '051-9245100', 'info@pbm.gov.pk', ARRAY['Food support','Financial assistance'], ARRAY['MODERATE','LOW'], 'Mon-Fri 9am-4pm', true, true),
('Pakistan Bait-ul-Mal', 'Multan', 'Multan', 'PBM Regional Office, Multan', '051-9245100', 'info@pbm.gov.pk', ARRAY['Food support','Financial assistance'], ARRAY['MODERATE','LOW'], 'Mon-Fri 9am-4pm', true, true),

('Benazir Income Support Programme (BISP)', 'Karachi', 'Karachi', 'BISP Divisional Office, Karachi', '0800-26477', 'info@bisp.gov.pk', ARRAY['Cash transfers','Nutrition support (Benazir Nashonuma)'], ARRAY['MODERATE','LOW'], 'Mon-Fri 9am-4pm', true, true),
('Benazir Income Support Programme (BISP)', 'Lahore', 'Lahore', 'BISP Divisional Office, Lahore', '0800-26477', 'info@bisp.gov.pk', ARRAY['Cash transfers','Nutrition support (Benazir Nashonuma)'], ARRAY['MODERATE','LOW'], 'Mon-Fri 9am-4pm', true, true),
('Benazir Income Support Programme (BISP)', 'Islamabad', 'Islamabad', 'BISP HQ, F Block, Pak Secretariat, Islamabad', '0800-26477', 'info@bisp.gov.pk', ARRAY['Cash transfers','Nutrition support (Benazir Nashonuma)'], ARRAY['MODERATE','LOW'], 'Mon-Fri 9am-4pm', true, true),
('Benazir Income Support Programme (BISP)', 'Peshawar', 'Peshawar', 'BISP Divisional Office, Peshawar', '0800-26477', 'info@bisp.gov.pk', ARRAY['Cash transfers','Nutrition support (Benazir Nashonuma)'], ARRAY['MODERATE','LOW'], 'Mon-Fri 9am-4pm', true, true),
('Benazir Income Support Programme (BISP)', 'Quetta', 'Quetta', 'BISP Divisional Office, Quetta', '0800-26477', 'info@bisp.gov.pk', ARRAY['Cash transfers','Nutrition support (Benazir Nashonuma)'], ARRAY['MODERATE','LOW'], 'Mon-Fri 9am-4pm', true, true),
('Benazir Income Support Programme (BISP)', 'Multan', 'Multan', 'BISP Divisional Office, Multan', '0800-26477', 'info@bisp.gov.pk', ARRAY['Cash transfers','Nutrition support (Benazir Nashonuma)'], ARRAY['MODERATE','LOW'], 'Mon-Fri 9am-4pm', true, true);
