# Quick Fix for Current Errors

## Errors Found:
1. ✅ Manifest 500 error (harmless - logo.png missing)
2. ❌ Purchases 406 error (RLS policy issue)
3. ❌ Payment API 500 error (needs investigation)

## Fix Steps:

### 1. Fix Purchases RLS Policy (REQUIRED)
Run this SQL in Supabase SQL Editor:

```sql
-- Copy content from: fix-purchases-rls.sql
```

This will allow users to check if they've purchased a material.

### 2. Restart Dev Server
```bash
# Stop current server (Ctrl+C)
npm run dev
```

### 3. Test Payment Flow
1. Login to website
2. Try to purchase a paid material
3. Check browser console for errors
4. Check terminal for API errors

## If Payment Still Fails:

### Check Razorpay Keys:
```bash
# In terminal, verify keys are loaded:
echo $NEXT_PUBLIC_RAZORPAY_KEY_ID
```

Should show: `rzp_live_Rn45LNkmwvfs8A`

### Check API Logs:
Look in terminal for detailed error messages when clicking "Buy Now"

### Common Issues:

**Issue**: "Unauthorized" error
**Fix**: Make sure you're logged in

**Issue**: "Material not found"
**Fix**: Material ID is invalid

**Issue**: Razorpay not defined
**Fix**: Script didn't load, check internet connection

**Issue**: 406 on purchases query
**Fix**: Run `fix-purchases-rls.sql` in Supabase

## Manifest Error (Optional Fix):

The manifest error is harmless but to fix it:

1. Add a logo.png file to `/public` folder (512x512px)
2. Or remove the manifest shortcuts from `app/manifest.js`

## Testing Checklist:

- [ ] Run `fix-purchases-rls.sql` in Supabase
- [ ] Restart dev server
- [ ] Login to website
- [ ] Click "Buy Now" on paid material
- [ ] Check if Razorpay modal opens
- [ ] Complete test payment
- [ ] Verify purchase recorded in Supabase

## If All Else Fails:

1. Check terminal for exact error message
2. Check browser console for client-side errors
3. Verify environment variables are loaded
4. Check Supabase RLS policies
5. Verify Razorpay keys are correct

The main issue is the RLS policy - run the SQL fix and restart!
