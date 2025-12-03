# Fix All Errors - Step by Step Guide

## Current Errors:
1. ❌ 406 Error on purchases query (RLS blocking)
2. ❌ 500 Error on payment API (Razorpay issue)
3. ⚠️ Logo.png missing (harmless warning)

## STEP 1: Fix RLS Policy (CRITICAL)

### Go to Supabase SQL Editor:
https://app.supabase.com/project/shjyvgsvyjscmlwccnax/sql/new

### Copy and paste this SQL:

```sql
-- Fix RLS Policies for Purchases Table

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own purchases" ON purchases;
DROP POLICY IF EXISTS "Users can insert own purchases" ON purchases;
DROP POLICY IF EXISTS "Service role full access purchases" ON purchases;
DROP POLICY IF EXISTS "Authenticated users can check purchases" ON purchases;

-- Create new policies
-- 1. Users can view their own purchases
CREATE POLICY "Users can view own purchases" 
ON purchases FOR SELECT 
USING (auth.uid() = user_id);

-- 2. Users can insert their own purchases
CREATE POLICY "Users can insert own purchases" 
ON purchases FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 3. Service role has full access
CREATE POLICY "Service role full access purchases" 
ON purchases FOR ALL 
USING (auth.role() = 'service_role');

-- 4. Authenticated users can check purchases (IMPORTANT!)
CREATE POLICY "Authenticated users can check purchases" 
ON purchases FOR SELECT 
USING (auth.role() = 'authenticated');

SELECT 'Purchases RLS policies fixed!' as status;
```

### Click "RUN" button

This will fix the 406 error!

## STEP 2: Verify Environment Variables

### Stop your dev server (Ctrl+C)

### Check if .env.local has the keys:

Open `.env.local` and verify these lines exist:
```
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_Rn45LNkmwvfs8A
RAZORPAY_KEY_SECRET=wL87KJflQgvVwDkXKky8EpUv
```

## STEP 3: Restart Dev Server

```bash
npm run dev
```

## STEP 4: Check Terminal Output

When you restart, look for:
- "Initializing Razorpay with key: rzp_live_..."
- Any error messages about Razorpay

## STEP 5: Test Payment

1. Login to website
2. Go to materials page
3. Click "Buy Now" on a paid material
4. Watch terminal for logs:
   - "Initializing Razorpay..."
   - "Creating order for material..."
   - "Order created successfully..."

## If Payment API Still Fails:

### Check Terminal Error Message

Look for specific error like:
- "Razorpay keys not configured" → Keys missing
- "Invalid key" → Wrong Razorpay keys
- "Network error" → Internet/Razorpay API issue

### Verify Razorpay Keys

1. Go to Razorpay Dashboard
2. Settings → API Keys
3. Verify the keys match your .env.local

### Test with Simple Material

1. Create a test material with price ₹1
2. Try to purchase it
3. Check terminal logs

## Fix Logo Warning (Optional)

Create a simple logo.png:
1. Create 512x512px image
2. Save as `public/logo.png`
3. Or remove logo from `app/manifest.js`

## Expected Flow After Fixes:

1. ✅ Click "Buy Now"
2. ✅ Terminal shows: "Initializing Razorpay..."
3. ✅ Terminal shows: "Creating order..."
4. ✅ Terminal shows: "Order created successfully"
5. ✅ Razorpay modal opens
6. ✅ Complete payment
7. ✅ Success message
8. ✅ Material available for download

## Troubleshooting:

### 406 Error Still There?
- Run the SQL script again
- Make sure you clicked "RUN"
- Check Supabase → Authentication → Policies

### 500 Error Still There?
- Check terminal for exact error
- Verify Razorpay keys are correct
- Try restarting dev server
- Check if razorpay package is installed: `npm list razorpay`

### Razorpay Modal Not Opening?
- Check browser console
- Verify NEXT_PUBLIC_RAZORPAY_KEY_ID is set
- Check internet connection

## Quick Test Commands:

```bash
# Check if Razorpay is installed
npm list razorpay

# Should show: razorpay@2.9.6

# Restart dev server
npm run dev

# Check environment variables (in Node.js)
node -e "console.log(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID)"
```

## Summary:

1. **RUN THE SQL SCRIPT** in Supabase (most important!)
2. **VERIFY .env.local** has Razorpay keys
3. **RESTART dev server**
4. **TEST payment** and check terminal logs

The main issue is the RLS policy - once you run that SQL, the 406 error will be fixed and payment should work!
