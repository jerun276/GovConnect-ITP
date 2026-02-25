-- Seed statutory boards mapped to their parent departments
-- Uses explicit department UUIDs from the seed data

INSERT INTO statutory_boards (department_id, name)
SELECT d.id, v.name
FROM (
  VALUES
    -- Ministry of Agriculture (52e33d8e-2853-4c0c-9b3e-159591f5ed1b)
    ('52e33d8e-2853-4c0c-9b3e-159591f5ed1b', 'Agricultural and Agrarian Insurance Board'),
    ('52e33d8e-2853-4c0c-9b3e-159591f5ed1b', 'Hector Kobbekaduwa Agrarian Research and Training Institute'),
    ('52e33d8e-2853-4c0c-9b3e-159591f5ed1b', 'Coconut Research Institute of Sri Lanka'),
    ('52e33d8e-2853-4c0c-9b3e-159591f5ed1b', 'Rubber Research Institute of Sri Lanka'),
    ('52e33d8e-2853-4c0c-9b3e-159591f5ed1b', 'Sugarcane Research Institute of Sri Lanka'),
    ('52e33d8e-2853-4c0c-9b3e-159591f5ed1b', 'Sri Lanka Council for Agricultural Research Policy'),
    ('52e33d8e-2853-4c0c-9b3e-159591f5ed1b', 'Sri Lanka Cashew Corporation'),
    ('52e33d8e-2853-4c0c-9b3e-159591f5ed1b', 'Tea Small Holdings Development Authority'),
    ('52e33d8e-2853-4c0c-9b3e-159591f5ed1b', 'Sri Lanka Tea Board'),
    ('52e33d8e-2853-4c0c-9b3e-159591f5ed1b', 'Sri Lanka Tea Research Institute'),
    ('52e33d8e-2853-4c0c-9b3e-159591f5ed1b', 'Department of Export Agriculture'),

    -- Ministry of Child Development and Women`s Affairs (202241d4-2062-4e25-9b3a-a8cdf4bdf734)
    ('202241d4-2062-4e25-9b3a-a8cdf4bdf734', 'Children''s Secretariat'),
    ('202241d4-2062-4e25-9b3a-a8cdf4bdf734', 'Sri Lanka National Child Protection Authority'),
    ('202241d4-2062-4e25-9b3a-a8cdf4bdf734', 'Family Health Bureau'),
    ('202241d4-2062-4e25-9b3a-a8cdf4bdf734', 'De Zoysa Hospital for Women'),
    ('202241d4-2062-4e25-9b3a-a8cdf4bdf734', 'Castle Street Hospital for Women'),
    ('202241d4-2062-4e25-9b3a-a8cdf4bdf734', 'Lady Ridgeway Children''s Hospital'),

    -- Ministry of National Heritage Cultural Affairs (9adc997f-1cbe-43e4-99f5-a89c0f23d03c)
    ('9adc997f-1cbe-43e4-99f5-a89c0f23d03c', 'Central Cultural Fund'),
    ('9adc997f-1cbe-43e4-99f5-a89c0f23d03c', 'National Film Corporation'),
    ('9adc997f-1cbe-43e4-99f5-a89c0f23d03c', 'Tower Hall Theater Foundation'),
    ('9adc997f-1cbe-43e4-99f5-a89c0f23d03c', 'Sri Lanka National Book Development Council'),
    ('9adc997f-1cbe-43e4-99f5-a89c0f23d03c', 'Associated Newspapers of Ceylon Ltd'),

    -- Ministry of Defence and Urban Development (dacc07e9-844a-4773-9191-daed29570a08)
    ('dacc07e9-844a-4773-9191-daed29570a08', 'Urban Development Authority (UDA)'),
    ('dacc07e9-844a-4773-9191-daed29570a08', 'Urban Settlement Improvement Project'),
    ('dacc07e9-844a-4773-9191-daed29570a08', 'Housing Development and Finance Corporation (HDFC Bank)'),
    ('dacc07e9-844a-4773-9191-daed29570a08', 'National Housing Development Authority (NHDA)'),
    ('dacc07e9-844a-4773-9191-daed29570a08', 'Central Engineering Consultancy Bureau'),
    ('dacc07e9-844a-4773-9191-daed29570a08', 'State Development and Construction Corporation'),
    ('dacc07e9-844a-4773-9191-daed29570a08', 'State Engineering Corporation (SEC)'),
    ('dacc07e9-844a-4773-9191-daed29570a08', 'Institute for Construction Training and Development'),
    ('dacc07e9-844a-4773-9191-daed29570a08', 'Centre for Housing Planning and Building (CHPB)'),
    ('dacc07e9-844a-4773-9191-daed29570a08', 'Common Amenities Board (Condominium Management Authority)'),
    ('dacc07e9-844a-4773-9191-daed29570a08', 'Land Reclamation and Development Corporation'),
    ('dacc07e9-844a-4773-9191-daed29570a08', 'Sri Lanka Land Reclamation and Development Corporation'),
    ('dacc07e9-844a-4773-9191-daed29570a08', 'Sri Lanka Air force'),
    ('dacc07e9-844a-4773-9191-daed29570a08', 'Sri Lanka Army'),
    ('dacc07e9-844a-4773-9191-daed29570a08', 'Sri Lanka Police'),

    -- Ministry of Disaster Management (d35bebbd-baf9-4a32-a8aa-6ccea609d444)
    ('d35bebbd-baf9-4a32-a8aa-6ccea609d444', 'Disaster Management Centre'),
    ('d35bebbd-baf9-4a32-a8aa-6ccea609d444', 'Emergency Relief Unit'),

    -- Ministry of Education (d3398b51-6179-4f1a-bec6-94823bd0b00e)
    ('d3398b51-6179-4f1a-bec6-94823bd0b00e', 'Postgraduate Institute of Medicine-University of Colombo'),
    ('d3398b51-6179-4f1a-bec6-94823bd0b00e', 'Postgraduate Institute of Pali and Buddhist Studies'),
    ('d3398b51-6179-4f1a-bec6-94823bd0b00e', 'Postgraduate Institute of Science'),
    ('d3398b51-6179-4f1a-bec6-94823bd0b00e', 'Rajarata University of Sri Lanka'),
    ('d3398b51-6179-4f1a-bec6-94823bd0b00e', 'Ruhuna University'),
    ('d3398b51-6179-4f1a-bec6-94823bd0b00e', 'School of Medical Laboratory Technology'),
    ('d3398b51-6179-4f1a-bec6-94823bd0b00e', 'Sri Lanka Institute of Advanced Technological Education (SLIATE)'),
    ('d3398b51-6179-4f1a-bec6-94823bd0b00e', 'Tertiary and Vocational Education Commission (TVEC)'),
    ('d3398b51-6179-4f1a-bec6-94823bd0b00e', 'University Grants Commission - Sri Lanka'),
    ('d3398b51-6179-4f1a-bec6-94823bd0b00e', 'University of Colombo'),
    ('d3398b51-6179-4f1a-bec6-94823bd0b00e', 'University of Colombo School of Computing'),
    ('d3398b51-6179-4f1a-bec6-94823bd0b00e', 'University of Jaffna'),
    ('d3398b51-6179-4f1a-bec6-94823bd0b00e', 'University of Kelaniya'),
    ('d3398b51-6179-4f1a-bec6-94823bd0b00e', 'University of Moratuwa'),
    ('d3398b51-6179-4f1a-bec6-94823bd0b00e', 'University of Peradeniya'),
    ('d3398b51-6179-4f1a-bec6-94823bd0b00e', 'University of Sabaragamuwa'),
    ('d3398b51-6179-4f1a-bec6-94823bd0b00e', 'University of Sri Jayewardenepura'),
    ('d3398b51-6179-4f1a-bec6-94823bd0b00e', 'University of the Visual & Performing Arts'),
    ('d3398b51-6179-4f1a-bec6-94823bd0b00e', 'University of Wayaba'),
    ('d3398b51-6179-4f1a-bec6-94823bd0b00e', 'Uva Wellassa University'),
    ('d3398b51-6179-4f1a-bec6-94823bd0b00e', 'Buddhasravaka Bhiksu University'),
    ('d3398b51-6179-4f1a-bec6-94823bd0b00e', 'Buddhist and Pali University of Sri Lanka'),
    ('d3398b51-6179-4f1a-bec6-94823bd0b00e', 'Eastern University of Sri Lanka'),
    ('d3398b51-6179-4f1a-bec6-94823bd0b00e', 'Open University of Sri Lanka'),
    ('d3398b51-6179-4f1a-bec6-94823bd0b00e', 'Institute of Technology, University of Moratuwa'),
    ('d3398b51-6179-4f1a-bec6-94823bd0b00e', 'Institute of Colombo School of Computing'),
    ('d3398b51-6179-4f1a-bec6-94823bd0b00e', 'National Institute of Education (NIE)'),
    ('d3398b51-6179-4f1a-bec6-94823bd0b00e', 'National Institute of Technical Education'),
    ('d3398b51-6179-4f1a-bec6-94823bd0b00e', 'National Institute of Technical Education of Sri Lanka'),
    ('d3398b51-6179-4f1a-bec6-94823bd0b00e', 'Pirivena Education Board'),
    ('d3398b51-6179-4f1a-bec6-94823bd0b00e', 'Postgraduate Institute of Agriculture'),
    ('d3398b51-6179-4f1a-bec6-94823bd0b00e', 'Postgraduate Institute of Management'),
    ('d3398b51-6179-4f1a-bec6-94823bd0b00e', 'Mahapola Higher Education Scholarship Trust Fund'),
    ('d3398b51-6179-4f1a-bec6-94823bd0b00e', 'General Sir John Kotelawala Defence Academy'),
    ('d3398b51-6179-4f1a-bec6-94823bd0b00e', 'Department of Examinations'),
    ('d3398b51-6179-4f1a-bec6-94823bd0b00e', 'Department of Technical Education and Training'),

    -- Ministry of Enterprise Development and Investment Promotion (b7b7a324-f538-4a9a-be28-82a92aa20848)
    ('b7b7a324-f538-4a9a-be28-82a92aa20848', 'Public Enterprise Reforms Commission (PERC)'),
    ('b7b7a324-f538-4a9a-be28-82a92aa20848', 'Sri Lanka Investors Commission'),
    ('b7b7a324-f538-4a9a-be28-82a92aa20848', 'Strategic Enterprise Management Agency - SEMA'),
    ('b7b7a324-f538-4a9a-be28-82a92aa20848', 'Industrial Development Board'),
    ('b7b7a324-f538-4a9a-be28-82a92aa20848', 'Industrial Technology Institute (ITI)'),
    ('b7b7a324-f538-4a9a-be28-82a92aa20848', 'Information Technology Parks'),
    ('b7b7a324-f538-4a9a-be28-82a92aa20848', 'Ceylon Fisheries Corporation'),
    ('b7b7a324-f538-4a9a-be28-82a92aa20848', 'Lanka Electricity Company (Pvt) Ltd'),
    ('b7b7a324-f538-4a9a-be28-82a92aa20848', 'National Aquaculture Development Authority'),
    ('b7b7a324-f538-4a9a-be28-82a92aa20848', 'National Paper Company Ltd.'),
    ('b7b7a324-f538-4a9a-be28-82a92aa20848', 'State Pharmaceutical Corporation'),
    ('b7b7a324-f538-4a9a-be28-82a92aa20848', 'State Pharmaceutical Manufacturing Corporation'),
    ('b7b7a324-f538-4a9a-be28-82a92aa20848', 'State Printing Corporation'),
    ('b7b7a324-f538-4a9a-be28-82a92aa20848', 'State Timber Corporation'),
    ('b7b7a324-f538-4a9a-be28-82a92aa20848', 'Lanka Transformers Ltd'),
    ('b7b7a324-f538-4a9a-be28-82a92aa20848', 'Bogala Graphite Lanka Ltd'),
    ('b7b7a324-f538-4a9a-be28-82a92aa20848', 'Lanka Mineral Sands Co. Ltd.'),
    ('b7b7a324-f538-4a9a-be28-82a92aa20848', 'Mantai Salt Ltd.'),
    ('b7b7a324-f538-4a9a-be28-82a92aa20848', 'Kiriya/ Milk Industries of Lanka (Pvt.) Ltd.'),
    ('b7b7a324-f538-4a9a-be28-82a92aa20848', 'Milk Industries of Lanka (Pvt.) Ltd.'),
    ('b7b7a324-f538-4a9a-be28-82a92aa20848', 'Milk Industries of Lanka Company'),
    ('b7b7a324-f538-4a9a-be28-82a92aa20848', 'Ceylon Petroleum Corporation'),

    -- Ministry of Finance and Planning (ec3b052f-0565-4e68-b39d-2d4865efc3a7)
    ('ec3b052f-0565-4e68-b39d-2d4865efc3a7', 'Central Bank of Sri Lanka'),
    ('ec3b052f-0565-4e68-b39d-2d4865efc3a7', 'National Savings Bank'),
    ('ec3b052f-0565-4e68-b39d-2d4865efc3a7', 'State Mortgage and Investment Bank'),
    ('ec3b052f-0565-4e68-b39d-2d4865efc3a7', 'People''s Bank'),
    ('ec3b052f-0565-4e68-b39d-2d4865efc3a7', 'Credit Information Bureau'),
    ('ec3b052f-0565-4e68-b39d-2d4865efc3a7', 'Public Enterprise Reforms Commission (PERC)'),
    ('ec3b052f-0565-4e68-b39d-2d4865efc3a7', 'Welfare Benifits Board'),
    ('ec3b052f-0565-4e68-b39d-2d4865efc3a7', 'Srama Wasana Fund'),
    ('ec3b052f-0565-4e68-b39d-2d4865efc3a7', 'Employees Trust Fund'),
    ('ec3b052f-0565-4e68-b39d-2d4865efc3a7', 'Debt Conciliation Board'),
    ('ec3b052f-0565-4e68-b39d-2d4865efc3a7', 'National Procurement Agency'),
    ('ec3b052f-0565-4e68-b39d-2d4865efc3a7', 'Department of Valuation'),

    -- Ministry of Fisheries and Aquatic Resource Development (cc6a1e1a-12a1-4993-b229-cf2d5aff0049)
    ('cc6a1e1a-12a1-4993-b229-cf2d5aff0049', 'National Aquatic Resource Research & Development Agency (NARA)'),
    ('cc6a1e1a-12a1-4993-b229-cf2d5aff0049', 'Cey-Nor Foundation Limited'),
    ('cc6a1e1a-12a1-4993-b229-cf2d5aff0049', 'Ceylon Fisheries Corporation'),
    ('cc6a1e1a-12a1-4993-b229-cf2d5aff0049', 'National Aquaculture Development Authority'),
    ('cc6a1e1a-12a1-4993-b229-cf2d5aff0049', 'Oluvil Port and Eastern Harbours'),
    ('cc6a1e1a-12a1-4993-b229-cf2d5aff0049', 'Department of Fisheries and Aquatic Resources'),

    -- Ministry of Foreign Affairs (72e83b3d-2e62-41b5-993b-c4ea3aaef398)
    ('72e83b3d-2e62-41b5-993b-c4ea3aaef398', 'Sri Lanka High Commission New Delhi'),

    -- Ministry of Health (c813cdf4-0b69-4af1-95d6-b46025a9d8a1)
    ('c813cdf4-0b69-4af1-95d6-b46025a9d8a1', 'Angoda Mental Hospital'),
    ('c813cdf4-0b69-4af1-95d6-b46025a9d8a1', 'Ayurveda Teaching Hospital Borella'),
    ('c813cdf4-0b69-4af1-95d6-b46025a9d8a1', 'Bandaranaike Memorial Ayurvedic Research Institute'),
    ('c813cdf4-0b69-4af1-95d6-b46025a9d8a1', 'Cancer Hospital, Maharagama'),
    ('c813cdf4-0b69-4af1-95d6-b46025a9d8a1', 'Castle Street Hospital for Women'),
    ('c813cdf4-0b69-4af1-95d6-b46025a9d8a1', 'De Zoysa Hospital for Women'),
    ('c813cdf4-0b69-4af1-95d6-b46025a9d8a1', 'Karapitiya Teaching Hospital'),
    ('c813cdf4-0b69-4af1-95d6-b46025a9d8a1', 'Lady Ridgeway Children''s Hospital'),
    ('c813cdf4-0b69-4af1-95d6-b46025a9d8a1', 'Medical Research Institute, Colombo'),
    ('c813cdf4-0b69-4af1-95d6-b46025a9d8a1', 'National Institute of Health Science'),
    ('c813cdf4-0b69-4af1-95d6-b46025a9d8a1', 'Peradeniya Teaching Hospital'),
    ('c813cdf4-0b69-4af1-95d6-b46025a9d8a1', 'School of Medical Laboratory Technology'),
    ('c813cdf4-0b69-4af1-95d6-b46025a9d8a1', 'Sri Lanka Ayurvedic Drugs Corporation'),
    ('c813cdf4-0b69-4af1-95d6-b46025a9d8a1', 'Epidemiology Unit'),
    ('c813cdf4-0b69-4af1-95d6-b46025a9d8a1', 'Health Promotion Bureau'),

    -- Ministry of Highways (d22784d1-0b32-477f-be9f-78e6279d4286)
    ('d22784d1-0b32-477f-be9f-78e6279d4286', 'Road Development Authority'),
    ('d22784d1-0b32-477f-be9f-78e6279d4286', 'Sri Lanka Ports Authority'),
    ('d22784d1-0b32-477f-be9f-78e6279d4286', 'Oluvil Port and Eastern Harbours'),

    -- Ministry of Indigenous Medicine (f00a5d89-9b54-416e-89bf-54e51d3e9de0)
    ('f00a5d89-9b54-416e-89bf-54e51d3e9de0', 'Ayurveda Teaching Hospital Borella'),
    ('f00a5d89-9b54-416e-89bf-54e51d3e9de0', 'Bandaranaike Memorial Ayurvedic Research Institute'),
    ('f00a5d89-9b54-416e-89bf-54e51d3e9de0', 'Gampaha Wickramarachchi Ayurveda Institute'),
    ('f00a5d89-9b54-416e-89bf-54e51d3e9de0', 'Institute of Indigenous Medicine'),
    ('f00a5d89-9b54-416e-89bf-54e51d3e9de0', 'Sri Lanka Ayurvedic Drugs Corporation'),

    -- Ministry of Industries (aa57abbd-7f12-4e65-a417-cd33c8f28d0d)
    ('aa57abbd-7f12-4e65-a417-cd33c8f28d0d', 'Industrial Development Board'),
    ('aa57abbd-7f12-4e65-a417-cd33c8f28d0d', 'Industrial Technology Institute (ITI)'),
    ('aa57abbd-7f12-4e65-a417-cd33c8f28d0d', 'National Engineering, Research and Development Center (NERD)'),
    ('aa57abbd-7f12-4e65-a417-cd33c8f28d0d', 'Sri Lanka Standards Institute'),
    ('aa57abbd-7f12-4e65-a417-cd33c8f28d0d', 'State Engineering Corporation (SEC)'),
    ('aa57abbd-7f12-4e65-a417-cd33c8f28d0d', 'National Paper Company Ltd.'),

    -- Ministry of Justice (2c06fa9a-aa3f-4a75-933e-4b085dbdfa40)
    ('2c06fa9a-aa3f-4a75-933e-4b085dbdfa40', 'Law Commission of Sri Lanka'),
    ('2c06fa9a-aa3f-4a75-933e-4b085dbdfa40', 'Legal Aid Commission of Sri Lanka'),
    ('2c06fa9a-aa3f-4a75-933e-4b085dbdfa40', 'Registrar of the Supreme Court'),
    ('2c06fa9a-aa3f-4a75-933e-4b085dbdfa40', 'Mediation Boards Commission'),
    ('2c06fa9a-aa3f-4a75-933e-4b085dbdfa40', 'Debt Conciliation Board'),
    ('2c06fa9a-aa3f-4a75-933e-4b085dbdfa40', 'Commission to Investigate Allegation of Bribery or Corruption'),
    ('2c06fa9a-aa3f-4a75-933e-4b085dbdfa40', 'Public Trustee'),
    ('2c06fa9a-aa3f-4a75-933e-4b085dbdfa40', 'Registrar General''s Department'),
    ('2c06fa9a-aa3f-4a75-933e-4b085dbdfa40', 'Registrar of Companies'),
    ('2c06fa9a-aa3f-4a75-933e-4b085dbdfa40', 'Department of Public Trustee'),

    -- Ministry of Labour and Labour Relations (141ee36e-f940-43dd-aa02-e104920fa038)
    ('141ee36e-f940-43dd-aa02-e104920fa038', 'Employees Trust Fund'),
    ('141ee36e-f940-43dd-aa02-e104920fa038', 'Public Service Commission'),
    ('141ee36e-f940-43dd-aa02-e104920fa038', 'Co-operative Employees Commission'),
    ('141ee36e-f940-43dd-aa02-e104920fa038', 'Jobs Net Programme'),

    -- Ministry of Land and Land Development (fea4ce81-b1c4-4ea4-824c-0a430309a009)
    ('fea4ce81-b1c4-4ea4-824c-0a430309a009', 'Land Reform Commission'),
    ('fea4ce81-b1c4-4ea4-824c-0a430309a009', 'Land Reclamation and Development Corporation'),
    ('fea4ce81-b1c4-4ea4-824c-0a430309a009', 'Sri Lanka Land Reclamation and Development Corporation'),
    ('fea4ce81-b1c4-4ea4-824c-0a430309a009', 'Department of Land Settlement'),

    -- Ministry of Local Government and Provincial Councils (7eb25ca2-6e59-4096-b352-5dbdbc1d3bec)
    ('7eb25ca2-6e59-4096-b352-5dbdbc1d3bec', 'Colombo Municipal Council'),

    -- Ministry of Mass Media and Information (b9f3fb2d-e769-45f4-8ebb-2b41b7ab071e)
    ('b9f3fb2d-e769-45f4-8ebb-2b41b7ab071e', 'Independent Television Network'),
    ('b9f3fb2d-e769-45f4-8ebb-2b41b7ab071e', 'Sri Lanka Broadcasting Corporation (National Radio)'),
    ('b9f3fb2d-e769-45f4-8ebb-2b41b7ab071e', 'Selacine Rupavahini Institute'),
    ('b9f3fb2d-e769-45f4-8ebb-2b41b7ab071e', 'Government Information Centre'),
    ('b9f3fb2d-e769-45f4-8ebb-2b41b7ab071e', 'Associated Newspapers of Ceylon Ltd'),
    ('b9f3fb2d-e769-45f4-8ebb-2b41b7ab071e', 'National Film Corporation'),
    ('b9f3fb2d-e769-45f4-8ebb-2b41b7ab071e', 'Sri Lanka Press Council'),

    -- Ministry of Petroleum Industries (2d162127-173f-42a7-bd7f-e3ce5f627824)
    ('2d162127-173f-42a7-bd7f-e3ce5f627824', 'Ceylon Petroleum Corporation'),
    ('2d162127-173f-42a7-bd7f-e3ce5f627824', 'Petroleum Resources Development Company'),

    -- Ministry of Plantation Industries (5cfd0508-9bbf-44ae-9b17-cb4866032368)
    ('5cfd0508-9bbf-44ae-9b17-cb4866032368', 'Coconut Research Institute of Sri Lanka'),
    ('5cfd0508-9bbf-44ae-9b17-cb4866032368', 'Rubber Research Institute of Sri Lanka'),
    ('5cfd0508-9bbf-44ae-9b17-cb4866032368', 'Sugarcane Research Institute of Sri Lanka'),
    ('5cfd0508-9bbf-44ae-9b17-cb4866032368', 'Sri Lanka Tea Board'),
    ('5cfd0508-9bbf-44ae-9b17-cb4866032368', 'Sri Lanka Tea Research Institute'),
    ('5cfd0508-9bbf-44ae-9b17-cb4866032368', 'Tea Small Holdings Development Authority'),
    ('5cfd0508-9bbf-44ae-9b17-cb4866032368', 'National Institute of Plantation Management'),

    -- Ministry of Postal Services (853bace6-b0e1-420e-827a-5931227f4b5e)
    ('853bace6-b0e1-420e-827a-5931227f4b5e', 'Sri Lanka Post'),

    -- Ministry of Power and Energy (ba54369c-d2db-41e8-8342-c91619946872)
    ('ba54369c-d2db-41e8-8342-c91619946872', 'Lanka Electricity Company'),
    ('ba54369c-d2db-41e8-8342-c91619946872', 'Lanka Electricity Company (Pvt) Ltd'),
    ('ba54369c-d2db-41e8-8342-c91619946872', 'Ceylon Electricity Board'),
    ('ba54369c-d2db-41e8-8342-c91619946872', 'Public Utilities Commission of Sri Lanka'),
    ('ba54369c-d2db-41e8-8342-c91619946872', 'Energy Conservation Fund'),
    ('ba54369c-d2db-41e8-8342-c91619946872', 'Sri Lanka Sustainable Energy Authority'),

    -- Ministry of Public Administration and Home Affairs (308a2d07-abeb-4da1-885b-f7150eae3ec8)
    ('308a2d07-abeb-4da1-885b-f7150eae3ec8', 'Public Service Commission'),
    ('308a2d07-abeb-4da1-885b-f7150eae3ec8', 'Public Service Training Institute'),
    ('308a2d07-abeb-4da1-885b-f7150eae3ec8', 'Sri Lanka Institute of Development Administration (SLIDA)'),
    ('308a2d07-abeb-4da1-885b-f7150eae3ec8', 'Official Languages Commission'),
    ('308a2d07-abeb-4da1-885b-f7150eae3ec8', 'Department of Official Languages'),

    -- Ministry of Religious Affairs and Moral Upliftment (91d6f91d-bbfa-4420-a11a-a73d1d575926)
    ('91d6f91d-bbfa-4420-a11a-a73d1d575926', 'Department of Buddhist Affairs'),
    ('91d6f91d-bbfa-4420-a11a-a73d1d575926', 'Department of Hindu Affairs'),

    -- Ministry of Sport (34e93306-0411-48b0-a52d-3b23b64603db)
    ('34e93306-0411-48b0-a52d-3b23b64603db', 'The Sugathadasa National Sports Complex Authority'),
    ('34e93306-0411-48b0-a52d-3b23b64603db', 'National Institute of Sports Science'),

    -- Ministry of State Resources and Enterprise Development (25b60b34-33e9-46d6-83f1-c816bf5b089a)
    ('25b60b34-33e9-46d6-83f1-c816bf5b089a', 'Public Enterprise Reforms Commission (PERC)'),
    ('25b60b34-33e9-46d6-83f1-c816bf5b089a', 'Strategic Enterprise Management Agency - SEMA'),
    ('25b60b34-33e9-46d6-83f1-c816bf5b089a', 'State Development and Construction Corporation'),
    ('25b60b34-33e9-46d6-83f1-c816bf5b089a', 'State Engineering Corporation (SEC)'),
    ('25b60b34-33e9-46d6-83f1-c816bf5b089a', 'State Mortgage and Investment Bank'),
    ('25b60b34-33e9-46d6-83f1-c816bf5b089a', 'State Pharmaceutical Corporation'),
    ('25b60b34-33e9-46d6-83f1-c816bf5b089a', 'State Pharmaceutical Manufacturing Corporation'),
    ('25b60b34-33e9-46d6-83f1-c816bf5b089a', 'State Printing Corporation'),
    ('25b60b34-33e9-46d6-83f1-c816bf5b089a', 'State Timber Corporation'),
    ('25b60b34-33e9-46d6-83f1-c816bf5b089a', 'Lanka General Trading Company'),
    ('25b60b34-33e9-46d6-83f1-c816bf5b089a', 'Lanka Salu Sala Limited'),

    -- Ministry of Technology, Research and Atomic Energy (4d08ecf5-0041-4f33-8325-c8e5ad2c1698)
    ('4d08ecf5-0041-4f33-8325-c8e5ad2c1698', 'Arthur C Clark Center for Modern Technologies'),
    ('4d08ecf5-0041-4f33-8325-c8e5ad2c1698', 'Institute of Fundamental Studies'),
    ('4d08ecf5-0041-4f33-8325-c8e5ad2c1698', 'Institute of Molecular Biology and Biotechnology'),
    ('4d08ecf5-0041-4f33-8325-c8e5ad2c1698', 'National Science and Technology Commission'),
    ('4d08ecf5-0041-4f33-8325-c8e5ad2c1698', 'National Science Foundation'),
    ('4d08ecf5-0041-4f33-8325-c8e5ad2c1698', 'Information and Communication Technology Agency of Sri Lanka'),
    ('4d08ecf5-0041-4f33-8325-c8e5ad2c1698', 'Sri Lanka Planetarium'),

    -- Ministry of Textile Industry Development (5b8f9def-35b0-48e5-ac8e-87492d43620f)
    ('5b8f9def-35b0-48e5-ac8e-87492d43620f', 'Textile Quota Board'),

    -- Ministry of Tourism (c74e015c-b1ab-4636-ae84-8fbff6ac5137)
    ('c74e015c-b1ab-4636-ae84-8fbff6ac5137', 'Sri Lanka Convention Bureau'),
    ('c74e015c-b1ab-4636-ae84-8fbff6ac5137', 'Sri Lanka Tourist Board'),
    ('c74e015c-b1ab-4636-ae84-8fbff6ac5137', 'Sri Lanka Tourism Development Authority'),
    ('c74e015c-b1ab-4636-ae84-8fbff6ac5137', 'Sri Lanka Tourism'),

    -- Ministry of Trade, Commerce, Food security and Co-operative Development (fbd2f5c8-2cdc-4a6a-9b72-19b56c895d14)
    ('fbd2f5c8-2cdc-4a6a-9b72-19b56c895d14', 'Consumer Affairs Authority'),
    ('fbd2f5c8-2cdc-4a6a-9b72-19b56c895d14', 'Co-operative Wholesale Establishment'),
    ('fbd2f5c8-2cdc-4a6a-9b72-19b56c895d14', 'National Institute of Co-operative Development'),
    ('fbd2f5c8-2cdc-4a6a-9b72-19b56c895d14', 'Department of Commerce'),

    -- Ministry of Traditional Industries Small Enterprises Development (d7586520-72d7-4f69-be6f-d11051398687)
    ('d7586520-72d7-4f69-be6f-d11051398687', 'Gem and Jewellery Research and Training Institute'),
    ('d7586520-72d7-4f69-be6f-d11051398687', 'National Gem and Jewelery Authority'),

    -- Ministry of Transport (446ab670-f8e5-46fe-af37-f982a7eb9283)
    ('446ab670-f8e5-46fe-af37-f982a7eb9283', 'Sri Lanka Transport Board'),
    ('446ab670-f8e5-46fe-af37-f982a7eb9283', 'Sri Lankan Airlines Ltd'),
    ('446ab670-f8e5-46fe-af37-f982a7eb9283', 'National Transport Commission'),
    ('446ab670-f8e5-46fe-af37-f982a7eb9283', 'National Transport Medical Institute'),
    ('446ab670-f8e5-46fe-af37-f982a7eb9283', 'Road Development Authority'),
    ('446ab670-f8e5-46fe-af37-f982a7eb9283', 'Sri Lanka Railways'),
    ('446ab670-f8e5-46fe-af37-f982a7eb9283', 'Department of Motor Traffic'),
    ('446ab670-f8e5-46fe-af37-f982a7eb9283', 'Department of Railways'),
    ('446ab670-f8e5-46fe-af37-f982a7eb9283', 'Civil Aviation Authority of Sri Lanka'),
    ('446ab670-f8e5-46fe-af37-f982a7eb9283', 'Airport and Aviation Services (Sri Lanka) Ltd'),
    ('446ab670-f8e5-46fe-af37-f982a7eb9283', 'Ceylon Shipping Corporation Ltd.'),

    -- Ministry of Youth Affairs Skills Development (60740e4f-b792-4c01-94a5-9ee6ec7d9bcb)
    ('60740e4f-b792-4c01-94a5-9ee6ec7d9bcb', 'Public Service Training Institute'),
    ('60740e4f-b792-4c01-94a5-9ee6ec7d9bcb', 'Ceylon-German Technical Training Institute'),
    ('60740e4f-b792-4c01-94a5-9ee6ec7d9bcb', 'Vocational Training Authority'),
    ('60740e4f-b792-4c01-94a5-9ee6ec7d9bcb', 'Youth Corps'),
    ('60740e4f-b792-4c01-94a5-9ee6ec7d9bcb', 'National Youth Services Council'),
    ('60740e4f-b792-4c01-94a5-9ee6ec7d9bcb', 'The Youth Welfare Fund'),
    ('60740e4f-b792-4c01-94a5-9ee6ec7d9bcb', 'National Youth Awards Authority'),

    -- Ministry of Water Supply and Drainage (a46198fe-f74c-4a5c-b837-1f5992848ba0)
    ('a46198fe-f74c-4a5c-b837-1f5992848ba0', 'National Water supply and Drainage Board (NWSDB)'),
    ('a46198fe-f74c-4a5c-b837-1f5992848ba0', 'Water Resources Board'),

    -- Ministry of Women, Child Affairs & Social Empowerment (823675c4-2117-4632-b672-19042289d8e0)
    ('823675c4-2117-4632-b672-19042289d8e0', 'Children''s Secretariat'),
    ('823675c4-2117-4632-b672-19042289d8e0', 'Sri Lanka National Child Protection Authority'),
    ('823675c4-2117-4632-b672-19042289d8e0', 'Family Health Bureau'),
    ('823675c4-2117-4632-b672-19042289d8e0', 'De Zoysa Hospital for Women'),
    ('823675c4-2117-4632-b672-19042289d8e0', 'Castle Street Hospital for Women'),
    ('823675c4-2117-4632-b672-19042289d8e0', 'Lady Ridgeway Children''s Hospital'),

    -- Other departments with statutory boards
    -- Department of Wildlife Conservation (d06147f8-fe20-4ec9-b2f1-b29b60135a3f)
    ('d06147f8-fe20-4ec9-b2f1-b29b60135a3f', 'Department of Wildlife Conservation'),

    -- Department of National Botanic Gardens (bacbc57c-8ebd-4ab0-93cb-06586ed31193)
    ('bacbc57c-8ebd-4ab0-93cb-06586ed31193', 'Department of National Botanic Gardens'),

    -- Geological Survey and Mines Bureau (e00121aa-19fd-484f-84f5-0fe86e108791)
    ('e00121aa-19fd-484f-84f5-0fe86e108791', 'Geological Survey and Mines Bureau'),

    -- National Secretariat for Non-governmental Organizations (e899d318-637a-4bb7-bbae-1b17fcc64e37)
    ('e899d318-637a-4bb7-bbae-1b17fcc64e37', 'National Secretariat for Non-governmental Organizations'),

    -- Survey Department (db55bc43-2c3f-4c2f-a6d2-ab27b19b25d9)
    ('db55bc43-2c3f-4c2f-a6d2-ab27b19b25d9', 'Survey Department'),

    -- Mahaweli Authority of Sri Lanka (7fe33bdf-4119-47d7-addb-2d6363f771f2)
    ('7fe33bdf-4119-47d7-addb-2d6363f771f2', 'Mahaweli Authority of Sri Lanka'),

    -- Commission to Investigate Allegations of Bribe (9dc2540f-c0d0-452a-9a14-02ddd9d8208e)
    ('9dc2540f-c0d0-452a-9a14-02ddd9d8208e', 'Commission to Investigate Allegations of Bribe'),

    -- eProcurement (ddc83f07-be1f-4c44-8213-b0d8d603c8e1)
    ('ddc83f07-be1f-4c44-8213-b0d8d603c8e1', 'eProcurement'),

    -- Colombo Stock Exchange (cf6f5357-f753-4c2a-8efd-13380dfd865d)
    ('cf6f5357-f753-4c2a-8efd-13380dfd865d', 'Colombo Stock Exchange'),

    -- The Parliament (fa7d07cd-2c67-4cd0-b41a-af23a8d8ff5e)
    ('fa7d07cd-2c67-4cd0-b41a-af23a8d8ff5e', 'The Parliament'),

    -- Registrar General's Department (e78df904-fc4e-456d-8dd6-edfc101c9a63)
    ('e78df904-fc4e-456d-8dd6-edfc101c9a63', 'Registrar General''s Department'),

    -- Registrar of Companies (459d634d-aada-4c83-973b-14e39a5f3afb)
    ('459d634d-aada-4c83-973b-14e39a5f3afb', 'Registrar of Companies')
) AS v(dept_id, name)
JOIN departments d ON d.id = v.dept_id::UUID
WHERE NOT EXISTS (
  SELECT 1
  FROM statutory_boards sb
  WHERE lower(sb.name) = lower(v.name)
);
