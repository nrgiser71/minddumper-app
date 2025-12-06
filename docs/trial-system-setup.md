# MindDumper Trial System - Setup Guide

## Environment Variables Configuration

### Required Environment Variables

Add these variables to your `.env.local` file:

```bash
# Mailgun Configuration (for Trial System & Email Notifications)
MAILGUN_API_KEY=your_mailgun_sending_key_here
MAILGUN_DOMAIN=mg.yourdomain.com
MAILGUN_FROM_EMAIL=noreply@yourdomain.com
MAILGUN_FROM_NAME=MindDumper

# Trial System Configuration  
CRON_SECRET=your_secure_random_string_for_cron_protection
```

### Mailgun Setup

1. **Create Mailgun Account**
   - Sign up at https://mailgun.com
   - Add and verify your sending domain
   - Get your API key from the dashboard

2. **Domain Configuration**
   - Add DNS records for your domain in Mailgun
   - Verify domain ownership
   - Use format: `mg.yourdomain.com` as MAILGUN_DOMAIN

3. **API Key**
   - Find your API key in Mailgun dashboard
   - Format: `key-[random letters and numbers]`
   - Add to MAILGUN_API_KEY environment variable

### Cron Job Security

1. **Generate CRON_SECRET**
   ```bash
   # Generate a secure random string (example methods):
   openssl rand -base64 32
   # or use any password generator for a strong random string
   ```

2. **Vercel Cron Configuration**
   - The cron job is already configured in `vercel.json`
   - Runs daily at 10:00 AM UTC
   - Endpoint: `/api/cron/trial-reminders`
   - Protected by CRON_SECRET verification

### Database Migration

The trial system requires database changes that have been implemented in:
- `/supabase/migrations/add_trial_functionality.sql`

Apply this migration to your Supabase project:
```sql
-- Run the migration file in your Supabase SQL editor
```

### Testing Setup

1. **Local Development**
   ```bash
   npm run dev
   # Test trial signup at: http://localhost:3000/try-free
   ```

2. **Email Testing**
   - Use a real email address for testing
   - Check Mailgun logs for delivery status
   - Verify all email templates render correctly

3. **Cron Job Testing**
   ```bash
   # Test the cron endpoint manually (replace with your secret):
   curl -X POST http://localhost:3000/api/cron/trial-reminders \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer your_cron_secret"
   ```

### Production Deployment

1. **Environment Variables**
   - Add all variables to your Vercel environment settings
   - Or add to your production `.env` file

2. **Domain Setup**
   - Ensure Mailgun domain is properly configured
   - Test email delivery from production environment

3. **Monitoring**
   - Monitor Mailgun dashboard for email delivery stats
   - Check Vercel function logs for cron job execution
   - Monitor trial signup metrics in your analytics

### Security Notes

- Keep CRON_SECRET secure and unique
- Use environment variables for all sensitive data
- Mailgun API key should never be exposed in client-side code
- All email endpoints are server-side only for security

### Trial Flow Summary

1. User visits `/try-free` and enters email
2. User receives magic link via Mailgun
3. User clicks link and automatically logs in
4. Trial expires after 14 days
5. Email reminders sent at 3 days, 1 day, and expiry
6. Expired users redirected to `/upgrade` page