# Zythorix360 Deployment Guide

## Prerequisites

- Node.js 18+ installed
- Supabase account
- Razorpay account
- Vercel account (for deployment)
- Domain name (optional)

## Step 1: Supabase Setup

1. **Create New Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Name: "zythorix360"
   - Choose your region
   - Set a strong database password

2. **Database Migration**
   - Go to SQL Editor in Supabase dashboard
   - Copy and paste the content from `database-migration.sql`
   - Click "Run" to execute the migration

3. **Get API Keys**
   - Go to Settings > API
   - Copy the Project URL and anon key
   - Copy the service_role key (keep this secret!)

## Step 2: Razorpay Setup

1. **Create Account**
   - Sign up at [razorpay.com](https://razorpay.com)
   - Complete KYC verification

2. **Get API Keys**
   - Go to Settings > API Keys
   - Generate new key pair
   - Copy Key ID and Key Secret
   - Start with test mode, switch to live later

## Step 3: Environment Configuration

1. **Create Environment File**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Update Variables**
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

   # Razorpay
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your-key-id
   RAZORPAY_KEY_SECRET=your-secret-key

   # App
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

## Step 4: Local Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Test the Application**
   - Open http://localhost:3000
   - Test user registration/login
   - Test material browsing
   - Test payment flow (test mode)

## Step 5: Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy to Vercel**
   ```bash
   vercel
   ```
   - Choose "No" for existing project
   - Project name: "zythorix360"
   - Directory: "./"
   - Override settings: "No"

3. **Add Environment Variables**
   - Go to Vercel dashboard
   - Select your project
   - Go to Settings > Environment Variables
   - Add all variables from `.env.local`
   - Make sure to update `NEXT_PUBLIC_APP_URL` to your Vercel URL

4. **Redeploy**
   ```bash
   vercel --prod
   ```

## Step 6: Domain Configuration (Optional)

1. **Purchase Domain**
   - Buy `zythorix360.com` from any registrar

2. **Configure in Vercel**
   - Go to project settings
   - Click "Domains"
   - Add custom domain: `www.zythorix360.com`
   - Follow DNS configuration instructions

3. **Update Environment Variables**
   - Change `NEXT_PUBLIC_APP_URL` to `https://www.zythorix360.com`
   - Redeploy the application

## Step 7: Production Configuration

1. **Switch Razorpay to Live Mode**
   - Generate live API keys in Razorpay dashboard
   - Update environment variables in Vercel
   - Test payment flow thoroughly

2. **Configure Google Analytics (Optional)**
   - Create GA4 property
   - Get tracking ID
   - Add `NEXT_PUBLIC_GA_ID` environment variable

3. **Set up Monitoring**
   - Monitor Supabase usage and billing
   - Set up Vercel analytics
   - Monitor Razorpay transactions

## Step 8: Content Management

1. **Add Study Materials**
   - Use Supabase dashboard or admin panel
   - Upload PDFs to storage
   - Create material records in database

2. **Configure Pricing**
   - Set material prices
   - Create coupon codes
   - Set up influencer accounts

## Step 9: Testing Checklist

- [ ] User registration works
- [ ] User login works
- [ ] Password reset works
- [ ] Material browsing works
- [ ] Free material downloads work
- [ ] Payment flow works (test mode)
- [ ] Paid material downloads work
- [ ] Coupon system works
- [ ] Admin panel accessible
- [ ] Mobile responsive design
- [ ] All pages load correctly
- [ ] SEO meta tags present

## Step 10: Go Live

1. **Final Testing**
   - Test all functionality on production URL
   - Verify payment flow with small test transaction

2. **Launch**
   - Switch Razorpay to live mode
   - Update all references to production URL
   - Submit sitemap to Google Search Console

3. **Monitor**
   - Watch for errors in Vercel dashboard
   - Monitor Supabase usage
   - Check payment transactions

## Troubleshooting

### Common Issues

1. **Build Errors**
   - Check all environment variables are set
   - Verify API keys are correct
   - Check for syntax errors in code

2. **Database Connection Issues**
   - Verify Supabase URL and keys
   - Check RLS policies are correctly set
   - Ensure database migration completed

3. **Payment Issues**
   - Verify Razorpay keys are correct
   - Check webhook configuration
   - Test in sandbox mode first

### Support

- Supabase: [docs.supabase.com](https://docs.supabase.com)
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Razorpay: [razorpay.com/docs](https://razorpay.com/docs)

## Maintenance

### Regular Tasks

- Monitor application performance
- Update dependencies monthly
- Backup database regularly
- Review and update content
- Monitor payment transactions
- Check for security updates

### Scaling Considerations

- Monitor Supabase usage limits
- Consider CDN for static assets
- Implement caching strategies
- Monitor and optimize database queries
- Consider load balancing for high traffic