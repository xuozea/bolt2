# 🚀 Setup Guide for Queue Away

## 📋 Prerequisites

Before setting up Stripe and Supabase, make sure you have:
- A valid email address
- A phone number for verification
- Basic business information (for Stripe)

---

## 💳 Stripe Setup (Payment Processing)

### Step 1: Create Stripe Account
1. Go to [https://stripe.com](https://stripe.com)
2. Click **"Start now"** or **"Sign up"**
3. Fill in your email, full name, and create a password
4. Verify your email address

### Step 2: Complete Account Setup
1. **Business Information:**
   - Business type (Individual/Company)
   - Business address
   - Phone number
   - Website URL (optional for testing)

2. **Bank Account (for live payments):**
   - Add your bank account details
   - This is required for receiving payments

### Step 3: Get API Keys
1. Go to **Developers** → **API keys** in your Stripe Dashboard
2. Copy your **Publishable key** (starts with `pk_test_` for test mode)
3. Copy your **Secret key** (starts with `sk_test_` for test mode)

### Step 4: Add to Environment Variables
Add this to your `.env` file:
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

**⚠️ Important:** Never expose your secret key in frontend code!

---

## 🗄️ Supabase Setup (Database & Backend)

### Step 1: Create Supabase Account
1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign up with GitHub, Google, or email
4. Verify your email if using email signup

### Step 2: Create New Project
1. Click **"New Project"**
2. Choose your organization (or create one)
3. Fill in project details:
   - **Name:** `queue-away` (or your preferred name)
   - **Database Password:** Create a strong password (save this!)
   - **Region:** Choose closest to your users
   - **Pricing Plan:** Free tier is perfect for development

### Step 3: Wait for Project Setup
- Project creation takes 2-3 minutes
- You'll see a progress indicator

### Step 4: Get API Keys
1. Go to **Settings** → **API** in your project dashboard
2. Copy the following:
   - **Project URL** (looks like: `https://your-project.supabase.co`)
   - **anon public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`)

### Step 5: Add to Environment Variables
Add these to your `.env` file:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🔧 Complete Environment Variables

Your final `.env` file should look like this:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyDd6GNn9DNeGyJRDo8MbF-ihmXPr0VfRLg
VITE_FIREBASE_AUTH_DOMAIN=queue-away-xuozea.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=queue-away-xuozea
VITE_FIREBASE_STORAGE_BUCKET=queue-away-xuozea.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=980232490344
VITE_FIREBASE_APP_ID=1:980232490344:web:a98f4eee8f5489d50fdadd
VITE_FIREBASE_MEASUREMENT_ID=G-D6SEJ3D2TE
VITE_FIREBASE_VAPID_KEY=BJ_lLLI2YSHcJ_WwuyFQUowpmsOcEVvhQsflVT_NtKchfF6i9eqjeITESi_exjBnWMq-nNNfH-O92AKTQ5aBjHI

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🎯 Next Steps

### 1. Test Stripe Integration
- Use test card numbers: `4242 4242 4242 4242`
- Any future expiry date and CVC
- Test payments won't charge real money

### 2. Set Up Supabase Tables
- Create tables for your app data
- Set up Row Level Security (RLS)
- Configure authentication policies

### 3. Deploy Your App
- Build your app: `npm run build`
- Deploy to your preferred platform
- Update environment variables in production

---

## 🆘 Troubleshooting

### Stripe Issues:
- **Invalid API Key:** Make sure you're using the correct publishable key
- **CORS Errors:** Ensure your domain is added to Stripe's allowed domains
- **Test Mode:** Use test keys for development, live keys for production

### Supabase Issues:
- **Connection Failed:** Check your project URL and API key
- **RLS Errors:** Make sure Row Level Security policies are set up correctly
- **CORS Issues:** Supabase handles CORS automatically for web apps

### General Issues:
- **Environment Variables:** Restart your dev server after adding new variables
- **Build Errors:** Make sure all packages are installed: `npm install`

---

## 📚 Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [React Leaflet Documentation](https://react-leaflet.js.org/)
- [OpenStreetMap](https://www.openstreetmap.org/)

---

## ✅ Verification Checklist

- [ ] Stripe account created and verified
- [ ] Stripe publishable key added to `.env`
- [ ] Supabase project created
- [ ] Supabase URL and anon key added to `.env`
- [ ] All environment variables set correctly
- [ ] Development server restarted
- [ ] Maps are displaying correctly
- [ ] Chat system is working
- [ ] Profile page is functional

**🎉 You're all set! Your Queue Away app is now ready for development and testing.**