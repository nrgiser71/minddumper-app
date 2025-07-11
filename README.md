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

## Roadmap

- [x] Landing page met marketing content
- [x] Complete brain dump app mockup
- [x] Export functionaliteit
- [ ] Supabase database integratie
- [ ] User authentication
- [ ] Real triggerwoorden database
- [ ] Payment integratie (Stripe)
- [ ] Custom domain (minddumper.com)

## License

Proprietary - Alle rechten voorbehouden
# Force redeploy for env vars
