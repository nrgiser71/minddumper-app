# MindDumper App - Claude Development Notes

## Project Status: Admin Dashboard COMPLETE ✅ - Payment Integration PENDING 🚧

Het MindDumper project basis functionaliteiten zijn succesvol afgerond. Admin dashboard geïmplementeerd. **Volgende fase: Stripe Payment Integration voor betaalde toegang.**

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

**BELANGRIJK: We testen ALTIJD direct in productie - NOOIT lokaal.**

**ALTIJD DEZE STAPPEN VOLGEN VOOR ELKE WIJZIGING:**

1. **Lokaal builden (alleen voor validatie)**:
   ```bash
   npm run build
   ```
   
2. **Alleen committen als build succesvol is**:
   - Geen TypeScript errors
   - Geen ESLint errors  
   - Geen compilation failures
   
3. **Direct naar productie pushen**:
   ```bash
   git add .
   git commit -m "beschrijving"
   git push
   ```

4. **Testen in productie**:
   - Test nieuwe features op live website
   - Check browser console voor errors
   - Verifieer functionaliteit werkt correct

**🎯 WORKFLOW: Build lokaal → Push → Test in productie**

Dit voorkomt:
- Verspilde deploy quota
- Gefaalde production builds
- Tijdverlies door debug cycles
- Frustratie bij gebruiker

**PRODUCTIE = TEST ENVIRONMENT**
- Alle testing gebeurt op live website
- Snelle iteratie cyclus via git push
- Direct feedback van echte gebruikers
- Geen lokale development server nodig

### Database Beheer
- Admin interface: `/admin` - Voor het toevoegen van categorieën en triggerwoorden
- Reorganisatie: `/admin/reorganize` - Voor het verplaatsen van subcategorieën tussen hoofdcategorieën
- Backup systeem ingebouwd voor export/import van gestructureerde data

## Recente Wijzigingen

### Admin Dashboard Systeem (Laatste Update - COMPLEET ✅)
- **Volledig beveiligd admin dashboard geïmplementeerd:**
  - 🔐 Wachtwoord-beveiliging via ADMIN_PASSWORD environment variabele
  - 📊 Uitgebreide statistieken dashboard met real-time data
  - 👥 Gebruikersoverzicht en registratie trends
  - 🧠 Mind dump statistieken per taal en activiteit
  - 🏆 Top gebruikers leaderboard met activiteit tracking
  - 📝 Content statistieken (systeem vs custom woorden)
  - 🔄 Auto-refresh elke 30 seconden
  - 🚪 Veilige login/logout functionaliteit
  - 🔗 Integratie met bestaande admin tools

### Multilingual Support Systeem (COMPLEET ✅)
- **Volledig werkend multilingual systeem geïmplementeerd voor 5 talen:**
  - Nederlands (nl), Engels (en), Duits (de), Frans (fr), Spaans (es)
  - ~260 triggerwoorden per taal met AI-vertalingen
  - Alle talen volledig functioneel met correcte hiërarchie

### Taalspecifieke Features
- **User preferences per taal**: Afvinken van woorden wordt apart bewaard per taal
- **Language-specific custom words**: Eigen woorden toegevoegd per taal
- **Brain dump per taal**: Alleen woorden van geselecteerde taal worden getoond
- **Category name translations**: UI categorieën vertaald naar juiste taal
- **Snelle taalwisseling**: Instant switching tussen talen met correcte data loading

### Performance Optimalisaties (Multilingual)
- **Language filtering**: Alle queries gefilterd op huidige taal voor performance
- **Bulk operations**: Van 25 seconden naar <1 seconde voor preference opslag
- **Race condition fixes**: Taalwisseling zonder data corruptie
- **Cross-language isolation**: Geen data lekkage tussen talen

### Database Migrations Uitgevoerd
- **Added language field** to `user_custom_trigger_words` table
- **Language-specific queries** voor alle user data
- **Proper foreign key constraints** met language filtering
- **Optimized bulk preference handling** met upsert operations

