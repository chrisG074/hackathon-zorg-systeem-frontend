-- Verwijder bestaande data (optioneel, voor een schone start)
-- DELETE FROM Meldingen;

INSERT INTO Meldingen (Type, Categorie, Beschrijving, Betrokkene, Datum, Locatie, IsSpoed, Letsel, BehoefteAanGesprek, Oplossing)
VALUES 
-- Facilitair
('Facilitair', 'Kapotte verlichting', 'De tl-buis in de pantry knippert constant. Erg hinderlijk tijdens de overdracht.', 'Pantry Teamkamer', '2026-04-01 08:30:00', 'Vleugel A, Begane grond', 0, NULL, NULL, NULL),
('Facilitair', 'ICT & apparatuur', 'De gedeelde tablet voor de zorgregistratie start niet meer op. Scherm blijft zwart.', 'Teamtablet 04', '2026-04-01 10:15:00', 'Zorgpost 1', 1, NULL, NULL, 'Reserve tablet in gebruik genomen.'),

-- MIC (Melding Incident Cliënt)
('MIC', 'Valincident', 'Cliënt is uitgegleden in de badkamer tijdens het wassen. Gevallen op de rechterheup.', 'Dhr. de Wit', '2026-03-31 14:00:00', 'Kamer 102', 0, 'Lichte schaafwond', 1, 'Huisarts heeft cliënt nagekeken, geen breuken.'),
('MIC', 'Medicatiefout', 'Verkeerde dosering bloeddrukverlagers klaargelegd in de weekbox.', 'Mevr. Janssen', '2026-03-31 09:00:00', 'Kamer 205', 1, 'Geen', 0, 'Direct gecorrigeerd door de verpleegkundige.'),

-- MIM (Melding Incident Medewerker)
('MIM', 'Verbale agressie', 'Tijdens de verzorging werd de medewerker uitgescholden en bedreigd door een bezoeker.', 'Zorgmedewerker Pietersen', '2026-04-01 11:30:00', 'Huiskamer West', 0, 'Psychische impact', 1, 'Gesprek met leidinggevende ingepland.'),
('MIM', 'Prik-spat of snij incidenten', 'Medewerker heeft zich geprikt aan een gebruikte naald tijdens het opruimen.', 'Verpleegkundige Bakhuizen', '2026-03-31 16:45:00', 'Kamer 110', 1, 'Prikaccident', 1, 'Protocol prikaccidenten opgestart, bloedonderzoek loopt.');