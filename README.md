# MindDumper App

Een brain dump tool die gebruikers helpt alle taken uit hun hoofd te krijgen door middel van triggerwoorden.

## Features

- **Meertalige Triggers**: 5 talen ondersteund (NL, EN, DE, FR, ES)
- **Brain Dump Flow**: Gestructureerd proces om ideeën te verzamelen
- **Export Functionaliteit**: Exporteer naar tekstlijst
- **Progress Tracking**: Voortgangsbalken en statistieken
- **Responsive Design**: Werkt op alle apparaten

## Tech Stack

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Deployment**: Vercel
- **Styling**: Custom CSS met Apple-inspired design

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Deployment

Dit project is geconfigureerd voor automatische deployment op Vercel:

1. Push naar main branch
2. Vercel detecteert automatisch Next.js
3. Deploy naar productie

## Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Landing page
│   ├── app/page.tsx      # Brain dump app
│   ├── api/              # API routes
│   ├── landing.css       # Landing page styles
│   └── app.css          # App styles
├── components/           # Reusable components
└── lib/                 # Utilities and configurations
```

## Recent Updates (July-August 2025)

### August 2025
- [x] **Language Preference UX**: Smart language selection - users choose once, app remembers preference
- [x] **New User Onboarding**: First-time users select language, automatically saved to profile
- [x] **Returning User Flow**: "Start Brain Dump" uses saved language (no re-selection needed)
- [x] **Configuration Enhancement**: Language preference editable in settings with clear labeling
- [x] **Bug Fixes**: Fixed login page text visibility (white-on-white issue resolved)
- [x] **Security Fix**: Resolved configuration save issue (admin auth removed from user function)

### July 2025
- [x] **Landing Page Optimization**: Updated marketing copy for better clarity
- [x] **FAQ Section**: Expanded from 6 to 11 FAQ items with better questions  
- [x] **Problem Scenarios**: Added 6 additional mental overwhelm scenarios (12 total)
- [x] **Content Cleanup**: Removed testimonials and solo developer sections
- [x] **UI Improvements**: Fixed step count consistency (3 steps vs 4 steps)
- [x] **Copy Improvements**: More accurate language ("regularly" vs "daily" usage)

## Roadmap

- [x] Landing page met marketing content
- [x] Complete brain dump app mockup
- [x] Export functionaliteit
- [x] Landing page optimization en content verbetering
- [x] Supabase database integratie
- [x] User authentication
- [x] Real triggerwoorden database
- [x] Payment integratie (PlugAndPay)
- [x] Custom domain (minddumper.com)
- [x] Language preference system
- [x] User onboarding optimization

## License

Proprietary - Alle rechten voorbehouden
# Force redeploy for env vars
# Force redeploy for vercel.json webhook fix
# Force deploy Tue Jul 22 21:16:21 CEST 2025
