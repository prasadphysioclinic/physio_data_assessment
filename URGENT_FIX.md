# 🚨 URGENT FIX NEEDED - Environment Variable Missing

## ❌ Problem Found

The error "500 Internal Server Error" is happening because the `GOOGLE_APPS_SCRIPT_URL` environment variable is **NOT configured** in your `.env.local` file.

## ✅ Solution (2 Steps)

### Step 1: Add the URL to `.env.local`

You have `.env.local` open in your editor. Add this line:

```
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbzRZF1xu1RX8dXbqSg6nH7zfMrOF7oJcI6578TtI_zWc8uHp-bm2MTbxmxZAyOsMiYW/exec
```

**Your `.env.local` file should look like this:**

```env
# Google Apps Script Configuration
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbzRZF1xu1RX8dXbqSg6nH7zfMrOF7oJcI6578TtI_zWc8uHp-bm2MTbxmxZAyOsMiYW/exec
```

**Save the file** (Ctrl+S)

### Step 2: Restart the Dev Server

After saving, the dev server needs to be restarted to load the new environment variable.

In your terminal:
1. Press `Ctrl+C` to stop the current server
2. Run `npm run dev` again

OR just tell me and I'll restart it for you!

## 🧪 After Restart - Test Again

1. Go to http://localhost:3000/new
2. Fill out the form with test data
3. Click "Save Assessment"
4. You should now see: **"Assessment saved successfully!"**
5. Check your Google Sheet - data should appear!

## 📋 Why This Happened

The application needs to know WHERE to send the data (your Google Apps Script URL). Without this environment variable, it doesn't know where to save the data, causing the 500 error.

---

**Quick Action Required:**
1. ✅ Add the line to `.env.local`
2. ✅ Save the file
3. ✅ Restart dev server
4. ✅ Test again
