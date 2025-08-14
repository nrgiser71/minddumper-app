# Development Workflow Planning - MindDumper App
*Opgeslagen: 10 augustus 2025*

## 📋 Context
- MindDumper app is sinds vandaag live in productie
- Huidige workflow: direct testen in productie (risicovol)  
- **Probleem**: Geen veilige manier om features te ontwikkelen zonder live gebruikers te beïnvloeden
- **Nodig**: Testomgeving + gecontroleerde deployment workflow

## 💰 Kosten Analysis

### Optie 1: Budget Oplossing (€0/maand)
- **Vercel**: Development branch → gratis preview URL
- **Database**: Staging schema in huidige Supabase database (prefix `staging_`)
- **Test URL**: `minddumper-app-git-development-nrgiser71.vercel.app`
- **Voordeel**: Geen extra kosten
- **Nadeel**: Test/productie data in zelfde database

### Optie 2: Professional Setup (€25/maand)
- **Vercel**: Development branch → gratis preview URL  
- **Database**: Aparte Supabase staging project
- **Test URL**: `minddumper-app-git-development-nrgiser71.vercel.app`
- **Voordeel**: Complete isolatie test/productie
- **Nadeel**: €25/maand extra kosten

## 🔧 Technical Implementation Plan

### Branch Strategy
```
main (production) → www.minddumper.com
development (staging) → preview URL
feature/* (development) → preview URLs
```

### Workflow
1. **Ontwikkeling**: Werk in `development` branch
2. **Testing**: Test op preview URL met staging data
3. **Release**: Merge `development` → `main` 
4. **Deploy**: Automatisch naar productie na merge

### Safety Measures
- Branch protection op `main`
- Required reviews voor production merges
- Automated build checks
- Environment-specific configuration

## 📅 Decision Points voor Morgen

1. **Budget**: €0 vs €25/maand voor database isolatie?
2. **Timeline**: Wanneer implementeren? (voordat volgende features)
3. **Responsibilities**: Wie doet code reviews?
4. **Testing Strategy**: Welke features eerst testen in nieuwe workflow?

## 🚀 Implementation Scope
- Geschatte tijd: 2-3 uur setup
- GitHub configuratie
- Vercel branch settings  
- Database setup (optie afhankelijk)
- Documentation updates
- Team training nieuwe workflow

## 📝 Notes
- Huidige GitHub repo: `https://github.com/nrgiser71/minddumper-app.git`
- Vercel deployment: Already configured, auto-deploy van main branch
- Critical: Implementeren vóór volgende major features