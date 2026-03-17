/**
 * PhysioTrack - PERMANENT PRODUCTION SCRIPT
 * Version: 3.0 (March 2026)
 * Features: Auto-Drive Mapping, Direct Media Preview, One-Click Setup
 */

/**
 * 🛠 SETUP: Run this function FIRST to prepare your sheet.
 * Select 'setupHeaders' in the toolbar and click 'Run'.
 */
function setupHeaders() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const columns = getColumns();
  
  // 1. Clear existing headers
  sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).clearContent();
  
  // 2. Set new headers
  sheet.getRange(1, 1, 1, columns.length).setValues([columns]);
  
  // 3. Format: Bold, Centered, Frozen
  const headerRange = sheet.getRange(1, 1, 1, columns.length);
  headerRange.setFontWeight("bold");
  headerRange.setHorizontalAlignment("center");
  headerRange.setBackground("#f3f3f3");
  sheet.setFrozenRows(1);
  
  // 4. Set column widths (approximate for readability)
  sheet.setColumnWidth(2, 200); // Patient Name
  sheet.setColumnWidth(columns.length, 180); // Timestamp
  
  Logger.log('✅ Sheet Prepared Successfully with ' + columns.length + ' columns!');
}

/**
 * 📡 POST Handler: Processes new entries and updates
 */
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);

    // Route to update or create
    if (data.action === 'update' && (data.rowIndex !== undefined && data.rowIndex !== null)) {
      return handleUpdate(sheet, data);
    }
    return handleCreate(sheet, data);

  } catch (error) {
    return createJsonResponse({ success: false, error: error.toString() });
  }
}

/**
 * 📡 GET Handler: Fetches assessments for the dashboard
 */
function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = sheet.getDataRange().getValues();

    if (data.length <= 1) return createJsonResponse({ success: true, data: [] });

    const headers = data[0];
    const rows = data.slice(1);
    const assessments = rows.map(row => {
      const obj = {};
      headers.forEach((header, index) => { obj[header] = row[index]; });
      return obj;
    });

    return createJsonResponse(assessments);
  } catch (error) {
    return createJsonResponse({ success: false, error: error.toString() });
  }
}

/**
 * 🏥 Handle New Assessment & Media Storage
 */
function handleCreate(sheet, data) {
  const columns = getColumns();
  const row = new Array(columns.length).fill("");

  // Step 1: Handle Media Uploads to Google Drive
  if (data.files && data.files.length > 0) {
    const mediaUrls = uploadMediaToDrive(data.PatientName, data.Date, data.files);
    data.Media1 = mediaUrls[0] || "";
    data.Media2 = mediaUrls[1] || "";
    data.Media3 = mediaUrls[2] || "";
    data.Media4 = mediaUrls[3] || "";
  }

  // Step 2: Map data to columns
  columns.forEach((col, index) => {
    if (data[col] !== undefined) row[index] = data[col];
  });

  // Step 3: Append Row
  sheet.appendRow(row);
  return createJsonResponse({ success: true, message: "Saved successfully to Sheet and Drive" });
}

/**
 * ✏️ Handle Updates (ATOMIC & ROBUST)
 */
function handleUpdate(sheet, data) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const rowIndex = parseInt(data.rowIndex) + 1; // Convert 0-based to 1-based, +1 for header
  
  // Step 1: Handle NEW Media uploads during Update
  if (data.files && data.files.length > 0) {
    const newMediaUrls = uploadMediaToDrive(data.PatientName, data.Date, data.files);
    
    // Find first empty Media slot or append to existing
    let mediaPtr = 0;
    for (let i = 1; i <= 4; i++) {
      const key = "Media" + i;
      if (!data[key] && newMediaUrls[mediaPtr]) {
        data[key] = newMediaUrls[mediaPtr++];
      }
    }
  }

  // Step 2: Atomic Sheet Update (Read -> Merge -> Write)
  const rowRange = sheet.getRange(rowIndex, 1, 1, headers.length);
  const rowValues = rowRange.getValues()[0];

  headers.forEach((header, index) => {
    if (data[header] !== undefined && header !== 'rowIndex' && header !== 'action') {
      rowValues[index] = data[header];
    }
  });

  rowRange.setValues([rowValues]);

  return createJsonResponse({ success: true, message: "Record synchronized successfully", rowIndex: rowIndex });
}

/**
 * 📂 Google Drive Media Management
 */
function uploadMediaToDrive(patientName, date, files) {
  const rootFolderName = "PhysioTrack_Media";
  let rootFolder;
  const folders = DriveApp.getFoldersByName(rootFolderName);
  
  rootFolder = folders.hasNext() ? folders.next() : DriveApp.createFolder(rootFolderName);

  // Subfolder for each session
  const subFolderName = patientName + " (" + date + ")";
  const sessionFolder = rootFolder.createFolder(subFolderName);
  const urls = [];

  files.forEach(file => {
    const blob = Utilities.newBlob(Utilities.base64Decode(file.data), file.type, file.name);
    const gFile = sessionFolder.createFile(blob);
    
    // Enable public viewing so the web app can see them
    gFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    // Use the 'uc' URL for direct browser previewing
    urls.push("https://drive.google.com/uc?export=view&id=" + gFile.getId());
  });

  return urls;
}

/**
 * 📏 Definitive Column Structure
 */
function getColumns() {
  return [
    "Date", "PatientName", "Age", "Sex", "Occupation", "PhoneNumber", "Height", "Weight", 
    "BloodPressure", "DiabeticMellitus", "DietHabit", "SleepingHistory", "MenstruationHistory",
    "ChiefComplaint", "PresentHistory", "PastHistory", "DiagnosticImaging", "RedFlags", 
    "Observation", "ActiveROM", "PassiveROM", "MusclePower", "Palpation", "Gait", 
    "NeurologicalTests", "Sensation", "Reflexes", "SpecialTests", "EndFeel", "CapsularPattern", 
    "ResistedIsometrics", "FunctionalTesting", "JointPlayMovements", "Comments", 
    "PainHistory", "AggravatingFactors", "EasingFactors", "PainDescription", "PainIntensity_VAS", "SymptomsLocation", 
    "Diagnosis", "TreatmentPlan", "ManualTherapy", "Electrotherapy", "ExercisePrescription", 
    "PatientEducation", "HomeFollowups", "WhatTreatment", "PatientSummary", 
    "Review1", "Review2", "Review3", 
    "TwentyFourHourHistory", "ImprovingStaticWorse", "NewOrOldInjury", "SubmittedBy",
    "Media1", "Media2", "Media3", "Media4",
    "Timestamp"
  ];
}

/**
 * 🔋 Utility: Formats JSON response correctly
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
