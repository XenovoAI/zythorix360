# Tests Feature Setup Guide

## Overview
The tests feature has been successfully integrated into your Zythorix360 platform. Users can now download test PDFs instead of taking online tests.

## What's Been Done

### 1. Database Setup
- Created `create-tests-table.sql` with:
  - `tests` table for storing test information
  - `test_downloads` table for tracking downloads
  - RLS policies for security
  - Sample test data

### 2. Frontend Updates

#### Tests Page (`app/tests/page.js`)
- Changed from "Start Test" to "Download PDF" functionality
- Shows download count alongside attempts
- Displays price for paid tests
- Free tests show "Download Free" button
- Paid tests show price and "Download PDF" button
- Tracks downloads in database
- Opens PDF in new tab when downloaded

#### Admin Panel (`app/admin/page.js`)
- Added tabs to switch between Materials and Tests
- New test management section with:
  - Create/Edit/Delete tests
  - Upload PDF and thumbnail
  - Set category (NEET, JEE, Physics, Chemistry, Biology, Mathematics)
  - Set difficulty (Easy, Medium, Hard)
  - Set duration and number of questions
  - Toggle free/paid status
  - Set price for paid tests
- Real-time stats showing total tests count
- Live updates when tests are added/modified

### 3. API Routes
- Created `app/api/admin/tests/route.js` for:
  - GET: Fetch all tests
  - POST: Create new test
  - PUT: Update existing test
  - DELETE: Remove test
  - Admin authentication required

### 4. Contact Page
- Updated email to: abhi@zythorix360.com

## Setup Instructions

### Step 1: Run Database Migration
```sql
-- Run this in your Supabase SQL Editor
-- File: create-tests-table.sql
```

This will create:
- `tests` table
- `test_downloads` table
- Necessary indexes and policies
- Sample test data

### Step 2: Upload Test PDFs
1. Go to Supabase Storage
2. Use the existing `materials-pdfs` bucket
3. Create a `tests` folder
4. Upload your test PDFs there

### Step 3: Upload Thumbnails
1. Go to Supabase Storage
2. Use the existing `materials-thumbnails` bucket
3. Create a `tests` folder
4. Upload test thumbnail images

### Step 4: Add Tests via Admin Panel
1. Login as admin (abhi@zythorix360.com)
2. Go to `/admin`
3. Click the "Tests" tab
4. Click "Add Test"
5. Fill in:
   - Title
   - Description
   - Category (NEET/JEE/Physics/etc.)
   - Difficulty (Easy/Medium/Hard)
   - Duration (in minutes)
   - Number of questions
   - Upload PDF file
   - Upload thumbnail image
   - Toggle Free/Paid
   - Set price if paid
6. Click "Add Test"

## Features

### For Users
- Browse tests by category
- See test details (duration, questions, difficulty)
- Download free tests instantly
- Purchase and download paid tests
- Track download history
- View test statistics

### For Admins
- Full CRUD operations on tests
- Upload PDFs and thumbnails
- Set pricing
- Track downloads and attempts
- Real-time statistics
- Easy management interface

## Database Schema

### tests table
```sql
- id (UUID, primary key)
- title (VARCHAR)
- description (TEXT)
- category (VARCHAR) - NEET, JEE, Physics, Chemistry, Biology, Mathematics
- difficulty (VARCHAR) - Easy, Medium, Hard
- duration (INTEGER) - in minutes
- questions (INTEGER)
- pdf_url (TEXT)
- thumbnail_url (TEXT)
- is_free (BOOLEAN)
- price (INTEGER)
- attempts (INTEGER)
- downloads (INTEGER)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### test_downloads table
```sql
- id (UUID, primary key)
- user_id (UUID, foreign key)
- user_email (VARCHAR)
- test_id (UUID, foreign key)
- test_title (VARCHAR)
- test_type (VARCHAR) - free or paid
- payment_id (UUID, foreign key, optional)
- downloaded_at (TIMESTAMP)
```

## Payment Integration

Tests use the same payment system as materials:
- Free tests: Download immediately
- Paid tests: Require purchase first
- Purchase records stored in `purchases` table
- Payment tracking via Razorpay

## Next Steps

1. Run the database migration
2. Upload test PDFs to storage
3. Add tests via admin panel
4. Test the download functionality
5. Monitor downloads and user engagement

## Notes

- Tests and materials share the same storage buckets
- Admin authentication uses the same system
- RLS policies ensure data security
- Real-time subscriptions keep data fresh
- Download tracking helps with analytics

## Support

If you encounter any issues:
1. Check Supabase logs
2. Verify storage bucket permissions
3. Ensure admin email is configured
4. Check browser console for errors
