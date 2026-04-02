INSERT INTO Meldingen (Type, Categorie, Beschrijving, Betrokkene, Datum, Locatie, IsSpoed, Letsel, BehoefteAanGesprek, Oplossing)
VALUES 
-- Facilitair (7 meldingen)
('Facilitair', 'Kapotte verlichting', 'De tl-buis in de pantry knippert constant. Erg hinderlijk tijdens de overdracht.', 'Pantry Teamkamer', '2026-04-02 08:30:00', 'Vleugel A, Begane grond', 0, NULL, NULL, NULL),
('Facilitair', 'ICT & apparatuur', 'De gedeelde tablet voor de zorgregistratie start niet meer op. Scherm blijft zwart.', 'Teamtablet 04', '2026-04-01 10:15:00', 'Zorgpost 1', 1, NULL, NULL, 'Reserve tablet in gebruik genomen.'),
('Facilitair', 'Sanitair', 'Het toilet op de gang van de tweede verdieping is verstopt en stroomt bijna over.', 'Bezoekers toilet', '2026-04-01 14:20:00', 'Verdieping 2', 1, NULL, NULL, 'Technische dienst heeft het ontstopt.'),
('Facilitair', 'Klimaatbeheersing', 'De verwarming in de huiskamer slaat niet aan, het is er 16 graden.', 'Bewoners Huiskamer', '2026-03-31 07:45:00', 'Vleugel C', 0, NULL, NULL, NULL),
('Facilitair', 'Meubilair', 'Het linker bedhek van het hoog-laag bed weigert te vergrendelen.', 'Dhr. van Dijk', '2026-03-30 19:10:00', 'Kamer 112', 1, NULL, NULL, 'Tijdelijk ander bed geplaatst, bed is naar werkplaats.'),
('Facilitair', 'Toegangsbeheer', 'De deur van de medicatieruimte reageert niet op de druppel van de avonddienst.', 'Medicatieruimte', '2026-03-29 22:15:00', 'Zorgpost 2', 1, NULL, NULL, 'Systeem herstart door beheerder.'),
('Facilitair', 'Keukenapparatuur', 'De koelkast op de afdeling sluit niet meer goed af, rubbers zijn versleten.', 'Afdelingskeuken', '2026-03-28 11:00:00', 'Vleugel B', 0, NULL, NULL, 'Nieuwe rubbers besteld via inkoop.'),

-- MIC: Melding Incident Cliënt (7 meldingen)
('MIC', 'Valincident', 'Cliënt is uitgegleden in de badkamer tijdens het wassen. Gevallen op de rechterheup.', 'Dhr. de Wit', '2026-04-01 14:00:00', 'Kamer 102', 0, 'Lichte schaafwond', 1, 'Huisarts heeft cliënt nagekeken, geen breuken.'),
('MIC', 'Medicatiefout', 'Verkeerde dosering bloeddrukverlagers klaargelegd in de weekbox.', 'Mevr. Janssen', '2026-04-01 09:00:00', 'Kamer 205', 1, 'Geen', 0, 'Direct gecorrigeerd door de verpleegkundige.'),
('MIC', 'Dwaalgedrag', 'Cliënt was ongemerkt de afdeling afgelopen en werd gevonden in de binnentuin.', 'Dhr. Visser', '2026-03-31 16:30:00', 'Binnentuin', 1, 'Geen', 1, 'Deursensoren nagekeken en actiever toezicht ingesteld.'),
('MIC', 'Agressie', 'Cliënt werd erg onrustig tijdens de maaltijd en gooide een beker hete thee naar de verzorgende.', 'Mevr. de Jong', '2026-03-30 12:45:00', 'Eetzaal', 0, 'Geen', 1, 'Cliënt gekalmeerd op eigen kamer. Gesprek volgt.'),
('MIC', 'Verslikking', 'Cliënt verslikte zich ernstig in een stuk fruit. Heimlichgreep was niet nodig, maar wel paniek.', 'Dhr. Bakker', '2026-03-29 15:20:00', 'Huiskamer', 1, 'Geen', 0, 'Logopedist ingeschakeld voor slikadvies.'),
('MIC', 'Huidletsel', 'Bij het steunkousen uittrekken is een flinke huidlaesie (skin tear) ontstaan.', 'Mevr. Smit', '2026-03-28 20:30:00', 'Kamer 301', 0, 'Huidletsel (skin tear)', 0, 'Verbonden volgens wondzorg protocol.'),
('MIC', 'Foutieve voeding', 'Cliënt kreeg reguliere melk aangeboden ondanks bekende lactose-intolerantie.', 'Dhr. Peters', '2026-03-27 08:15:00', 'Eetzaal', 0, 'Buikklachten', 1, 'Extra notitie gemaakt in het voedingssysteem.'),

-- MIM: Melding Incident Medewerker (6 meldingen)
('MIM', 'Verbale agressie', 'Tijdens de verzorging werd de medewerker uitgescholden en bedreigd door een bezoeker.', 'Zorgmedewerker Pietersen', '2026-04-02 11:30:00', 'Huiskamer West', 0, 'Psychische impact', 1, 'Gesprek met leidinggevende ingepland.'),
('MIM', 'Prik-spat of snij incidenten', 'Medewerker heeft zich geprikt aan een gebruikte naald tijdens het opruimen.', 'Verpleegkundige Bakhuizen', '2026-04-01 16:45:00', 'Kamer 110', 1, 'Prikaccident', 1, 'Protocol prikaccidenten opgestart, bloedonderzoek loopt.'),
('MIM', 'Fysieke belasting', 'Tijdens het omhoog helpen van een cliënt in bed is het in de rug geschoten.', 'Verzorgende IG Klaassen', '2026-03-31 09:15:00', 'Kamer 105', 0, 'Rugpijn', 1, 'Fysiotherapie via werkgever aangeboden gekregen.'),
('MIM', 'Struikelen/Vallen', 'Uitgegleden over een natte vloer in de gang waar geen waarschuwingsbordje stond.', 'Helpende Willems', '2026-03-30 13:20:00', 'Gang Vleugel B', 0, 'Gekneusde knie', 0, 'Schoonmaak aangesproken op het plaatsen van bordjes.'),
('MIM', 'Werkdruk', 'Door ziekmeldingen alleen gestaan op een groep van 12 zware zorgvragers. Pauze overgeslagen.', 'Verpleegkundige Hendriks', '2026-03-29 14:00:00', 'Afdeling PG', 0, 'Vermoeidheid/Stress', 1, 'Evaluatie met de planner gepland.'),
('MIM', 'Verkeersincident', 'Tijdens een thuiszorgroute lichte blikschade gereden met de leaseauto van de zaak.', 'Wijkverpleegkundige de Boer', '2026-03-27 10:45:00', 'Parkeerplaats wijkcentrum', 0, 'Geen', 0, 'Schadeformulier ingevuld en ingeleverd bij beheer.');