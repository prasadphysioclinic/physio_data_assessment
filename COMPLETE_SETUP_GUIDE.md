# 📘 Complete Setup Guide for PhysioTrack with Google Sheets Apps Script

## 🎯 Overview
This guide will help you connect your PhysioTrack application to Google Sheets using Apps Script. This is simpler than using the Google Sheets API and doesn't require service account credentials.

---

## 📝 Step 1: Create Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **"+ Blank"** to create a new spreadsheet
3. Name it: **"PhysioTrack Assessments"**

---

## 📊 Step 2: Add Column Headers

1. Open the file `COLUMN_HEADERS.md` in your project
2. Copy the entire header row (it's tab-separated)
3. In your Google Sheet, click on cell **A1**
4. Paste the headers

**Your headers should be:**
```
Date | PatientName | Age | Occupation | MechanismOfInjury | ... (38 columns total)
```

---

## 💻 Step 3: Create the Apps Script

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. You'll see a code editor with some default code
3. **Delete all the existing code**
4. Open the file `scripts/google-apps-script.js` in your project folder
5. **Copy ALL the code** from that file
6. **Paste it** into the Apps Script editor
7. Click the **Save** icon (💾) or press `Ctrl+S`
8. Name your project: **"PhysioTrack API"**

---

## 🚀 Step 4: Deploy as Web App

1. In the Apps Script editor, click **Deploy** → **New deployment**
2. Click the **gear icon** (⚙️) next to "Select type"
3. Choose **"Web app"**
4. Configure the deployment:
   - **Description**: `PhysioTrack API v1`
   - **Execute as**: `Me (your email)`
   - **Who has access**: `Anyone`
5. Click **Deploy**
6. **IMPORTANT - Authorization Step** (You'll see a warning - this is NORMAL!):
   - Click **Authorize access**
   - Choose your Google account
   - **You'll see a warning**: "Google hasn't verified this app"
     - This is **completely normal** for personal Apps Scripts!
     - This happens because YOU created the script, and Google hasn't "verified" it
     - **It's safe to proceed** - you're authorizing your own script
   - Click **Advanced** (at the bottom left)
   - Click **Go to PhysioTrack API (unsafe)** (it's not actually unsafe - it's YOUR script!)
   - Review the permissions:
     - "See, edit, create, and delete all your Google Sheets spreadsheets"
     - This is needed so the script can write to your sheet
   - Click **Allow**
7. **IMPORTANT**: Copy the **Web App URL**
   - It looks like: `https://script.google.com/macros/s/AKfycby.../exec`
   - Save this URL - you'll need it in the next step!
8. Click **Done**

---

## 🔧 Step 5: Configure Your Application

1. In your project folder, open the file `.env.local`
   - If it doesn't exist, create it
   - You can use `ENV_SAMPLE.txt` as a reference
2. Add this line (replace with your actual URL):
   ```
   GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_ACTUAL_SCRIPT_ID/exec
   ```
3. Save the file

---

## ✅ Step 6: Test the Integration

1. Make sure your Next.js dev server is running:
   ```bash
   npm run dev
   ```
2. Open your browser to: `http://localhost:3000`
3. Click **"New Assessment"**
4. Fill out the form with test data
5. Click **"Save Assessment"**
6. Check your Google Sheet - you should see a new row with your data!

---

## 🔍 Troubleshooting

### Problem: "Google hasn't verified this app" warning
- **This is NORMAL!** ✅
- This warning appears because YOU created the script, not a verified company
- **It's completely safe** to click "Advanced" → "Go to PhysioTrack API (unsafe)"
- You're only authorizing your own script to access your own Google Sheet
- Google shows this warning for ALL personal Apps Scripts

### Problem: "Failed to save assessment"
- **Check**: Is your `GOOGLE_APPS_SCRIPT_URL` correct in `.env.local`?
- **Check**: Did you set "Who has access" to "Anyone" in the deployment?
- **Check**: Did you authorize the script?

### Problem: Data appears in wrong columns
- **Check**: Are your column headers EXACTLY as specified in `COLUMN_HEADERS.md`?
- **Check**: Are they in the correct order?
- **Note**: Column names are case-sensitive!

### Problem: "Authorization required" error
- Go back to Apps Script
- Click **Deploy** → **Manage deployments**
- Click **Edit** (pencil icon)
- Make sure "Who has access" is set to "Anyone"
- Click **Deploy**

### Problem: No data showing in dashboard
- **Check**: Do you have at least one row of data in your sheet (besides headers)?
- **Check**: Is your Apps Script deployed correctly?
- **Check**: Open browser console (F12) and check for errors

---

## 🎨 Understanding the Data Flow

```
┌─────────────────┐
│  Web Form       │
│  (Next.js)      │
└────────┬────────┘
         │
         │ POST /api/assessments
         ▼
┌─────────────────┐
│  API Route      │
│  route.ts       │
└────────┬────────┘
         │
         │ fetch(APPS_SCRIPT_URL)
         ▼
┌─────────────────┐
│  Apps Script    │
│  (Google)       │
└────────┬────────┘
         │
         │ appendRow()
         ▼
┌─────────────────┐
│  Google Sheet   │
│  (Database)     │
└─────────────────┘
```

---

## 📋 Column Mapping Reference

| Form Field | Google Sheet Column |
|------------|---------------------|
| date | Date |
| name | PatientName |
| age | Age |
| occupation | Occupation |
| mechanismOfInjury | MechanismOfInjury |
| aggravatingFactors | AggravatingEasingFactors |
| twentyFourHourHistory | TwentyFourHourHistory |
| improvingStaticWorse | ImprovingStaticWorse |
| newOldInjury | NewOrOldInjury |
| pastHistory | PastHistory |
| diagnosticImaging | DiagnosticImaging |
| painLocation | PainLocation |
| bodyMapImage | BodyMapImage |
| painVas | PainIntensity_VAS |
| painDescription | PainPattern |
| observation | ObservationPosture |
| active_L_Flex | Active_L_Flex |
| active_R_Flex | Active_R_Flex |
| active_L_Ext | Active_L_Ext |
| active_R_Ext | Active_R_Ext |
| passive_L_Flex | Passive_L_Flex |
| passive_R_Flex | Passive_R_Flex |
| passive_L_Ext | Passive_L_Ext |
| passive_R_Ext | Passive_R_Ext |
| endFeel | EndFeel |
| capsularPattern | CapsularPattern |
| resistedIsometricMovements | ResistedIsometrics |
| functionalTesting | FunctionalTesting |
| sensoryScan | SensoryScan |
| reflexes | Reflexes |
| neuroSpecialTests | NeuroSpecialTests |
| specialTests | SpecialTests |
| jointPlayMovements | JointPlayMovements |
| palpation_Tenderness | Palpation_Tenderness |
| palpation_Effusion | Palpation_Effusion |
| comments | Comments |
| submittedBy | SubmittedBy |
| (auto) | Timestamp |

---

## 🔒 Security Notes

- The Apps Script is deployed as "Anyone" can access it
- This means anyone with the URL can read/write to your sheet
- For production use, consider:
  - Adding authentication
  - Validating incoming data
  - Rate limiting
  - Using a proper database

---

## 🎉 You're Done!

Your PhysioTrack application is now connected to Google Sheets!

**Next Steps:**
- Test with real patient data
- Customize the form fields if needed
- Add more features (edit, delete, search)
- Deploy to production (Vercel, Netlify, etc.)

---

## 📞 Need Help?

If you encounter issues:
1. Check the browser console for errors (F12)
2. Check the Apps Script logs (View → Logs in Apps Script editor)
3. Verify your `.env.local` configuration
4. Make sure the Google Sheet headers match exactly

---

**Created for PhysioTrack** | Last updated: December 2025
