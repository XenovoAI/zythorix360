# Fix Tests RLS Error - Quick Guide

## The Problem
You're getting a "new row violates row-level security policy" error when trying to add tests.

## The Solution
I've updated the code to use the service role API, which bypasses RLS policies. Here's what you need to do:

### Option 1: Use the Updated Code (Recommended)
The code has been updated to use API routes with the service role client. Just make sure you have the `SUPABASE_SERVICE_ROLE_KEY` in your `.env.local` file:

```env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

You can find this key in:
1. Go to Supabase Dashboard
2. Project Settings → API
3. Copy the "service_role" key (NOT the anon key)
4. Add it to your `.env.local` file

### Option 2: Update RLS Policies
Alternatively, run the `fix-tests-rls-policies.sql` file in your Supabase SQL Editor to allow authenticated users to manage tests.

## What Was Changed

### 1. API Route (`app/api/admin/tests/route.js`)
- Now uses `supabaseAdmin` instead of regular `supabase` client
- Bypasses RLS policies for admin operations
- Still checks admin authentication

### 2. Admin Panel (`app/admin/page.js`)
- Test operations now go through API routes
- Uses session token for authentication
- Consistent with materials management

## Testing

After adding the service role key:
1. Restart your development server
2. Login as admin
3. Go to `/admin`
4. Click "Tests" tab
5. Try adding a test

It should work now!

## Verification

Check your `.env.local` file has:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # ← This one is important!
NEXT_PUBLIC_ADMIN_EMAILS=abhi@zythorix360.com
```

## Still Having Issues?

If you still get errors:
1. Make sure you've restarted the dev server after adding the service role key
2. Check the browser console for detailed error messages
3. Verify the service role key is correct in Supabase dashboard
4. Make sure you're logged in as an admin email
