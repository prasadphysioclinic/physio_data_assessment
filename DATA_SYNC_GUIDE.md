# 🔄 Data Synchronization Guide

## How PhysioTrack Syncs with Google Sheets

Your PhysioTrack application is configured to **always show the latest data** from your Google Sheet, even if you manually edit the sheet.

### ✅ What's Configured:

1. **Force Dynamic Rendering** (`export const dynamic = 'force-dynamic'`)
   - Pages never use cached data
   - Every page load fetches fresh data from Google Sheets

2. **Zero Revalidation** (`export const revalidate = 0`)
   - Data is never cached
   - Always fetches the most recent data

3. **Direct Google Sheets Integration**
   - Uses Apps Script to read/write data
   - No intermediate database
   - Changes in Google Sheets appear immediately

### 🔄 How to See Updated Data:

#### Method 1: Automatic Refresh (Recommended)
1. Edit data in your Google Sheet
2. Go to http://localhost:3000
3. Click the **"Refresh" button** in the dashboard
4. Updated data will appear immediately

#### Method 2: Page Reload
1. Edit data in your Google Sheet
2. Refresh your browser (F5 or Ctrl+R)
3. Updated data will load automatically

#### Method 3: Navigate Away and Back
1. Edit data in your Google Sheet
2. Click to another page (e.g., "New Assessment")
3. Click "Dashboard" to return
4. Fresh data will be loaded

### 📊 What You Can Edit in Google Sheets:

You can manually edit ANY field in your Google Sheet, including:
- ✅ Patient Name
- ✅ Age
- ✅ Occupation
- ✅ Mechanism of Injury
- ✅ Pain scores
- ✅ Test results
- ✅ Any other field

**All changes will appear in the dashboard and detail pages!**

### ⚡ Real-Time Sync Workflow:

```
┌─────────────────────┐
│  Edit Google Sheet  │
│  (Change any data)  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Click "Refresh"    │
│  in Dashboard       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Apps Script Reads  │
│  Latest Sheet Data  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Dashboard Updates  │
│  with New Data      │
└─────────────────────┘
```

### 🎯 Example Scenario:

**Scenario**: You want to update Sarah Johnson's age from 42 to 43

1. **Open Google Sheet**
   - Find Sarah Johnson's row
   - Change Age column from 42 to 43
   - Google Sheets auto-saves

2. **Update Dashboard**
   - Go to http://localhost:3000
   - Click the "Refresh" button
   - Sarah's age now shows as 43

3. **View Details**
   - Click "View" for Sarah Johnson
   - Detail page shows age as 43
   - All other data is also current

### 📝 Important Notes:

1. **Column Names Must Match**
   - Don't change column header names in Google Sheet
   - Column order doesn't matter, but names must be exact
   - See `COLUMN_HEADERS.md` for the correct names

2. **Data Format**
   - Keep data types consistent (numbers as numbers, text as text)
   - Dates should be in YYYY-MM-DD format
   - Empty cells will show as "N/A" in the app

3. **Multiple Users**
   - If multiple people edit the sheet, everyone sees the same data
   - Last edit wins (Google Sheets behavior)
   - Use Google Sheets version history if needed

### 🔧 Technical Details:

**How it works:**
1. Dashboard loads → Calls `getFromGoogleSheet()`
2. Apps Script `doGet()` function executes
3. Reads all rows from Google Sheet
4. Returns data as JSON
5. Dashboard displays the data

**Cache Settings:**
```typescript
export const dynamic = 'force-dynamic';  // Never use cached pages
export const revalidate = 0;             // Never cache data
```

### 🚀 Best Practices:

1. **Use the Refresh Button**
   - Click "Refresh" after editing the sheet
   - Faster than full page reload
   - Keeps your search/filter state

2. **Edit in Google Sheets for Bulk Changes**
   - Use Google Sheets for mass updates
   - Use formulas, find/replace, etc.
   - All changes sync to the app

3. **Use the App for New Entries**
   - Better data validation
   - Consistent formatting
   - Automatic timestamps

4. **Keep a Backup**
   - Google Sheets has version history
   - File → Version history → See version history
   - Restore previous versions if needed

### ✅ Verification:

To verify data sync is working:

1. **Test Edit**:
   - Change a patient's name in Google Sheet
   - Click "Refresh" in dashboard
   - Verify the name changed

2. **Test New Entry**:
   - Add a new row manually in Google Sheet
   - Click "Refresh" in dashboard
   - New patient should appear

3. **Test Delete**:
   - Delete a row in Google Sheet
   - Click "Refresh" in dashboard
   - Patient should disappear from list

---

**Your data is always in sync with Google Sheets!** 🎉

Any questions? Check the main README.md or COMPLETE_SETUP_GUIDE.md
