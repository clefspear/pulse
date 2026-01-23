# Pulse - Browser-based Live Streaming Studio

<p align="center">
  <img src="/public/logo.png" alt="Pulse Logo" width="120" height="120">
</p>

<p align="center">
  <strong>Professional live streaming. Zero cloud. Zero install.</strong>
</p>

<p align="center">
  GPU-accelerated effects running entirely in your browser using WebGPU, WebCodecs, and WASM.
</p>

---

## 🚀 Overview

Pulse is a revolutionary browser-based live streaming studio that brings professional-grade video effects to anyone with a modern browser. This repository contains the **landing page and waitlist system** for the Pulse pre-launch campaign.

### Key Features

- **🎨 Technical Brutalism Design** - Dark theme with HUD accents and coral-red brand colors
- **⚡ GPU-Accelerated** - Real-time effects at 60fps with <16ms latency
- **🔒 Zero Cloud** - All processing happens locally on your device
- **📱 Any Device** - Works on desktop, mobile, and Chromebook
- **💳 Stripe Integration** - Pre-payment for Pro tier early adopters
- **📊 Waitlist Management** - Email capture with referral tracking

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18 + Vite + TypeScript |
| **Styling** | Tailwind CSS + Custom CSS Animations |
| **Animations** | Framer Motion |
| **UI Components** | shadcn/ui (Radix primitives) |
| **Backend** | Supabase (PostgreSQL + Edge Functions) |
| **Payments** | Stripe Checkout + Webhooks |
| **Typography** | Space Grotesk, Inter, JetBrains Mono |

---

## 📁 Project Structure

```
pulse-landing/
├── src/
│   ├── components/
│   │   ├── landing/           # Landing page sections
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeaturesSection.tsx
│   │   │   ├── DemoSection.tsx
│   │   │   ├── PricingSection.tsx
│   │   │   ├── WaitlistSection.tsx
│   │   │   └── FooterSection.tsx
│   │   ├── pages/
│   │   │   ├── home.tsx       # Main landing page
│   │   │   └── success.tsx    # Payment success page
│   │   └── ui/                # Reusable UI components
│   ├── index.css              # Global styles + animations
│   └── App.tsx                # Route configuration
├── supabase/
│   ├── functions/
│   │   ├── create-checkout/   # Stripe checkout session
│   │   ├── join-waitlist/     # Waitlist signup API
│   │   ├── get-plans/         # Fetch Stripe plans
│   │   └── payments-webhook/  # Stripe webhook handler
│   └── migrations/
│       ├── initial-setup.sql  # Users, subscriptions tables
│       └── 20250123_create_waitlist.sql  # Waitlist table
└── public/
    ├── logo.png               # Pulse logo
    └── splashscreen.png       # OG image for social sharing
```

---

## 📋 User Flow

```
Landing Page → Hero Section
       ↓
  Scroll Down
       ↓
Features Section (Technical Proof Points)
       ↓
Demo Section (Interactive Preview)
       ↓
Pricing Section (Free vs Pro)
       ↓
Waitlist Section
       ↓
   ┌──────────────────┬────────────────────┐
   │                  │                    │
Free Tier          Pro Tier ($9.99/mo)
   │                  │
   ↓                  ↓
Join Waitlist    Stripe Checkout
   │                  │
   ↓                  ↓
Success State     Payment Success
   │                  │
   └──────────────────┴────────────────────┘
                  ↓
         Discord + Social Share
```

---

## 🎨 Design System

### Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Background Primary | `#1A1D29` | Main background |
| Background Secondary | `#252936` | Cards, panels |
| Accent (Coral-Red) | `#FF6B6B` | CTAs, brand |
| Highlight (Cyan) | `#00D9FF` | Data points, icons |
| Text Primary | `#F5F5F7` | Headings, primary text |
| Text Secondary | `#A0A3B1` | Descriptions, muted |
| Border | `#3A3D4A` | Card borders |

### Typography

- **Display/Headings**: Space Grotesk (700 weight)
- **Body/UI**: Inter (400, 600 weights)
- **Monospace/Code**: JetBrains Mono

### Animations

- `animate-pulse-glow` - Pulsing glow effect on CTAs
- `animate-flip` - Flip animation for counters
- `animate-gradient` - Background gradient shift (10s loop)
- `noise-texture` - Subtle noise overlay for depth

---

## 🔌 API Reference

### Join Waitlist

```typescript
POST /functions/v1/supabase-functions-join-waitlist

Body: {
  email: string;
  tier: 'free' | 'pro';
  referral_code?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

Response: {
  success: boolean;
  message: string;
  data: {
    waitlist_number: number;
    tier: string;
    referral_code: string;
  };
  total_signups: number;
}
```

### Create Checkout Session

```typescript
POST /functions/v1/supabase-functions-create-checkout

Body: {
  price_id?: string;
  user_email: string;
  return_url: string;
}

Response: {
  sessionId: string;
  url: string;
}
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Hero section loads with animations
- [ ] Scroll reveals work on all sections
- [ ] Feature cards have hover effects
- [ ] Demo section toggles work
- [ ] Pricing cards display correctly
- [ ] Free tier waitlist signup works
- [ ] Pro tier redirects to Stripe
- [ ] Success page displays after payment
- [ ] Mobile responsive design
- [ ] Social share buttons work

### Stripe Test Cards

```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
Requires Auth: 4000 0025 0000 3155
```

---

## 🚢 Deployment

### Production Checklist

1. **Environment Variables**
   - [ ] Set all production env vars
   - [ ] Update Stripe to live keys
   - [ ] Configure webhook endpoint in Stripe

2. **Stripe Setup**
   - [ ] Create Pro plan product and price
   - [ ] Configure webhook endpoint: `/functions/v1/payments-webhook`
   - [ ] Enable webhook events:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

3. **Database**
   - [ ] Run all migrations
   - [ ] Verify RLS policies (optional)
   - [ ] Set up backups

4. **Domain & SSL**
   - [ ] Configure custom domain
   - [ ] Verify SSL certificate
   - [ ] Update meta tags with final URL

5. **Analytics**
   - [ ] Add Google Analytics / Plausible
   - [ ] Set up conversion tracking
   - [ ] Configure UTM parameter tracking

---

## 📄 License

This project is proprietary software. All rights reserved.

---

<p align="center">
  WebGPU • WebCodecs • WASM • Zero Cloud
</p>