### Toast Notification & Modal Systeem
- Volledig toast notification systeem geïmplementeerd
- Alle browser `alert()` en `confirm()` popups vervangen door moderne UI
- **Toast types**: success (groen), error (rood), info (blauw)
- **Confirmation modals**: Elegante modals met blur backdrop
- Features:
  - Slide-in animaties van rechts (toasts)
  - Semi-transparante achtergrond met backdrop blur (modals)
  - Auto-dismiss na 4 seconden (toasts)
  - ESC key support en click-outside-to-close (modals)
  - Handmatig sluiten mogelijk
  - Stapelbare toasts + mobile responsive
  - Danger styling voor destructieve acties
- Geïntegreerd in alle gebruikersfeedback:
  - Export functies (tekstlijst/CSV)
  - Voorkeuren opslaan en eigen woorden beheer
  - Session recovery dialogs
  - Delete confirmations met danger styling
  - Save & Exit confirmations
  - Error meldingen en success feedback

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

### Multilingual Problemen Opgelost
11. ✅ **Critical language switching bugs** → Race conditions en state management gefixed
12. ✅ **Cross-language preference contamination** → Language-specific filtering geïmplementeerd
13. ✅ **Custom words appearing in all languages** → Database migration naar language-specific custom words
14. ✅ **Brain dump showing wrong language words** → Query filters toegevoegd voor correct language isolation
15. ✅ **25-second save performance issue** → Bulk upsert operations geoptimaliseerd
16. ✅ **Category names not translating** → Translation helper functions geïmplementeerd
17. ✅ **Duplicate key constraint violations** → Proper upsert handling met conflict resolution
18. ✅ **Preferences lost on language switch** → Fixed loading logic met language-specific queries

### Admin Dashboard Problemen Opgelost
19. ✅ **Need for usage analytics** → Comprehensive admin dashboard met real-time statistieken
20. ✅ **No admin authentication** → Password-protected login systeem geïmplementeerd
21. ✅ **Cookie session issues** → Fixed cookie path voor proper API authentication
22. ✅ **Missing user activity insights** → Top users leaderboard en activiteit tracking
23. ✅ **No language distribution visibility** → Language-specific mind dump analytics
24. ✅ **Manual monitoring needed** → Auto-refresh dashboard met comprehensive metrics

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
  - id, user_id, sub_category_id, word, language, is_active, created_at, updated_at

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
  ├── admin/dashboard/      # Admin dashboard met statistieken
  ├── admin/login/          # Admin login pagina
  ├── admin/reorganize/     # Interface voor category reorganisatie
  └── api/admin/            # Backend API routes
      ├── auth/             # Admin authenticatie API
      ├── stats/            # Dashboard statistieken API
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
  ├── admin-auth.ts         # Admin authenticatie utilities en sessie management
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
ADMIN_PASSWORD=               # Admin dashboard wachtwoord
```

## Gebruiksaanwijzing

### Voor Eindgebruikers
1. **Kies je taal**: Nederlands, Engels, Duits, Frans of Spaans
2. **Configureer voorkeuren per taal**: Vink woorden aan/af die je wilt zien
3. **Voeg eigen woorden toe per taal**: Persoonlijke triggerwoorden per categorie
4. **Start brain dump sessie**: Alleen woorden van gekozen taal worden getoond
5. **Switch tussen talen**: Voorkeuren blijven apart bewaard per taal
6. **Exporteer resultaten**: Als tekstbestand of CSV

### Voor Beheerders
1. **Dashboard**: Ga naar `/admin/dashboard` voor uitgebreide statistieken
2. **Login**: Gebruik `/admin/login` met je ADMIN_PASSWORD environment variabele
3. **Categoriebeheer**: Ga naar `/admin` voor triggerwoorden beheer
4. **Reorganisatie**: Gebruik `/admin/reorganize` om categorieën te verplaatsen
5. **Backups**: Maak backups via export functionaliteit
6. **Monitoring**: Dashboard auto-refresh toont real-time gebruikersactiviteit

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

## Auto-Save Systeem Implementation Details

### Comprehensive Zero Data Loss Architecture
- **localStorage Backup Strategy**: Immediate save after each idea entry
- **30-Second Database Auto-Save**: Production-ready with draft/final status
- **Session Recovery System**: Automatic detection en restoration
- **Connection Monitoring**: Offline/online detection met sync queue
- **Previous Ideas Display**: Context preservation during session recovery

### Technical Implementation
```typescript
// localStorage schema
interface SessionData {
  sessionId: string
  language: Language
  triggerWords: string[]
  allIdeas: string[]      // All ideas from session
  currentIdeas: string[]  // Ideas for current word
  currentWordIndex: number
  startTime: string
  lastSaved: string
}

