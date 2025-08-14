# Supabase Staging Database Setup - MindDumper

## Waarom Aparte Staging Database Voor MindDumper?

### Productie Bescherming
- ✅ **Geen gebruiker data risico** - staging tests kunnen nooit echte brain dumps beschadigen
- ✅ **Schema migration testing** - database wijzigingen eerst testen voor productie
- ✅ **Performance testing** - load testing zonder impact op actieve gebruikers
- ✅ **Data privacy** - geen echte gebruiker brain dumps in development environment

### Development Freedom
- ✅ **Destructieve tests** - database resets, bulk deletes, schema drops
- ✅ **Test data experimenten** - grote hoeveelheden fake brain dump data voor testing
- ✅ **Migration rollbacks** - veilig testen van database downgrades
- ✅ **Integration testing** - end-to-end tests met database state changes

## Supabase Staging Database Setup

### Stap 1: Nieuwe Database Project Aanmaken
1. **Login naar Supabase:** https://supabase.com/dashboard
2. **Create New Project** (of gebruik bestaand organization)
3. **Project Name:** `minddumper-staging`
4. **Database Password:** Generate strong password (save securely)
5. **Region:** Same als productie voor consistency
6. **Pricing Plan:** Free tier (voldoende voor staging)

### Stap 2: Database Configuration
1. Ga naar **Settings** → **Database**
2. Note down connection details:
   - Host
   - Database name
   - Port (5432)
   - Username (postgres)

### Stap 3: Schema Migration naar Staging

**Optie A: Schema Export/Import**
```sql
-- In productie database (via Supabase SQL Editor):
-- Export your current schema structure
-- Copy all CREATE TABLE statements, RLS policies, etc.

-- In staging database:
-- Paste and run the schema creation scripts
```

**Optie B: Supabase CLI Migration (Recommended)**
```bash
# Install Supabase CLI if not installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to staging project
supabase link --project-ref [staging-project-ref]

# Generate migration from production schema differences
supabase db diff --schema public

# Apply migration to staging
supabase db push
```

### Stap 4: Test Data Setup voor MindDumper

Create realistic test data that mirrors MindDumper's structure:

```sql
-- Test user voor staging
INSERT INTO profiles (id, email, language, created_at) VALUES 
('test-user-staging', 'staging-test@minddumper.com', 'nl', NOW());

-- Test categories in meerdere talen
INSERT INTO categories (id, name, language) VALUES 
('cat-1', 'Werk', 'nl'),
('cat-2', 'Familie', 'nl'),
('cat-3', 'Gezondheid', 'nl'),
('cat-4', 'Work', 'en'),
('cat-5', 'Family', 'en'),
('cat-6', 'Health', 'en');

-- Test trigger words
INSERT INTO trigger_words (id, word, category_id, language) VALUES 
(1, 'meeting', 'cat-4', 'en'),
(2, 'vergadering', 'cat-1', 'nl'),
(3, 'kinderen', 'cat-2', 'nl'),
(4, 'exercise', 'cat-6', 'en'),
(5, 'sport', 'cat-3', 'nl');

-- Test brain dump data
INSERT INTO brain_dumps (id, user_id, content, created_at, language) VALUES 
('dump-1', 'test-user-staging', 'Test brain dump content voor staging testing', NOW(), 'nl'),
('dump-2', 'test-user-staging', 'Another test brain dump with multiple thoughts', NOW(), 'en');
```

### Stap 5: Vercel Environment Variables Setup

In Vercel dashboard voor staging environment:

1. Go to **Project Settings** → **Environment Variables**
2. Add staging-specific variables for **Preview** environment:

```bash
# Primary database connection (Staging)
NEXT_PUBLIC_SUPABASE_URL=https://[staging-project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[staging-anon-key]

# Backend environment variables (if used)
SUPABASE_SERVICE_ROLE_KEY=[staging-service-role-key]
DATABASE_URL=[staging-connection-string]

# Environment identifier
NODE_ENV=staging
NEXT_PUBLIC_APP_ENV=staging

# Debug settings for staging
NEXT_PUBLIC_DEBUG_MODE=true
```

3. Set **Environment** to **Preview** (this applies to staging branch deployments)

## Row Level Security (RLS) Setup

Ensure staging database has proper RLS policies:

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE brain_dumps ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE trigger_words ENABLE ROW LEVEL SECURITY;

-- Create policies for staging (can be more permissive)
CREATE POLICY "Allow staging access to profiles" ON profiles 
FOR ALL USING (true);

CREATE POLICY "Allow staging access to brain_dumps" ON brain_dumps 
FOR ALL USING (true);

