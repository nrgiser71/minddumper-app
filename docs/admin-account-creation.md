# Admin Account Creation voor Gratis Trainer Accounts

## Overzicht

Deze functionaliteit stelt je in staat om direct betaalde Mind Dumper accounts aan te maken voor time management trainers, zonder dat zij hoeven te betalen. Dit is onderdeel van de marketing strategie om trainers te laten kennismaken met het product tijdens hun opleidingen.

## Waarom deze functionaliteit?

- **Marketing opportuniteit**: Trainers kunnen Mind Dumper promoten tijdens opleidingen
- **Product experience**: Trainers krijgen volledige toegang tot het product
- **Geen complexiteit**: Trainers krijgen exact dezelfde ervaring als betalende klanten
- **Controle**: Jij behoudt volledige controle over wie toegang krijgt

## Hoe werkt het?

### Stap 1: Toegang tot Admin Dashboard

1. Ga naar: `https://minddumper-app.vercel.app/admin/login`
2. Log in met je admin credentials
3. Klik op **Dashboard** in het menu

### Stap 2: Account Aanmaken

1. In de admin dashboard, klik op de groene knop **➕ Account Aanmaken** (rechtsboven)
2. Een modal verschijnt met een formulier:
   - **Email*** (verplicht): Het email adres van de trainer
   - **Volledige Naam*** (verplicht): Voor- en achternaam
   - **Notities** (optioneel): Bijv. "Trainer bij bedrijf X, time management specialist"

### Stap 3: Account Genereren

1. Klik **✅ Account Aanmaken**
2. Het systeem:
   - Maakt een Supabase auth account aan
   - Zet de `payment_status` op `paid` 
   - Genereert een password reset link
3. Na succes zie je:
   - ✅ Bevestigingsbericht
   - Password reset link (klaar om te kopiëren)

### Stap 4: Trainer Uitnodigen

1. **Kopieer** de password reset link (via de 📋 knop)
2. **Stuur handmatig** een email naar de trainer met deze link
3. **Trainer workflow**:
   - Klikt op link → komt op password reset pagina
   - Zet nieuw wachtwoord in → wordt ingelogd  
   - Krijgt volledige toegang tot Mind Dumper app

## Email Templates

### Basis Template

```
Onderwerp: Je gratis Mind Dumper account is klaar!

Beste [NAAM],

Geweldig dat je interesse hebt om Mind Dumper aan te prijzen tijdens je time management trainingen!

Ik heb een gratis account voor je aangemaakt. Klik op onderstaande link om je wachtwoord in te stellen en direct aan de slag te gaan:

[PASSWORD_RESET_LINK]

Met dit account heb je:
✅ Volledige toegang tot alle Mind Dumper functies
✅ Onbeperkt brain dumps maken  
✅ Alle talen beschikbaar
✅ Export naar verschillende formaten

Vragen? Reageer gerust op deze email.

Succes met je trainingen!

Groeten,
Jan
```

### Uitgebreide Template

```
Onderwerp: Jouw gratis Mind Dumper trainer account + tips voor implementatie

Beste [NAAM],

Fijn dat je Mind Dumper wilt introduceren bij je time management trainingen!

## Je Account
Ik heb een volledig werkend account voor je klaargezet. Klik hier om je wachtwoord in te stellen:

[PASSWORD_RESET_LINK]

## Hoe Mind Dumper werkt in trainingen

**Live demonstratie (10-15 min)**:
1. Laat zien hoe ze in 5 minuten hun hoofd leeg kunnen maken
2. Toon de automatische categorisering van gedachten
3. Laat de export functionaliteit zien

**Hands-on oefening**:
- Laat deelnemers zelf een 5-minuten brain dump doen
- Perfecte break-activity tussen theorie blokken

**Vervolgstap**:
- Verwijs naar www.minddumper.com voor eigen account

## Tips voor trainers
- Start altijd met de Nederlandse versie
- Emphasize dat het supplement is voor bestaande systemen
- Toon de geschiedenis functie voor opvolging

Vragen? Bel me gerust: [TELEFOONNUMMER]

Succes!

Jan
```

## Technische Details

### Database Impact
- **Tabel**: `profiles` 
- **Nieuwe records**: Trainer krijgt `payment_status: 'paid'`
- **Geen wijzigingen**: Aan bestaande gebruikers of functionaliteit

### API Endpoints Gebruikt
- `POST /api/admin/create-account`: Account creation
- Supabase Auth: `admin.createUser()` + `admin.generateLink()`

### Beveiliging
- ✅ Admin authenticatie vereist
- ✅ Email validatie  
- ✅ Dubbele accounts preventie
- ✅ Cleanup bij failures

## Troubleshooting

### Account bestaat al
**Probleem**: "Account with this email already exists"
**Oplossing**: Controleer of trainer al een bestaand account heeft

### Password reset link werkt niet  
**Probleem**: Trainer kan niet inloggen via link
**Oplossing**: 
1. Controleer of link nog geldig is (verlopen na 24u)
2. Genereer nieuwe link via admin dashboard → zoek gebruiker → "Reset Password"

### Trainer ziet betaalscherm
**Probleem**: Ondanks account creation ziet trainer nog checkout pagina
**Oplossing**: Controleer in admin dashboard of `payment_status = 'paid'`

### Email bereikt trainer niet
**Probleem**: Trainer heeft link niet ontvangen  
**Oplossing**: 
1. Controleer spam folder
2. Stuur link via alternatieve communicatie (WhatsApp, telefoon)
3. Kopieer link uit admin interface

## Account Beheer

### Trainer account uitschakelen
1. Admin Dashboard → Zoek trainer
2. Klik op naam → User Details pagina
3. **Disable Account** knop

### Account verwijderen  
1. Admin Dashboard → Zoek trainer  
2. Klik op naam → User Details pagina
3. **Delete Account** knop (⚠️ permanent!)

### Nieuwe password reset link
1. Admin Dashboard → Zoek trainer
2. Klik op naam → User Details pagina  
3. **Reset Password** knop → kopieer nieuwe link

## Statistieken

Alle trainer accounts zijn zichtbaar in:
- **Admin Dashboard**: Recent Users sectie
- **Revenue Stats**: Tellen niet mee als echte revenue
- **User Search**: Zoek op email/naam om accounts te vinden

---

*Documentatie gecreëerd: Augustus 2025*  
*Laatste update: [DATUM]*