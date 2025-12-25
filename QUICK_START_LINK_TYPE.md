# Quick Start: Material Link Type System

## 🚀 Quick Setup (3 Steps)

### Step 1: Run Database Migration
Open your Supabase SQL Editor and run:
```sql
-- File: add-link-type-to-materials.sql
ALTER TABLE materials ADD COLUMN IF NOT EXISTS link_type VARCHAR(50);
ALTER TABLE materials ADD CONSTRAINT check_link_type 
CHECK (link_type IN ('notes', 'question-bank', 'practice-papers', 'revision', 'formula-sheet', 'concept-map', 'video-notes', 'solved-examples', 'previous-year', 'mock-test'));
CREATE INDEX IF NOT EXISTS idx_materials_link_type ON materials(link_type);
UPDATE materials SET link_type = 'notes' WHERE link_type IS NULL;
```

### Step 2: Verify Changes
The following files have been updated:
- ✅ `app/admin/page.js` - Admin panel with link type field
- ✅ `app/materials/page.js` - Materials page with link type display
- ✅ `app/api/admin/materials/route.js` - API already supports it

### Step 3: Test It Out
1. Go to `/admin` in your app
2. Click "Add Material"
3. You'll see a new "Material Type (Link Type)" dropdown
4. Select a type and create a material
5. The link type badge will appear on the material card

## 📋 Available Link Types

| Value | Display Label | Use Case |
|-------|--------------|----------|
| `notes` | Notes | Regular study notes |
| `question-bank` | Question Bank | Practice questions |
| `practice-papers` | Practice Papers | Practice tests |
| `revision` | Revision Material | Quick revision |
| `formula-sheet` | Formula Sheet | Formula references |
| `concept-map` | Concept Map | Visual concepts |
| `video-notes` | Video Notes | Video-based learning |
| `solved-examples` | Solved Examples | Worked solutions |
| `previous-year` | Previous Year Papers | Past exam papers |
| `mock-test` | Mock Test | Full mock tests |

## 🎨 Visual Changes

### Admin Panel
- New dropdown field in material form
- Link type badge on material cards (indigo-blue gradient)
- Badge positioned below subject badge

### Materials Page (User View)
- Link type badge displayed on each material
- Stacked with subject badge for clean layout
- Visible in both grid and list views

## 🔧 How to Use

### Creating a Material
```javascript
// The form now includes:
{
  title: "Physics Chapter 1",
  subject: "Physics",
  class: "Class 11",
  link_type: "notes",  // ← NEW FIELD
  // ... other fields
}
```

### Filtering by Link Type (Optional Enhancement)
```javascript
// Add to materials page if needed:
const filteredByType = materials.filter(m => 
  selectedLinkType === 'All' || m.link_type === selectedLinkType
)
```

## ✅ What's Working

- ✅ Database column added with constraints
- ✅ Admin form includes link type selector
- ✅ Link type saved when creating materials
- ✅ Link type updated when editing materials
- ✅ Visual badge displays on material cards
- ✅ API endpoints handle link_type field
- ✅ User-facing materials page shows link type

## 🎯 Next Steps (Optional)

1. **Add Filtering**: Let users filter materials by link type
2. **Analytics**: Track popular link types
3. **Search**: Include link type in search functionality
4. **Bulk Update**: Add tool to update multiple materials at once

## 🐛 Troubleshooting

**Link type not showing?**
- Check database migration completed
- Verify material has link_type value
- Refresh the page

**Can't save material?**
- Ensure link_type value is valid
- Check database constraint is active
- Review browser console for errors

**Badge not displaying?**
- Verify linkTypes array is defined
- Check material.link_type has a value
- Inspect element for CSS issues

## 📝 Example Material Object

```json
{
  "id": "uuid-here",
  "title": "Mechanics Notes",
  "description": "Complete mechanics chapter",
  "subject": "Physics",
  "class": "Class 11",
  "link_type": "notes",
  "pdf_url": "https://...",
  "thumbnail_url": "https://...",
  "is_free": true,
  "price": 0,
  "downloads": 0
}
```

## 🎉 You're Done!

The link type system is now fully implemented. Start adding materials with proper categorization!
