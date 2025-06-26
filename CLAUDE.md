# MindDumper App - Claude Development Notes

## Project Status: COMPLETE ✅

Het MindDumper project is succesvol afgerond met alle gevraagde functionaliteiten geïmplementeerd.

## Belangrijke Opdrachten

### Ontwikkeling Commando's
```bash
# Ontwikkelserver starten
npm run dev

# Productie build maken
npm run build

# Linting
npm run lint

# Type checking  
npm run typecheck
```

### 🚨 VERPLICHTE WORKFLOW VOOR CODE WIJZIGINGEN

**BELANGRIJK: Vercel heeft een limiet van deploys per dag. Elke gefaalde build verspilt deze kostbare deploy quota.**

**ALTIJD DEZE STAPPEN VOLGEN VOOR ELKE GIT COMMIT:**

1. **Lokaal builden en testen**:
   ```bash
   npm run build
   ```
   
2. **Alleen committen als build succesvol is**:
   - Geen TypeScript errors
   - Geen ESLint errors  
   - Geen compilation failures
   
3. **Dan pas naar Git**:
   ```bash
   git add .
   git commit -m "beschrijving"
   git push
   ```

**NOOIT direct naar Git pushen zonder lokale build check!**

Dit voorkomt:
- Verspilde deploy quota
- Gefaalde production builds
- Tijdverlies door debug cycles
- Frustratie bij gebruiker

### Database Beheer
- Admin interface: `/admin` - Voor het toevoegen van categorieën en triggerwoorden
- Reorganisatie: `/admin/reorganize` - Voor het verplaatsen van subcategorieën tussen hoofdcategorieën
- Backup systeem ingebouwd voor export/import van gestructureerde data

## Recente Wijzigingen

### Interface Verbreding (Laatste Update)
- Hoofdcontainer vergroot van 500px naar 800px voor betere accommodatie van lange woorden
- Triggerwoord display verbeterd:
  - Font size verhoogd van 2.5rem naar 2.8rem
  - Padding verhoogd voor betere leesbaarheid
  - Minimale breedte verhoogd van 250px naar 350px
  - Lange woorden (>12 karakters) krijgen 2.2rem i.p.v. 1.8rem
- Responsieve breakpoints toegevoegd voor 1024px (tablet/desktop)
- Verbeterde mobile responsiveness

### Hiërarchische Structuur
- Volledig werkende hiërarchie: Hoofdcategorie → Subcategorie → Triggerwoorden
- Configuratiescherm toont volledige boomstructuur met checkboxes op alle niveaus
- Mind dump scherm toont hiërarchie tijdens sessie
- Logische volgorde: Professioneel categorieën eerst, daarna Persoonlijk

### Backup & Restore Functionaliteit
- JSON export van volledige categoriestructuur
- Import functie die bestaande data vervangt
- Versioning en metadata voor compatibiliteit

## Gebruikersfeedback Verwerkt

### Problemen Opgelost
1. ✅ Random woordvolgorde → Logische volgorde (Professioneel eerst)
2. ✅ Ontbrekende hoofdcategorieën → Volledige hiërarchie zichtbaar
3. ✅ Lange woorden breken layout → Responsieve typography + bredere interface
4. ✅ Verkeerde categorisering → Admin tools voor handmatige controle
5. ✅ Risico op dataverlies → Backup/restore functionaliteit

### Belangrijke Gebruikerseisen
- "Jij moet zoveel mogelijk doen" → Volledige automatisering waar mogelijk
- "Geen instructies via md files" → Directe communicatie en implementatie
- Behoud van bestaande Nederlandse triggerwoorden structuur
- Prioriteit op Professioneel → Persoonlijk volgorde

## Technische Details

### Architectuur
- **Frontend**: Next.js 15 met TypeScript, App Router
- **Database**: Supabase PostgreSQL met Row Level Security
- **Deployment**: Vercel met automatische GitHub integratie
- **Styling**: Pure CSS met responsieve design

### Database Schema
```sql
trigger_words:
  - id, language, word, category (format: "MainCategory|SubCategory")
  - is_active, created_at
  - Indexes op language en is_active voor performance

brain_dumps:
  - user_id, language, ideas[], metadata
  - Opslag van sessie resultaten
```

### Bestandsstructuur
```
/src/app/
  ├── app/page.tsx          # Hoofdapplicatie (brain dump interface)
  ├── app.css               # Styling voor app interface
  ├── admin/page.tsx        # Admin interface voor categoriebeheer
  ├── admin/reorganize/     # Interface voor category reorganisatie
  └── api/admin/            # Backend API routes

/src/lib/
  ├── database.ts           # Database queries en fallbacks
  └── supabase.ts          # Supabase client configuratie
```

## Deployment

### Vercel Configuratie
- Automatische deployments bij GitHub push
- Environment variables geconfigureerd voor Supabase
- Custom build commando's voor optimale performance

### Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Gebruiksaanwijzing

### Voor Eindgebruikers
1. Start brain dump sessie via hoofdpagina
2. Kies taal (primair Nederlands)
3. Reageer op triggerwoorden met ideeën
4. Exporteer resultaten als tekstbestand

### Voor Beheerders
1. Ga naar `/admin` voor categoriebeheer
2. Voeg nieuwe categorieën toe met komma-gescheiden woorden
3. Gebruik `/admin/reorganize` om categorieën te verplaatsen
4. Maak backups via export functionaliteit

## Performance & Optimalisatie

### Geïmplementeerde Optimalisaties
- Database indexing op language en is_active
- Lazy loading van configuratie data
- Client-side caching van triggerwoorden
- Responsieve afbeeldingen en fonts
- Minimale CSS/JS bundling

### Monitoring
- Console logging voor database operaties
- Error handling met graceful fallbacks
- User feedback via loading states

## Toekomstige Uitbreidingen

### Mogelijk Vervolgwerk
- Gebruikersspecifieke triggerwoorden toevoegen
- Sessie geschiedenis met detail views
- Multi-language uitbreiding voor andere talen
- Analytics dashboard voor gebruiksstatistieken
- Export naar andere formaten (PDF, Excel)

## Ontwikkelaar Notities

### Belangrijke Beslissingen
1. **Hiërarchische data**: Category field format "MainCategory|SubCategory" voor flexibiliteit
2. **Fallback strategie**: Mock data bij database problemen voor betrouwbaarheid  
3. **Admin vs User interfaces**: Gescheiden interfaces voor verschillende gebruikersrollen
4. **Responsive design**: Mobile-first benadering met progressive enhancement

### Code Kwaliteit
- TypeScript voor type safety
- ESLint configuratie voor code consistency
- Modulaire componenten voor herbruikbaarheid
- Error boundaries en graceful degradation

### Git Workflow
- Feature branches voor grote wijzigingen
- Descriptive commit messages met emoji indicators
- Automatische deployment via Vercel/GitHub integratie

---

**Status**: Project volledig functioneel en deployed op Vercel
**Laatste Update**: Interface verbreding voor betere lange woord accommodatie
**Volgende Stappen**: Gebruikerstesting en eventuele fine-tuning op basis van feedback