-- Voeg 6 dummy meldingen toe aan de SoftZorgDb database
INSERT INTO Meldingen (Type, Categorie, Beschrijving, Betrokkene, Datum, Locatie, IsSpoed, Letsel, BehoefteAanGesprek, Oplossing)
VALUES 
-- 1. Facilitair (Standaard)
('Facilitair', 'Kapot bed', 'Het bed op kamer 104 gaat niet meer omhoog na het indrukken van de afstandsbediening. Motor maakt wel geluid.', 'Kamer 104', '2026-03-31 08:30:00', 'Kamer 104', 0, NULL, NULL, NULL),

-- 2. Facilitair (Spoed)
('Facilitair', 'Lekkage', 'Grote waterlekkage vanuit het plafond in de gang op de 2e verdieping. Water loopt richting de meterkast.', '2e Verdieping Gang', '2026-03-31 11:15:00', 'Gang 2e verdieping', 1, NULL, NULL, NULL),

-- 3. MIC (Valincident via SOEP)
('MIC', 'Valincident', 'S: Cliënt gaf aan duizelig te zijn na het opstaan. O: Gevallen naast het bed op de linkerzij. E: Val met licht letsel tot gevolg. P: Huisarts ingelicht en bedhekken tijdelijk omhoog gezet ter preventie.', 'Mevr. de Vries', '2026-03-30 14:15:00', 'Slaapkamer 201', NULL, 'Blauwe plek op linkerheup', NULL, 'Huisarts gebeld, familie is in kennis gesteld.'),

-- 4. MIC (Medicatiefout)
('MIC', 'Medicatie', 'S: Cliënt merkte op dat de pil een andere kleur had. O: Verkeerde dosering paracetamol klaargelegd (1000mg ipv 500mg), nog NIET ingenomen. E: Fout ontdekt voor inname. P: Medicatie direct gecorrigeerd.', 'Dhr. Jansen', '2026-03-31 10:05:00', 'Kamer 112', NULL, 'Geen', NULL, 'Extra controle ingebouwd bij medicatieronde.'),

-- 5. MIM (Verbaal agressief)
('MIM', 'Agressie verbaal', 'Bewoner werd plotseling erg boos, begon te schreeuwen en te schelden tegen mij toen de medicatie werd aangeboden.', 'Dhr. Pietersen', '2026-03-29 09:00:00', 'Gezamenlijke huiskamer', NULL, 'Geen', 1, 'In overleg met teamleider gegaan.'),

-- 6. MIM (Prikaccident)
('MIM', 'Prik, spat of snij incident', 'Geprikt aan een open insulinennaald tijdens het opruimen van het nachtkastje van de cliënt.', 'Iris van Lies', '2026-03-28 16:45:00', 'Kamer 108', NULL, 'Prikwond rechter wijsvinger', 1, 'Protocol prikaccidenten gevolgd, bloed afgenomen in ziekenhuis.')
;