# PhysioTrack - Google Sheets Setup Guide

## Step 1: Create Google Sheet

1. Go to https://sheets.google.com
2. Create a new blank spreadsheet
3. Name it: "PhysioTrack Assessments"

## Step 2: Add Column Headers

Copy and paste these headers into Row 1 (A1 to AL1):

```
Date	PatientName	Age	Occupation	MechanismOfInjury	AggravatingEasingFactors	TwentyFourHourHistory	ImprovingStaticWorse	NewOrOldInjury	PastHistory	DiagnosticImaging	PainLocation	BodyMapImage	PainIntensity_VAS	PainPattern	ObservationPosture	Active_L_Flex	Active_R_Flex	Active_L_Ext	Active_R_Ext	Passive_L_Flex	Passive_R_Flex	Passive_L_Ext	Passive_R_Ext	EndFeel	CapsularPattern	ResistedIsometrics	FunctionalTesting	SensoryScan	Reflexes	NeuroSpecialTests	SpecialTests	JointPlayMovements	Palpation_Tenderness	Palpation_Effusion	Comments	SubmittedBy	Timestamp
```

## Step 3: Create Apps Script Web App

1. In your Google Sheet, click **Extensions** > **Apps Script**
2. Delete any existing code
3. Copy and paste the following code:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // Define the exact column order
    const columns = [
      'Date', 'PatientName', 'Age', 'Occupation', 'MechanismOfInjury',
      'AggravatingEasingFactors', 'TwentyFourHourHistory', 'ImprovingStaticWorse',
      'NewOrOldInjury', 'PastHistory', 'DiagnosticImaging', 'PainLocation',
      'BodyMapImage', 'PainIntensity_VAS', 'PainPattern', 'ObservationPosture',
      'Active_L_Flex', 'Active_R_Flex', 'Active_L_Ext', 'Active_R_Ext',
      'Passive_L_Flex', 'Passive_R_Flex', 'Passive_L_Ext', 'Passive_R_Ext',
      'EndFeel', 'CapsularPattern', 'ResistedIsometrics', 'FunctionalTesting',
      'SensoryScan', 'Reflexes', 'NeuroSpecialTests', 'SpecialTests',
      'JointPlayMovements', 'Palpation_Tenderness', 'Palpation_Effusion',
      'Comments', 'SubmittedBy', 'Timestamp'
    ];
    
    // Create row data in the correct order
    const rowData = columns.map(col => data[col] || '');
    
    // Add timestamp if not provided
    if (!data.Timestamp) {
      rowData[rowData.length - 1] = new Date().toISOString();
    }
    
    // Append the row
    sheet.appendRow(rowData);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Assessment saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);
    
    const assessments = rows.map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      data: assessments
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

## Step 4: Deploy the Apps Script

1. Click the **Deploy** button (top right) > **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure:
   - **Description**: PhysioTrack API
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
5. Click **Deploy**
6. **Copy the Web App URL** - it will look like:
   ```
   https://script.google.com/macros/s/AKfycby.../exec
   ```
7. Click **Done**

## Step 5: Update Your .env.local File

Add this line to your `.env.local` file:

```
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

Replace `YOUR_SCRIPT_ID` with the actual URL you copied.

## Step 6: Test the Integration

1. Run your Next.js app: `npm run dev`
2. Go to http://localhost:3000
3. Click "New Assessment"
4. Fill out the form and submit
5. Check your Google Sheet - the data should appear!

## Troubleshooting

- **403 Error**: Make sure "Who has access" is set to "Anyone"
- **No data appearing**: Check the Apps Script logs (View > Logs)
- **CORS errors**: Apps Script automatically handles CORS for web apps

## Security Note

For production, consider:
- Adding authentication to your Apps Script
- Validating data before saving
- Using environment variables for sensitive data
