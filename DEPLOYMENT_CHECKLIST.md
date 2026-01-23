# Pulse Deployment Checklist

Complete this checklist before launching Pulse to production.

## ✅ Environment Variables

### Required Variables
- [ ] `VITE_SUPABASE_URL` - Your Supabase project URL
- [ ] `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key (client-side safe)
- [ ] `SUPABASE_SERVICE_KEY` - Supabase service role key (server-side only)
- [ ] `STRIPE_SECRET_KEY` - Stripe secret key for payment processing
- [ ] `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- [ ] `VITE_STRIPE_PRO_PRICE_ID` - Stripe Price ID for Pro subscription

### Setting Environment Variables

**In Tempo Platform:**
Go to Project Settings → Update environment variables

**For Local Development:**
```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env with your actual keys
nano .env
```

**For Production (Vercel/Netlify):**
Add all variables in the hosting platform's environment settings.

---

## 🗄️ Database Setup

### 1. Run Migrations
```bash
# From Tempo AI Chat or command line:
supabase db push
```

This will create:
- `waitlist` table - stores email signups with tiers, referrals, UTM tracking
- `subscriptions` table - stores Stripe subscription data
- `webhook_events` table - logs all Stripe webhook events
- `users` table - user accounts synced from auth

### 2. Verify Tables Created
- [ ] Check Supabase Dashboard → Table Editor
- [ ] Confirm `waitlist` table has auto-increment `waitlist_number`
- [ ] Confirm `subscriptions` table has proper indexes

---

## ⚡ Edge Functions Deployment

Deploy all edge functions to Supabase:

```bash
# Option 1: From Tempo AI Chat (preferred)
# Already deployed via supabaseDeployEdgeFunctionTool

# Option 2: Manual deployment
supabase functions deploy join-waitlist
supabase functions deploy create-checkout
supabase functions deploy payments-webhook
supabase functions deploy get-plans
```

### Verify Functions
- [ ] Navigate to Supabase Dashboard → Edge Functions
- [ ] Confirm all 4 functions are deployed and active
- [ ] Test `join-waitlist` with a test email
- [ ] Test `create-checkout` (will fail without Stripe keys, but should not error on missing function)

---

## 💳 Stripe Configuration

### 1. Create Products and Prices
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to Products → Create Product
3. Create "Pulse Pro" product:
   - **Name**: Pulse Pro
   - **Description**: Professional live streaming with unlimited effects
   - **Price**: $9.99/month (recurring)
   - **Billing Period**: Monthly
4. Copy the **Price ID** (starts with `price_`) and set as `VITE_STRIPE_PRO_PRICE_ID`

### 2. Configure Webhook
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. **Endpoint URL**: `https://[your-project-ref].supabase.co/functions/v1/payments-webhook`
4. **Events to listen for**:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Signing Secret** and set as `STRIPE_WEBHOOK_SECRET`

### 3. Test Stripe Integration
- [ ] Use [Stripe Test Mode](https://stripe.com/docs/testing) with test card `4242 4242 4242 4242`
- [ ] Complete a test checkout for Pro tier
- [ ] Verify webhook events appear in Supabase `webhook_events` table
- [ ] Verify subscription appears in `subscriptions` table
- [ ] Verify waitlist entry is updated with `stripe_checkout_session_id`

---

## 🎨 Frontend Deployment

### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Configuration:
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Option 2: Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

Configuration:
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`

### Post-Deployment Checks
- [ ] Landing page loads correctly at your domain
- [ ] All sections scroll smoothly
- [ ] Waitlist form submits successfully
- [ ] Pro tier redirects to Stripe Checkout
- [ ] Success page displays after payment
- [ ] Mobile responsiveness works
- [ ] Animations and effects load properly

---

## 🔧 Final Configuration

### Update Origin URLs
After deploying, update the following with your production domain:

1. **Supabase Allowed Origins**:
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Add your production domain to "Site URL" and "Redirect URLs"

2. **Stripe Redirect URLs**:
   - Edge function `create-checkout` automatically uses request origin
   - No changes needed

3. **CORS Configuration**:
   - Edge functions already have `Access-Control-Allow-Origin: *`
   - Tighten this in production if needed

---

## 📊 Analytics & Monitoring (Optional)

### Add Analytics
```tsx
// In src/components/pages/home.tsx
import { useEffect } from 'react';

useEffect(() => {
  // Google Analytics
  window.gtag?.('event', 'page_view', {
    page_title: 'Pulse Landing',
    page_location: window.location.href
  });
  
  // Plausible, Fathom, or your preferred analytics
}, []);
```

### Monitoring
- [ ] Set up Sentry or LogRocket for error tracking
- [ ] Monitor Supabase logs for edge function errors
- [ ] Set up Stripe Dashboard alerts for failed payments
- [ ] Create Google Analytics goals for:
  - Waitlist signups
  - Pro tier conversions
  - Page scrolls to pricing section

---

## 🚀 Launch Day

### Pre-Launch Checklist
- [ ] All environment variables set in production
- [ ] Database migrations run successfully
- [ ] Edge functions deployed and responding
- [ ] Stripe webhook receiving events
- [ ] Test complete user flow end-to-end
- [ ] Mobile experience tested on real devices
- [ ] Cross-browser testing (Chrome, Safari, Firefox, Edge)
- [ ] Performance audit (Lighthouse score >90)
- [ ] SEO meta tags verified
- [ ] Social share previews working (Twitter/Facebook cards)

### Post-Launch
- [ ] Monitor error logs in Supabase
- [ ] Check Stripe Dashboard for test vs live mode
- [ ] Verify email notifications work (if implemented)
- [ ] Monitor waitlist signups in real-time
- [ ] Track conversion rates (free vs pro)
- [ ] Set up weekly digest of key metrics

---

## 📞 Support

If you encounter issues during deployment:

1. **Check Supabase Logs**: Dashboard → Logs → Edge Functions
2. **Check Stripe Webhook Logs**: Dashboard → Developers → Webhooks → [your endpoint]
3. **Verify Environment Variables**: Hosting platform settings
4. **Test Locally**: Run `npm run dev` and test all flows

---

## 🎉 You're Live!

Once all items are checked, Pulse is ready for production. Share your landing page and start building your waitlist!

**Next Steps:**
- Share on Product Hunt, Twitter, LinkedIn
- Engage with early signups
- Collect feedback on messaging and design
- Iterate on conversion optimization

Good luck with your launch! 🚀
