# 🧪 Quick Test Guide - Verify Google Sheets Connection

## ✅ Your Setup Status

- ✅ Apps Script deployed successfully
- ✅ Web App URL configured in `.env.local`
- ✅ Dev server restarted and running
- ✅ Application loads correctly

## 🎯 Next Step: Test the Connection

### Test 1: Submit a Test Assessment

1. **Go to**: http://localhost:3000/new (already open in your browser)

2. **Fill out the form** with test data:
   - **Date**: Today's date (should be pre-filled)
   - **Name**: `Test Patient`
   - **Age**: `30`
   - **Occupation**: `Engineer`
   - **Mechanism of Injury**: `Test injury for system verification`
   - **Pain VAS**: Move slider to `5`
   - Leave other fields empty for now

3. **Click "Save Assessment"** button at the bottom

4. **Expected Results**:
   - ✅ You should see: "Assessment saved successfully!" alert
   - ✅ Form should reset to empty
   - ✅ No errors in browser console (F12)

5. **Verify in Google Sheet**:
   - Open your Google Sheet
   - You should see a new row (Row 2) with:
     - Date in column A
     - "Test Patient" in column B (PatientName)
     - "30" in column C (Age)
     - "Engineer" in column D (Occupation)
     - "Test injury for system verification" in column E (MechanismOfInjury)
     - "5" in column N (PainIntensity_VAS)
     - Timestamp in column AL

### Test 2: Verify Dashboard Display

1. **Go to**: http://localhost:3000 (click "Dashboard" in header)

2. **Expected Results**:
   - ✅ Table should show your test patient
   - ✅ Should display: Date, Name, Age, Occupation
   - ✅ "View" button should be visible

## 🐛 Troubleshooting

### If you see "Failed to save assessment"

**Check 1: Environment Variable**
- Open `.env.local`
- Verify the URL is correct:
  ```
  GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbzRZF1xu1RX8dXbqSg6nH7zfMrOF7oJcI6578TtI_zWc8uHp-bm2MTbxmxZAyOsMiYW/exec
  ```
- Make sure there are no extra spaces or quotes

**Check 2: Browser Console**
- Press F12 to open developer tools
- Click "Console" tab
- Look for error messages
- Common errors:
  - `GOOGLE_APPS_SCRIPT_URL is not configured` → Check `.env.local`
  - `Failed to fetch` → Check Apps Script deployment
  - `CORS error` → Check Apps Script "Who has access" is set to "Anyone"

**Check 3: Apps Script Deployment**
- Go to your Google Sheet
- Click Extensions → Apps Script
- Click Deploy → Manage deployments
- Verify:
  - Status shows "Active"
  - "Who has access" is "Anyone"
  - URL matches what's in `.env.local`

**Check 4: Apps Script Logs**
- In Apps Script editor
- Click "Executions" (left sidebar)
- Check for recent executions
- Click on any failed execution to see error details

### If data appears in wrong columns

- Check your Google Sheet column headers
- They must EXACTLY match the headers in `COLUMN_HEADERS.md`
- Case-sensitive! `PatientName` ≠ `patientname`

### If dashboard shows "No assessments found"

- Check that your Google Sheet has data (besides headers)
- Verify the Apps Script `doGet()` function is working
- Check browser console for errors

## 🎉 Success Criteria

Your system is working correctly when:
- ✅ Form submits without errors
- ✅ Success message appears
- ✅ Data appears in Google Sheet in correct columns
- ✅ Dashboard displays the submitted assessment
- ✅ No console errors

## 📸 Screenshot Your Success!

Once it works:
1. Take a screenshot of the Google Sheet with data
2. Take a screenshot of the dashboard showing the assessment
3. You're ready to use the system!

## 🚀 What's Next?

After successful testing:
1. Delete the test data from Google Sheet
2. Start entering real patient assessments
3. Consider customizing the form for your needs
4. Deploy to production when ready

---

**Need help?** Check the browser console (F12) for specific error messages.
