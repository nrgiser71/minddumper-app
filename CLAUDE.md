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

### Toast Notification Systeem (Laatste Update)
- Volledig toast notification systeem geïmplementeerd
- Alle browser `alert()` popups vervangen door moderne, elegante toasts
- Verschillende types: success (groen), error (rood), info (blauw)
- Features:
  - Slide-in animaties van rechts
  - Semi-transparante achtergrond met backdrop blur
  - Auto-dismiss na 4 seconden
  - Handmatig sluiten mogelijk
  - Stapelbare toasts
  - Mobile responsive
- Geïntegreerd in alle gebruikersfeedback:
  - Export functies (tekstlijst/CSV)
  - Voorkeuren opslaan
  - Eigen woorden beheer
  - Error meldingen

### Gebruikersvoorkeuren Systeem
- Volledig werkend voorkeuren systeem met bulk API optimalisatie
- Opslaan van 15+ seconden naar <1 seconde geoptimaliseerd
- Individuele woord controle binnen uitgeschakelde categorieën
- Eigen woorden toevoegen met categorie selectie
- Correcte sortering: Professioneel eerst, dan Persoonlijk

### Interface Verbreding
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
6. ✅ Checkbox voorkeuren persistentie → Gebruikersspecifieke voorkeuren database
7. ✅ Trage opslag (15+ seconden) → Bulk API optimalisatie (<1 seconde)
8. ✅ Opdringerige browser popups → Moderne toast notifications
9. ✅ Export formaat problemen → Proper CSV met delimiters + tekstlijst
10. ✅ Individuele woord controle → Granulaire voorkeuren binnen categorieën

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
-- Normalized Schema (V2)
main_categories:
  - id, name, display_order, is_active, created_at

sub_categories:
  - id, main_category_id, name, display_order, is_active, created_at

system_trigger_words:
  - id, sub_category_id, word, language, display_order, is_active, created_at

user_trigger_word_preferences:
  - id, user_id, system_word_id, is_enabled, created_at, updated_at
  - Bulk API: /api/admin/bulk-preferences

user_custom_trigger_words:
  - id, user_id, sub_category_id, word, is_active, created_at, updated_at

brain_dumps:
  - user_id, language, ideas[], metadata
  - Opslag van sessie resultaten

-- Legacy (V1) - Parallel ondersteuning
trigger_words:
  - id, language, word, category (format: "MainCategory|SubCategory")
  - is_active, created_at
  - Indexes op language en is_active voor performance
```

### Bestandsstructuur
```
/src/app/
  ├── app/page.tsx          # Hoofdapplicatie (brain dump interface + toast system)
  ├── app.css               # Styling voor app interface + toast styling
  ├── admin/page.tsx        # Admin interface voor categoriebeheer
  ├── admin/reorganize/     # Interface voor category reorganisatie
  └── api/admin/            # Backend API routes
      ├── bulk-preferences/ # Bulk API voor snelle voorkeuren opslag
      └── ...

/src/components/
  ├── toast-context.tsx     # React context voor toast state management
  ├── toast-container.tsx   # Toast display component met animaties
  ├── protected-route.tsx   # Authentication wrapper
  └── ...

/src/lib/
  ├── database.ts           # Legacy database queries en fallbacks
  ├── database-v2.ts        # Normalized database queries
  ├── user-words-v2.ts      # User custom words management
  ├── auth-context.tsx      # Authentication context
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
4. Configureer persoonlijke voorkeuren (welke woorden wel/niet tonen)
5. Voeg eigen triggerwoorden toe per categorie
6. Exporteer resultaten als tekstbestand of CSV

### Voor Beheerders
1. Ga naar `/admin` voor categoriebeheer
2. Voeg nieuwe categorieën toe met komma-gescheiden woorden
3. Gebruik `/admin/reorganize` om categorieën te verplaatsen
4. Maak backups via export functionaliteit

## Performance & Optimalisatie

### Geïmplementeerde Optimalisaties
- Database indexing op language en is_active
- Bulk API endpoints voor snelle voorkeuren opslag (264 calls → 1 call)
- Lazy loading van configuratie data
- Client-side caching van triggerwoorden
- Efficient word sorting met JavaScript na database fetch
- Responsieve afbeeldingen en fonts
- Minimale CSS/JS bundling

### Monitoring
- Console logging voor database operaties
- Error handling met graceful fallbacks
- User feedback via toast notifications
- Loading states voor alle async operaties
- Debug endpoints voor troubleshooting (/api/debug/*)

## Toekomstige Uitbreidingen

### Mogelijk Vervolgwerk
- ✅ Gebruikersspecifieke triggerwoorden toevoegen (VOLTOOID)
- Sessie geschiedenis met detail views
- Multi-language uitbreiding voor andere talen
- Analytics dashboard voor gebruiksstatistieken
- ✅ Export naar andere formaten (CSV VOLTOOID)
- Advanced toast types (warning, loading toasts)
- Keyboard shortcuts voor power users
- Batch export van meerdere sessies
- Word kategorieën per gebruiker aanpassen

## Ontwikkelaar Notities

### Belangrijke Beslissingen
1. **Hiërarchische data**: Category field format "MainCategory|SubCategory" voor flexibiliteit
2. **Database normalisatie**: V2 schema met aparte tabellen voor performance en flexibiliteit
3. **Bulk API strategie**: Één API call i.p.v. honderden voor snelle voorkeuren opslag
4. **Toast systeem**: React context pattern voor global state management
5. **Fallback strategie**: Mock data bij database problemen voor betrouwbaarheid  
6. **Admin vs User interfaces**: Gescheiden interfaces voor verschillende gebruikersrollen
7. **Responsive design**: Mobile-first benadering met progressive enhancement
8. **User experience**: Non-blocking notifications ter vervanging van browser popups

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
**Laatste Update**: Toast notification systeem geïmplementeerd - alle browser popups vervangen door moderne notifications
**Volgende Stappen**: Gebruikerstesting en eventuele fine-tuning op basis van feedback

## Toast Notification Systeem Details

### Implementatie
- **Context**: `ToastProvider` met React context voor global state
- **Components**: `ToastContainer` met animaties en styling
- **Types**: Success (groen), Error (rood), Info (blauw)
- **Features**: Auto-dismiss, handmatig sluiten, stapelbaar, mobile responsive

### Styling
- **Animaties**: Slide-in van rechts met smooth transitions
- **Design**: Semi-transparant met backdrop blur effect
- **Positioning**: Fixed top-right, mobile responsive (full width op kleine schermen)
- **Typography**: Consistent met app design language

### Integration Points
```typescript
// Export success
showToast('Je mind dump is geëxporteerd als tekstbestand!', 'success')

// Error handling  
showToast('Fout bij opslaan van voorkeuren: ' + error, 'error')

// Info notifications
showToast('Voorkeuren opgeslagen!', 'success')
```

### Performance Impact
- **Bundle Size**: Minimale impact (+0.5kB gzipped)
- **Runtime**: Efficient context updates, geen onnodige re-renders
- **Memory**: Auto cleanup van toasts na dismiss
- **Accessibility**: Proper ARIA labels en keyboard navigation