# 🗑️ Remove BodyMapImage Column - Instructions

## ✅ Code Updated!

I've removed the `BodyMapImage` field from the code. Now you need to:

### Step 1: Update Google Apps Script

1. **Open your Google Sheet**
2. Click **Extensions** → **Apps Script**
3. **Delete all existing code**
4. Open `scripts/google-apps-script.js` in your project
5. **Copy ALL the code** (it now has 37 columns instead of 38)
6. **Paste** into Apps Script editor
7. Click **Save** (Ctrl+S)
8. Click **Deploy** → **Manage deployments**
9. Click **Edit** (pencil icon)
10. Select **"New version"**
11. Click **Deploy**

### Step 2: Delete Column from Google Sheet

1. **Open your Google Sheet**
2. Find the **"BodyMapImage"** column (Column M)
3. **Right-click** on the column header
4. Select **"Delete column"**
5. Done! ✅

---

## 📊 New Column Structure (37 columns):

Your Google Sheet will now have these columns in order:

1. Date
2. PatientName
3. Age
4. Occupation
5. MechanismOfInjury
6. AggravatingEasingFactors
7. TwentyFourHourHistory
8. ImprovingStaticWorse
9. NewOrOldInjury
10. PastHistory
11. DiagnosticImaging
12. PainLocation
13. **~~BodyMapImage~~ (REMOVED)** ❌
14. PainIntensity_VAS
15. PainPattern
16. ObservationPosture
17. Active_L_Flex
18. Active_R_Flex
19. Active_L_Ext
20. Active_R_Ext
21. Passive_L_Flex
22. Passive_R_Flex
23. Passive_L_Ext
24. Passive_R_Ext
25. EndFeel
26. CapsularPattern
27. ResistedIsometrics
28. FunctionalTesting
29. SensoryScan
30. Reflexes
31. NeuroSpecialTests
32. SpecialTests
33. JointPlayMovements
34. Palpation_Tenderness
35. Palpation_Effusion
36. Comments
37. SubmittedBy
38. Timestamp

---

## ⚠️ Important Notes:

1. **Delete the column AFTER updating Apps Script** - This ensures no data mismatch
2. **All existing data will be preserved** - Only the empty BodyMapImage column is removed
3. **Pain Location field is sufficient** - You can describe pain location in text

---

## ✅ What Changed:

### Files Updated:
- ✅ `lib/apps-script.ts` - Removed BodyMapImage from TypeScript interface
- ✅ `scripts/google-apps-script.js` - Removed from handleCreate function
- ✅ `scripts/google-apps-script.js` - Removed from handleUpdate function

### What You Need to Do:
1. ✅ Update Google Apps Script (copy new code, deploy new version)
2. ✅ Delete BodyMapImage column from Google Sheet

---

## 🎯 After Completion:

Your system will have:
- **37 columns** instead of 38
- **No BodyMapImage field** - it was always empty anyway
- **Pain Location text field** - sufficient for describing where pain is located
- **Cleaner, simpler structure**

---

**Follow the steps above and you're done!** 🚀