// Database upsert strategy for drafts
if (brainDump.is_draft && brainDump.session_id) {
  // Update existing draft record
  await supabase.update(sessionData).eq('session_id', sessionId)
} else {
  // Create new final record
  await supabase.insert(finalData)
}
```

### Database Schema Extensions
```sql
-- New columns added to brain_dumps table
ALTER TABLE brain_dumps ADD COLUMNS:
  is_draft BOOLEAN DEFAULT false,     -- Draft vs final status
  session_id TEXT NULL,               -- Unique session identifier
  updated_at TIMESTAMP DEFAULT now()  -- Auto-update timestamp

-- Performance indexes
CREATE INDEX idx_brain_dumps_session_id ON brain_dumps(session_id);
CREATE INDEX idx_brain_dumps_user_draft ON brain_dumps(user_id, is_draft);

-- Cleanup function for old drafts
CREATE FUNCTION cleanup_old_drafts() RETURNS INTEGER AS $$
BEGIN
  DELETE FROM brain_dumps WHERE is_draft = true AND created_at < (NOW() - INTERVAL '7 days');
END;
$$;
```

### User Experience Features
- **Real-time Status Indicators**: Online/offline, save status, pending syncs
- **Modern Confirmation Modals**: Replace all browser popups
- **Session Context**: Show all previous ideas during recovery
- **Browser Protection**: Warn before accidental tab close
- **Auto-cleanup**: Remove old sessions (7 days)

## Performance & Console Optimizations

### CSS Loading Optimizations
- **Webpack Configuration**: Optimized CSS chunking strategy
- **Preload Warning Elimination**: Reduced aggressive CSS preloading
- **Bundle Optimization**: Single CSS chunk to avoid unused preloads
- **Production-Only**: Optimizations only active in production builds

### Next.js Configuration
```typescript
// next.config.ts optimizations
webpack: (config, { dev, isServer }) => {
  if (!isServer && !dev) {
    config.optimization.splitChunks.cacheGroups.styles = {
      name: 'styles',
      type: 'css/mini-extract',
      chunks: 'all',
      enforce: true
    }
  }
}
```

## Toekomstige Uitbreidingen

### Mogelijk Vervolgwerk
- ✅ **Gebruikersspecifieke triggerwoorden** toevoegen (VOLTOOID)
- ✅ **Multi-language systeem** voor 5 talen (VOLTOOID)
- ✅ **Language-specific preferences** en custom words (VOLTOOID)
- ✅ **Export naar andere formaten** (CSV VOLTOOID)
- ✅ **Auto-save systeem** met zero data loss (VOLTOOID)
- ✅ **Modern UI confirmations** ter vervanging van browser popups (VOLTOOID)
- ✅ **CSS optimalisaties** voor clean console (VOLTOOID)
- Sessie geschiedenis met detail views per taal
- **Subcategory name translations** (huidige issue: Nederlandse namen in andere talen)
- Analytics dashboard voor gebruiksstatistieken per taal
- Advanced toast types (warning, loading toasts)
- Keyboard shortcuts voor power users
- Batch export van meerdere sessies
- **Language detection** voor automatische taal selectie
- **Import/export van user preferences** per taal

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

**Status**: Project volledig functioneel en deployed op Vercel - **AUTO-SAVE & UI MODERNIZATION COMPLEET** 💾🎨
**Laatste Update**: Complete auto-save systeem + moderne UI confirmations + CSS optimalisaties geïmplementeerd
**Hoogtepunten**: 
- ✅ localStorage backup: Onmiddellijke opslag na elke idee met session recovery
- ✅ 30-second database auto-save met draft/final status en upsert logic
- ✅ Previous ideas display: Overzicht van alle vorige ideeën tijdens session recovery
- ✅ Connection monitoring: Offline detection met automatic sync queue
- ✅ Modern confirmations: Alle browser popups vervangen door elegante modals
- ✅ UI feedback: Real-time status indicators en toast notifications
- ✅ Database schema: is_draft, session_id, updated_at kolommen met indexen
- ✅ CSS optimalisaties: Console preload warnings geëlimineerd

**Resultaat**: **ZERO DATA LOSS GARANTIE** + **CLEAN CONSOLE** - Enterprise-grade user experience

## Multilingual System Implementation Details

### Supported Languages
- 🇳🇱 **Nederlands (nl)** - Primary language, ~264 triggerwoorden
- 🇬🇧 **English (en)** - ~260 triggerwoorden  
- 🇩🇪 **Deutsch (de)** - ~261 triggerwoorden
- 🇫🇷 **Français (fr)** - ~262 triggerwoorden
- 🇪🇸 **Español (es)** - ~262 triggerwoorden

### Translation Process
- **AI-assisted translations** voor alle triggerwoorden van Nederlands naar andere talen
- **Category name translations** in frontend voor UI consistency
- **Hierarchical structure preserved** over alle talen
- **Professional/Personal ordering** consistent in alle talen

### Database Migrations Executed
```sql
-- Added language support to custom words
ALTER TABLE user_custom_trigger_words 
ADD COLUMN language TEXT NOT NULL DEFAULT 'nl';

