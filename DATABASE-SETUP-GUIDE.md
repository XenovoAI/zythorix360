# Database Setup Guide for Zythorix360

## Step 1: Clear Sample Data

1. Go to your Supabase SQL Editor: https://app.supabase.com/project/shjyvgsvyjscmlwccnax/sql/new
2. Copy and paste the content from `clear-sample-data.sql`
3. Click **Run** to delete all sample materials

## Step 2: Setup Storage Buckets

1. In the same SQL Editor, create a new query
2. Copy and paste the content from `setup-storage-buckets.sql`
3. Click **Run** to create storage buckets for PDFs and thumbnails

## Step 3: Verify Storage Buckets

1. Go to **Storage** in Supabase dashboard
2. You should see two buckets:
   - `materials-pdfs` (for PDF files, 50MB limit)
   - `materials-thumbnails` (for thumbnail images, 5MB limit)

## Step 4: Upload Study Materials via Admin Panel

1. Make sure your dev server is running: `npm run dev`
2. Login with admin email: `abhi@zythorix360.com` or `theetoxi@gmail.com`
3. Go to: http://localhost:3000/admin
4. Click **Add Material** button
5. Fill in the form:
   - **Title**: Name of the study material
   - **Description**: Brief description
   - **Subject**: Physics, Chemistry, Biology, or Mathematics
   - **Class**: Class 10, 11, 12, or Dropper
   - **Free/Paid**: Toggle to set pricing
   - **Price**: Set price if paid (in ₹)
   - **PDF File**: Upload the PDF document
   - **Thumbnail**: Upload a cover image

6. Click **Add Material** to upload

## Step 5: Verify Upload

- Materials will appear on the admin dashboard
- Check the home page to see them displayed
- Real-time updates will show new materials immediately

## Storage Bucket Structure

```
materials-pdfs/
  ├── physics/
  ├── chemistry/
  ├── biology/
  └── mathematics/

materials-thumbnails/
  ├── physics/
  ├── chemistry/
  ├── biology/
  └── mathematics/
```

## Troubleshooting

### Upload Fails
- Check storage bucket policies in Supabase
- Verify file size limits (PDF: 50MB, Image: 5MB)
- Ensure you're logged in as admin

### Materials Not Showing
- Check browser console for errors
- Verify RLS policies are set correctly
- Refresh the page

### Storage Access Denied
- Run `setup-storage-buckets.sql` again
- Check that buckets are set to public
- Verify service role key in `.env.local`

## Admin Emails

Current admin emails with full access:
- abhi@zythorix360.com
- theetoxi@gmail.com

To add more admins, edit `.env.local`:
```
NEXT_PUBLIC_ADMIN_EMAILS=email1@domain.com,email2@domain.com,email3@domain.com
```

## Next Steps

1. Upload your real study materials
2. Test download functionality
3. Set up payment integration (Razorpay)
4. Configure email templates in Supabase
5. Deploy to production
