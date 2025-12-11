# 🚨 URGENT: Fix Edit Feature - Update Apps Script

## ❌ Current Problem:

When you edit an assessment, it's **creating a NEW row** instead of **updating the existing row** in your Google Sheet. This causes data redundancy.

## ✅ Solution:

You need to **update your Google Apps Script** with the new code that includes the `handleUpdate()` function.

---

## 📝 Step-by-Step Instructions:

### Step 1: Open Google Apps Script

1. Open your **PhysioTrack Google Sheet**
2. Click **Extensions** → **Apps Script**
3. You should see the Apps Script editor

### Step 2: Replace the Code

1. **Select ALL existing code** in the editor (Ctrl+A)
2. **Delete it** (Delete key)
3. Open the file `scripts/google-apps-script.js` in your project folder
4. **Copy ALL the code** from that file (Ctrl+A, then Ctrl+C)
5. **Paste** it into the Apps Script editor (Ctrl+V)
6. Click **Save** (Ctrl+S or the disk icon)

### Step 3: Deploy the Update

**IMPORTANT: You must deploy a NEW VERSION for changes to work!**

1. Click **Deploy** button (top right)
2. Click **Manage deployments**
3. You'll see your existing deployment
4. Click the **Edit** button (pencil icon) next to it
5. Under "Version", click the dropdown
6. Select **"New version"**
7. Click **Deploy**
8. You should see: "Deployment successfully updated"
9. Click **Done**

### Step 4: Test the Edit Feature

1. Go to http://localhost:3000
2. Click "View" on any patient
3. Click "Edit Assessment"
4. Change some data (e.g., change age from 42 to 43)
5. Click "Update Assessment"
6. You should see "Assessment updated successfully!"
7. **Check your Google Sheet**:
   - The row should be **UPDATED** (not a new row added)
   - The data should show the new values
   - Timestamp should be updated

---

## 🔍 How to Verify It's Working:

### Before Fix:
- Edit assessment → Creates NEW row in sheet
- Original row stays unchanged
- You get duplicate data ❌

### After Fix:
- Edit assessment → UPDATES existing row
- Original row is replaced with new data
- No duplicates ✅

---

## 🧪 Quick Test:

1. **Note the current row count** in your Google Sheet (e.g., 3 rows including header)
2. **Edit an assessment** in the app
3. **Check the row count again**:
   - ✅ **CORRECT**: Still 3 rows (row was updated)
   - ❌ **WRONG**: 4 rows (new row was added)

---

## 🎯 What the Update Does:

The new Apps Script code includes:

1. **`handleCreate()`** - Adds new assessments (existing functionality)
2. **`handleUpdate()`** - Updates existing rows (NEW!)
3. **Smart routing** - Checks if request is create or update

When you click "Update Assessment":
- Frontend sends `action: 'update'` and `rowIndex: X`
- Apps Script sees this and calls `handleUpdate()`
- `handleUpdate()` updates row X with new data
- No new row is created!

---

## ⚠️ Common Mistakes:

### Mistake 1: Not Deploying New Version
- ❌ Just saving the code is NOT enough
- ✅ You MUST deploy a new version

### Mistake 2: Creating New Deployment
- ❌ Don't create a brand new deployment
- ✅ Edit the existing deployment and select "New version"

### Mistake 3: Not Waiting for Deployment
- ❌ Testing immediately after deploy
- ✅ Wait 10-15 seconds after deployment before testing

---

## 📊 Expected Behavior After Fix:

### Scenario 1: Edit Patient Name
1. Sarah Johnson → Sarah Smith
2. Google Sheet row 2 updates
3. Name changes from "Sarah Johnson" to "Sarah Smith"
4. No new row created

### Scenario 2: Edit Age
1. Age 42 → Age 43
2. Google Sheet row 2 updates
3. Age column changes from 42 to 43
4. No new row created

### Scenario 3: Edit Multiple Fields
1. Change name, age, and occupation
2. Google Sheet row 2 updates
3. All three fields change
4. No new row created

---

## 🔄 After Updating:

Once you've deployed the new version:

1. **Refresh your browser** (F5)
2. **Test editing** an assessment
3. **Verify** in Google Sheet that the row was updated (not duplicated)
4. **Celebrate!** 🎉 Your edit feature now works correctly!

---

## 📞 Still Having Issues?

If it's still creating new rows:

1. **Check Apps Script Executions**:
   - Apps Script → Executions (left sidebar)
   - Look for recent executions
   - Check if `handleUpdate` function ran
   - Look for any errors

2. **Check Browser Console**:
   - Press F12
   - Look for errors
   - Check if `action: 'update'` is being sent

3. **Verify Deployment**:
   - Deploy → Manage deployments
   - Check that deployment is "Active"
   - Check the version number increased

---

**DO THIS NOW to fix the edit feature!** 🚀