-- All system_trigger_words already had language field
-- User preferences automatically language-specific via system_word_id foreign key
```

### Language Switching Architecture
1. **Frontend state management**: `currentLanguage` state tracked globally
2. **Database queries**: All filtered by language parameter
3. **Performance optimization**: Language-specific caching en filtering
4. **Race condition prevention**: Direct language parameter passing
5. **Cross-language isolation**: Geen data lekkage tussen talen

### Key Technical Challenges Solved
- **Race conditions** tijdens language switching
- **Performance issues** (25 seconden → <1 seconde)
- **Cross-language data contamination**
- **Duplicate key constraint violations**
- **Custom words appearing across languages**
- **Brain dump showing wrong language data**

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

## Admin Dashboard Systeem Details

### Security Implementation
- **Password Protection**: Environment-based ADMIN_PASSWORD configuratie
- **Session Management**: Secure httpOnly cookies met 4-hour expiration
- **Path Security**: Cookie path optimization voor API access
- **Unauthorized Handling**: Automatic redirect naar login bij invalid sessions

### Dashboard Features
- **User Analytics**: Totaal gebruikers, nieuwe registraties, activiteit trends
- **Mind Dump Statistics**: Per-taal verdeling, gemiddelde metrics, recente activiteit
- **Top Users**: Leaderboard met brain dump counts en gebruikersinformatie
- **Content Overview**: System vs custom words statistieken
- **Real-time Updates**: Auto-refresh elke 30 seconden voor live data

### Technical Architecture
```typescript
// Admin authentication flow
Login → Password verify → Session cookie → Dashboard access → API calls → Statistics

// Database queries with service role
const adminSupabase = createClient(url, SERVICE_ROLE_KEY)
// Bypass RLS for comprehensive analytics