-- (Repeat for other tables as needed)
```

## Data Management Scripts

### Development Test Data Reset
```bash
#!/bin/bash
# reset-staging-data.sh

echo "🧹 Resetting MindDumper staging database..."

# Connect to staging database via Supabase SQL Editor or CLI
supabase db reset --linked

echo "✅ Staging database reset complete"
```

### Staging Data Cleanup
```sql
-- Clear user data but keep system data
DELETE FROM brain_dumps WHERE user_id LIKE 'test-%';
DELETE FROM profiles WHERE id LIKE 'test-%';

-- Reset sequences if needed
ALTER SEQUENCE trigger_words_id_seq RESTART WITH 1000;

-- Re-insert test users
INSERT INTO profiles (id, email, language) VALUES 
('test-user-staging', 'staging-test@minddumper.com', 'nl');
```

## Environment Variable Management

### Local Development (.env.staging)
```bash
# Copy template for staging development
cp .env.example .env.staging

# Update with staging values
NEXT_PUBLIC_SUPABASE_URL=https://[staging-project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[staging-anon-key]
NODE_ENV=staging
NEXT_PUBLIC_DEBUG_MODE=true
```

### Vercel Staging Environment
1. **Vercel Dashboard** → Project → Settings → Environment Variables
2. **Add variables specifically for Preview environment:**
   - Environment: Preview (staging branch)
   - All staging database credentials
   - Debug flags enabled

## Security Considerations

### Staging Security Best Practices
- ✅ **Geen productie data** - nooit echte gebruiker brain dumps kopiëren
- ✅ **Test email adressen** - gebruik staging-test@minddumper.com pattern
- ✅ **Debug logging** - enable detailed logging voor troubleshooting
- ✅ **Limited access** - staging database alleen toegankelijk voor development
- ✅ **Separate API keys** - andere Supabase project met eigen keys

### Network Security
- ✅ **SSL enforced** - Supabase enforces SSL by default
- ✅ **IP restrictions** (optioneel) - kan worden ingeschakeld in Supabase dashboard
- ✅ **Connection pooling** - Supabase handles this automatically

## Performance Optimization

### Supabase Free Tier Management
- **Database size:** 500 MB limit (voldoende voor staging)
- **Bandwidth:** 5 GB/month (ruim voldoende voor testing)
- **API requests:** 50,000/month (more than enough for development)

### Optimization Tips
- ✅ **Auto-pause** - Supabase pauses inactive databases automatically
- ✅ **Minimal data** - Keep staging database lean with only test data
- ✅ **Regular cleanup** - Remove old test data periodically

## Troubleshooting

### Common Database Issues

**Connection Timeouts:**
```bash
# Test staging database connection
curl -I https://[staging-project-ref].supabase.co/rest/v1/
```

**Schema Out of Sync:**
```bash
# Re-sync schema from production
supabase db diff production staging
supabase db push
```

**Missing Test Data:**
```bash
# Re-run test data insertion scripts
# (Use the test data SQL from Step 4 above)
```

### API Issues
**Authentication Errors:**
- Check NEXT_PUBLIC_SUPABASE_ANON_KEY is correct
- Verify RLS policies allow staging access
- Test in Supabase dashboard first

**CORS Issues:**
- Add staging domain to Supabase settings
- Check environment variable configuration

## Implementation Checklist

### Setup Tasks
- [ ] Nieuwe Supabase project aangemaakt voor staging
- [ ] Database schema gemigreerd naar staging
- [ ] Test data toegevoegd voor realistic testing
- [ ] RLS policies geconfigureerd
- [ ] Vercel environment variables geconfigureerd voor Preview
- [ ] Staging deployment test uitgevoerd

### Verification Tasks
- [ ] Staging app connects to staging database
- [ ] Geen cross-contamination met productie data
- [ ] All database operations work on staging
- [ ] Schema changes kunnen worden getest op staging eerst
- [ ] Performance acceptable voor development use
- [ ] staging-test.html toont correcte database connectivity

### Maintenance Setup
- [ ] Data reset scripts gemaakt (optioneel)
- [ ] Schema sync verification process
- [ ] Access controls geconfigureerd
- [ ] Monitoring van staging database usage

## Conclusie

Met een aparte Supabase staging database krijg je:
- 🔒 **100% Productie bescherming** tegen data corruption
- ⚡ **Volledige development freedom** voor destructieve testing  
- 🧪 **Realistic testing environment** met echte database operations
- 🚀 **Betrouwbare schema migrations** getest voor productie deployment
- 👥 **User data safety** - echte brain dumps blijven veilig in productie

De setup tijd (45 minuten) voorkomt productie database disasters die uren/dagen kunnen kosten om te herstellen.