# 🔐 Google Apps Script Authorization - Quick Guide

## ⚠️ "Google hasn't verified this app" - DON'T PANIC!

This warning is **100% NORMAL** and **SAFE** to proceed with. Here's why:

### Why You See This Warning

1. **You created the script** - It's YOUR code, not from a verified company
2. **Google shows this for ALL personal Apps Scripts** - Even simple ones
3. **You're the developer AND the user** - You're authorizing your own work

### Is It Safe?

**YES! ✅** Here's why:
- You wrote the code yourself (or copied it from this project)
- You can see exactly what it does (read/write to YOUR Google Sheet)
- You're only giving permission to YOUR OWN script
- It only accesses YOUR Google Sheet, nothing else

### What To Do

Follow these exact steps:

1. **Click "Advanced"** (bottom left of the warning)
2. **Click "Go to PhysioTrack API (unsafe)"**
   - It says "unsafe" but it's YOUR script - it's safe!
3. **Review the permissions:**
   - "See, edit, create, and delete all your Google Sheets spreadsheets"
   - This is needed so your app can save patient assessments
4. **Click "Allow"**

### What Permissions Does It Need?

The script needs to:
- ✅ Read from your Google Sheet (to display assessments)
- ✅ Write to your Google Sheet (to save new assessments)
- ✅ That's it! Nothing else.

### How to Verify It's Safe

You can check the code yourself:
1. Open `scripts/google-apps-script.js` in your project
2. Read the code - it only does:
   - `doPost()` - Saves data to the sheet
   - `doGet()` - Reads data from the sheet
3. No external API calls, no data sharing, no tracking

### Still Concerned?

If you want extra security:
1. Create a NEW Google account just for this project
2. Use that account for the Google Sheet
3. Share the sheet with your main account

---

## 📸 Visual Guide

**Step 1: You'll see this warning**
```
┌─────────────────────────────────────┐
│  Google hasn't verified this app    │
│                                      │
│  The app is requesting access to    │
│  sensitive info in your Google       │
│  Account. Until the developer        │
│  (your@email.com) verifies this app  │
│  with Google, you shouldn't use it.  │
│                                      │
│  [Advanced]                          │
└─────────────────────────────────────┘
```

**Step 2: Click "Advanced"**
```
┌─────────────────────────────────────┐
│  Google hasn't verified this app    │
│                                      │
│  [Advanced] ← CLICK HERE             │
│                                      │
│  ▼ Go to PhysioTrack API (unsafe)   │
└─────────────────────────────────────┘
```

**Step 3: Click "Go to PhysioTrack API (unsafe)"**
```
┌─────────────────────────────────────┐
│  PhysioTrack API wants to access    │
│  your Google Account                 │
│                                      │
│  This will allow PhysioTrack API to: │
│  • See, edit, create, and delete    │
│    all your Google Sheets            │
│                                      │
│  [Cancel]  [Allow] ← CLICK HERE     │
└─────────────────────────────────────┘
```

**Step 4: Done! ✅**

---

## 🎯 Summary

- ✅ The warning is normal
- ✅ It's safe to proceed
- ✅ You're authorizing YOUR OWN script
- ✅ It only accesses YOUR Google Sheet
- ✅ Click "Advanced" → "Go to PhysioTrack API (unsafe)" → "Allow"

---

**Need more help?** Check the COMPLETE_SETUP_GUIDE.md file for full instructions.
