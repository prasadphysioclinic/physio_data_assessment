# ✅ PhysioTrack Setup Checklist

Use this checklist to ensure you've completed all setup steps correctly.

## 📋 Pre-Setup

- [ ] Node.js installed (v18 or higher)
- [ ] Google account ready
- [ ] Code editor installed (VS Code recommended)

## 🗂️ Step 1: Google Sheet Setup

- [ ] Created new Google Sheet
- [ ] Named it "PhysioTrack Assessments"
- [ ] Copied column headers from `COLUMN_HEADERS.md`
- [ ] Pasted headers into Row 1 (A1 to AL1)
- [ ] Verified all 38 columns are present

## 💻 Step 2: Apps Script Setup

- [ ] Opened Extensions → Apps Script in Google Sheet
- [ ] Deleted default code
- [ ] Copied code from `scripts/google-apps-script.js`
- [ ] Pasted into Apps Script editor
- [ ] Saved the script (Ctrl+S)
- [ ] Named project "PhysioTrack API"

## 🚀 Step 3: Deploy Apps Script

- [ ] Clicked Deploy → New deployment
- [ ] Selected "Web app" as type
- [ ] Set "Execute as" to "Me"
- [ ] Set "Who has access" to "Anyone"
- [ ] Clicked Deploy
- [ ] Handled authorization warning:
  - [ ] Clicked "Authorize access"
  - [ ] Chose Google account
  - [ ] Clicked "Advanced"
  - [ ] Clicked "Go to PhysioTrack API (unsafe)"
  - [ ] Clicked "Allow"
- [ ] Copied Web App URL
- [ ] Saved URL somewhere safe

## ⚙️ Step 4: Configure Application

- [ ] Opened project in code editor
- [ ] Created `.env.local` file in project root
- [ ] Added `GOOGLE_APPS_SCRIPT_URL=` with your URL
- [ ] Saved `.env.local` file

## 🏃 Step 5: Run Application

- [ ] Opened terminal in project folder
- [ ] Ran `npm install`
- [ ] Ran `npm run dev`
- [ ] Server started successfully
- [ ] Opened http://localhost:3000 in browser

## 🧪 Step 6: Test the System

- [ ] Dashboard loads without errors
- [ ] Clicked "New Assessment" button
- [ ] Form displays correctly
- [ ] Filled out test patient data:
  - [ ] Date
  - [ ] Patient Name
  - [ ] Age
  - [ ] At least one other field
- [ ] Clicked "Save Assessment"
- [ ] Saw success message
- [ ] Checked Google Sheet
- [ ] New row appeared with test data
- [ ] Returned to dashboard
- [ ] Test patient appears in table

## ✨ Optional Enhancements

- [ ] Customized form fields
- [ ] Added body chart image to `/public` folder
- [ ] Tested on mobile device
- [ ] Set up for production deployment

## 🐛 If Something Went Wrong

### No success message after saving
- [ ] Checked browser console (F12) for errors
- [ ] Verified `GOOGLE_APPS_SCRIPT_URL` in `.env.local`
- [ ] Restarted dev server (`Ctrl+C`, then `npm run dev`)

### Data in wrong columns
- [ ] Verified column headers match exactly
- [ ] Checked for typos in header names
- [ ] Ensured headers are in correct order

### Authorization issues
- [ ] Went to Apps Script → Deploy → Manage deployments
- [ ] Verified "Who has access" is "Anyone"
- [ ] Re-authorized if needed

### Can't see data in dashboard
- [ ] Checked that Google Sheet has data (besides headers)
- [ ] Verified Apps Script is deployed
- [ ] Checked browser console for errors

## 🎉 Success Criteria

You've successfully set up PhysioTrack when:
- ✅ Form loads without errors
- ✅ Can submit a test assessment
- ✅ Data appears in Google Sheet
- ✅ Dashboard shows the submitted assessment
- ✅ No console errors

## 📚 Next Steps

Once everything works:
1. Delete test data from Google Sheet
2. Start entering real patient assessments
3. Consider deploying to production (Vercel, Netlify, etc.)
4. Share with your team!

---

**Need help?** Check:
- `COMPLETE_SETUP_GUIDE.md` - Detailed instructions
- `AUTHORIZATION_GUIDE.md` - Authorization help
- `README.md` - Project overview

**Stuck?** Open browser console (F12) and check for error messages.