// Session verification
verifyAdminSessionFromRequest() → Cookie validation → API access
```

### API Endpoints
- **`/api/admin/auth`**: Login/logout functionality
- **`/api/admin/stats`**: Comprehensive dashboard statistics
- **Protected routes**: Automatic session verification
- **Service role queries**: Full database access voor analytics

---

# 🚧 VOLGENDE FASE: Stripe Payment Integration

## Overzicht Stripe Implementation
Het doel is om van MindDumper een **betaalde service** te maken waarbij gebruikers moeten betalen voordat ze kunnen registreren. Huidige gratis signup wordt vervangen door een Stripe checkout proces.

## 🎯 Key Requirements

### 1. Configureerbare Pricing
```bash
# Environment Variables voor flexibele pricing
PRODUCT_PRICE_EUROS=12                    # Hoofdprijs (aanpasbaar)
PRODUCT_PRICE_CENTS=1200                  # Stripe amount in cents
PRODUCT_CURRENCY=EUR
PRODUCT_NAME="MindDumper Lifetime Access"
PRODUCT_DESCRIPTION="Brain dump tool met triggerwoorden in 5 talen"

# Voordelen: Prijs aanpassen zonder code deployment
```

### 2. Complete Billing Information
```typescript
// Checkout form requirements:
interface CheckoutForm {
  // Personal/Company Info
  email: string
  fullName: string
  companyName?: string        // Optioneel voor particulieren
  
  // Address Information (VERPLICHT)
  address: {
    line1: string            // Straat + huisnummer
    line2?: string           // Toevoeging
    city: string
    postalCode: string
    country: string          // Dropdown
    state?: string           // Voor niet-EU
  }
  
  // Business Information
  customerType: 'private' | 'business'
  vatNumber?: string         // Verplicht voor bedrijven
  newsletter: boolean        // Marketing opt-in
}
```

### 3. BTW & Compliance
- **BTW-nummer validatie**: EU VIES API integration
- **Tax calculation**: Correct BTW handling voor EU/non-EU
- **Invoice generation**: PDF facturen met alle billing details
- **GDPR compliance**: Data retention en export functionality

## 🏗️ Technical Architecture

### Database Schema Uitbreiding
```sql
-- Extend profiles table
ALTER TABLE profiles ADD COLUMNS:
  -- Stripe & Payment
  stripe_customer_id TEXT
  stripe_payment_intent_id TEXT  
  payment_status TEXT DEFAULT 'pending'
  paid_at TIMESTAMP
  amount_paid_cents INTEGER
  currency TEXT DEFAULT 'EUR'
  
  -- Customer Information
  customer_type TEXT DEFAULT 'private'
  company_name TEXT
  
  -- Billing Address
  billing_address_line1 TEXT
  billing_address_line2 TEXT
  billing_city TEXT
  billing_postal_code TEXT
  billing_country TEXT
  billing_state TEXT
  
  -- Business Information
  vat_number TEXT
  vat_validated BOOLEAN DEFAULT false
  
  -- Marketing
  newsletter_opted_in BOOLEAN DEFAULT false
```

### New Dependencies
```bash
npm install stripe @stripe/stripe-js
npm install --save-dev @types/stripe
```

### Environment Variables
```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Pricing (configurable)
PRODUCT_PRICE_EUROS=12
PRODUCT_PRICE_CENTS=1200
PRODUCT_CURRENCY=EUR
PRODUCT_NAME="MindDumper Lifetime Access"

