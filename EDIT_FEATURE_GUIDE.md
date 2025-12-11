# 📝 Edit Assessment Feature - Setup Guide

## 🎉 New Feature: Edit Existing Assessments!

You can now edit assessments if you made a mistake or need to update patient information!

### ✅ What's New:

1. **Edit Button** - On each assessment detail page
2. **Edit Form** - Pre-filled with existing data
3. **Update Functionality** - Saves changes back to Google Sheets
4. **Seamless Workflow** - Edit → Save → View updated details

---

## 🔧 IMPORTANT: Update Your Apps Script

**You MUST update your Google Apps Script for the edit feature to work!**

### Step-by-Step Instructions:

1. **Open Your Google Sheet**
   - Go to your PhysioTrack Google Sheet

2. **Open Apps Script**
   - Click **Extensions** → **Apps Script**

3. **Replace the Code**
   - Select ALL existing code (Ctrl+A)
   - Delete it
   - Open `scripts/google-apps-script.js` in your project
   - Copy ALL the code from that file
   - Paste it into the Apps Script editor

4. **Deploy the Update**
   - Click **Deploy** → **Manage deployments**
   - Click the **Edit** button (pencil icon) next to your existing deployment
   - Under "Version", select **"New version"**
   - Click **Deploy**
   - You should see "Deployment successfully updated"

5. **Done!**
   - Close the Apps Script tab
   - Your edit feature is now ready!

---

## 🚀 How to Use the Edit Feature:

### Editing an Assessment:

1. **Go to Dashboard**
   - Navigate to http://localhost:3000

2. **View Assessment**
   - Click "View" on any patient

3. **Click Edit Button**
   - You'll see an "Edit Assessment" button at the top right
   - Click it

4. **Edit the Form**
   - The form will be pre-filled with existing data
   - Change any fields you want:
     - Patient name, age, occupation
     - Mechanism of injury
     - Pain scores
     - Any other field

5. **Save Changes**
   - Click "Update Assessment" button at the bottom
   - Wait for "Assessment updated successfully!" message

6. **View Updated Data**
   - You'll be redirected back to the detail page
   - All changes are now visible
   - Changes are also saved in Google Sheet!

---

## 📊 Example Workflow:

**Scenario**: You entered Sarah Johnson's age as 42, but it should be 43.

1. Dashboard → Click "View" for Sarah Johnson
2. Click "Edit Assessment" button
3. Change Age from "42" to "43"
4. Change any other fields if needed
5. Click "Update Assessment"
6. See success message
7. View page shows age as 43
8. Check Google Sheet - Row is updated with age 43!

---

## 🔄 How It Works:

```
┌──────────────────┐
│  Click Edit      │
│  Button          │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Form Loads      │
│  with Existing   │
│  Data            │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Make Changes    │
│  to Any Fields   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Click Update    │
│  Assessment      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  API Sends       │
│  Update Request  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Apps Script     │
│  Updates Row in  │
│  Google Sheet    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Success!        │
│  View Updated    │
│  Details         │
└──────────────────┘
```

---

## 🎯 What Gets Updated:

When you edit an assessment, the following happens:

1. **Google Sheet Row Updated**
   - The specific row in your Google Sheet is updated
   - All fields are overwritten with new values
   - Timestamp is updated to current time
   - "SubmittedBy" shows "System (Updated)"

2. **Dashboard Reflects Changes**
   - Click "Refresh" button to see changes
   - Or reload the page

3. **Detail Page Shows New Data**
   - Immediately after saving
   - All cards show updated information

---

## ⚠️ Important Notes:

### 1. **Row Index Stays the Same**
   - Editing doesn't create a new row
   - It updates the existing row in Google Sheet
   - The assessment ID (index) doesn't change

### 2. **All Fields Are Updated**
   - Even if you only change one field
   - All fields are re-saved to the sheet
   - Empty fields will remain empty

### 3. **Timestamp Updates**
   - The "Timestamp" column updates to current time
   - Original submission time is lost
   - Consider this when editing

### 4. **No Undo**
   - Once you save, changes are permanent
   - Use Google Sheets version history if needed:
     - File → Version history → See version history

---

## 🧪 Testing the Edit Feature:

### Test 1: Simple Edit
1. Go to any assessment detail page
2. Click "Edit Assessment"
3. Change the patient's age
4. Click "Update Assessment"
5. Verify age changed on detail page
6. Check Google Sheet - age should be updated

### Test 2: Multiple Fields
1. Edit an assessment
2. Change name, age, and occupation
3. Save
4. Verify all three fields updated

### Test 3: Pain Score
1. Edit an assessment
2. Move the VAS pain slider
3. Save
4. Verify pain score updated

---

## 🐛 Troubleshooting:

### Error: "Failed to update assessment"

**Solution 1: Check Apps Script**
- Did you update the Apps Script code?
- Did you deploy a new version?
- Go to Apps Script → Deploy → Manage deployments
- Verify deployment is active

**Solution 2: Check Console**
- Press F12 in browser
- Look for error messages
- Common issues:
  - "action is not defined" → Apps Script not updated
  - "rowIndex not found" → Apps Script not updated

### Edit Button Not Showing

**Solution:**
- Refresh the page (F5)
- Clear browser cache
- Restart dev server:
  - Press Ctrl+C in terminal
  - Run `npm run dev` again

### Changes Not Saving to Google Sheet

**Solution:**
- Check Apps Script execution log:
  - Apps Script → Executions (left sidebar)
  - Look for errors
  - Check if `handleUpdate` function ran

---

## 📚 Related Documentation:

- **DATA_SYNC_GUIDE.md** - How data syncs with Google Sheets
- **COMPLETE_SETUP_GUIDE.md** - Full setup instructions
- **README.md** - Project overview

---

## ✅ Feature Summary:

Your PhysioTrack system now supports:

1. ✅ **Create** new assessments
2. ✅ **View** assessment details
3. ✅ **Edit** existing assessments (NEW!)
4. ✅ **Search** for patients
5. ✅ **Refresh** data from Google Sheets
6. ✅ **Sync** with Google Sheets backend

**You have a complete CRUD (Create, Read, Update) system!** 🎉

---

**Questions?** Check the other documentation files or the browser console for error messages.