# VAT Configuration
VAT_RATE_PERCENTAGE=21
VAT_INCLUDED_IN_PRICE=true
```

## 📁 Files to Create/Modify

### New Files
```
/src/app/checkout/page.tsx              # Complete billing form
/src/components/checkout-form.tsx       # Reusable form component
/src/app/success/page.tsx               # Payment success page
/src/app/api/stripe/checkout/route.ts   # Create Stripe session
/src/app/api/stripe/webhook/route.ts    # Handle payment events
/src/app/api/validate-vat/route.ts      # BTW-nummer validatie
/src/lib/stripe.ts                      # Stripe configuration
/src/lib/pricing.ts                     # Centralized pricing logic
/src/lib/vat-validation.ts              # BTW validatie utilities
/src/lib/address-validation.ts          # Adres validatie
```

### Modified Files
```
/src/app/auth/signup/page.tsx           # Redirect naar checkout
/src/app/page.tsx                       # Dynamic price display
/src/lib/supabase.ts                    # Payment-related types
/src/app/app/page.tsx                   # Payment verification
/src/components/protected-route.tsx     # Payment status check
```

## 🔄 Payment Flow

### User Journey
```
1. Landing Page → "🔥 Koop Nu - €{PRICE}" (dynamic)
2. Checkout Form → Email, naam, adres, BTW (if business)
3. Stripe Payment → Secure card processing
4. Webhook → Automatic account creation
5. Success Page → Login credentials via email
6. App Access → Direct naar protected app
```

### Technical Flow
```typescript
// Checkout Process
User Input → Form Validation → Stripe Session → Payment → Webhook → Account Creation

// Webhook Handler
payment_intent.succeeded → 
  Extract billing data → 
  Create Supabase user → 
  Send welcome email → 
  Update payment status
```

## 🛡️ Security & Validation

### Payment Security
- **Webhook signature verification** via STRIPE_WEBHOOK_SECRET
- **Amount validation**: Exact price matching
- **Duplicate prevention**: Idempotency keys
- **Customer validation**: Email + billing verification

### Data Protection
- **GDPR compliance**: Data retention policies
- **Secure storage**: Encrypted billing information
- **Access control**: Payment status based app access

## 📊 Admin Dashboard Integration

### Enhanced Analytics
```typescript
// New payment metrics in admin dashboard
interface PaymentAnalytics {
  totalRevenue: number
  customerBreakdown: {
    private: number
    business: number
  }
  geographicDistribution: Record<string, number>
  vatCollected: number
  conversionRate: number
}
```

### Customer Management
- **Payment status overview**: Paid/pending/failed customers
- **Billing information**: Complete customer details
- **Revenue tracking**: Real-time payment analytics
- **Refund handling**: Customer support tools

## 🎯 Implementation Roadmap

### Phase 1: Core Payment System
1. **Setup Stripe integration** met configureerbare pricing
2. **Create checkout form** met complete billing info
3. **Implement webhook handler** voor account creation
4. **Update protected routes** met payment verification
5. **Test payment flow** end-to-end

### Phase 2: Advanced Features
1. **BTW-nummer validatie** via EU VIES API
2. **Tax calculation logic** voor verschillende landen
3. **Invoice generation** systeem (PDF)
4. **Admin payment dashboard** integration
5. **Customer support tools**

### Phase 3: Optimization
1. **A/B testing** voor pricing optimization
2. **Conversion tracking** en analytics
3. **Regional pricing** support
4. **Promotional discount** systeem
5. **Subscription upgrade** paths (future)

## 💡 Strategic Benefits

### Business Flexibility
- **Dynamic pricing**: Test different price points zonder deployment
- **Market adaptation**: Easy regional pricing adjustments
- **Promotional campaigns**: Instant discount activation
- **Revenue optimization**: Data-driven pricing decisions

### Customer Experience
- **Professional checkout**: Complete billing information collection
- **Instant access**: Automatic account creation na payment
- **Legal compliance**: Proper invoicing en BTW handling
- **Trust building**: Secure Stripe payment processing

### Technical Advantages
- **Scalable architecture**: Ready voor volume growth
- **Compliance ready**: GDPR, BTW, invoice requirements
- **Admin visibility**: Complete payment en customer analytics
- **Future proof**: Easy expansion naar subscriptions

---

**Status**: Planning compleet - Klaar voor implementatie 🚀
**Next Session**: Begin met Stripe setup en checkout form development