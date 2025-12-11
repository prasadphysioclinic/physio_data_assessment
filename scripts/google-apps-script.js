/**
 * Google Apps Script for PhysioTrack
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open your Google Sheet
 * 2. Click Extensions > Apps Script
 * 3. Delete any existing code
 * 4. Copy and paste this entire file
 * 5. Click Deploy > New deployment (or Manage deployments > Edit)
 * 6. Select "Web app" as type
 * 7. Set "Execute as" to "Me"
 * 8. Set "Who has access" to "Anyone"
 * 9. Click Deploy and copy the Web App URL
 * 10. Add the URL to your .env.local file as GOOGLE_APPS_SCRIPT_URL
 * 
 * IMPORTANT: After updating this code, you must create a NEW deployment
 * or update the existing deployment for changes to take effect!
 */

function doPost(e) {
    try {
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
        const data = JSON.parse(e.postData.contents);

        // Check if this is an update request
        if (data.action === 'update' && data.rowIndex) {
            return handleUpdate(sheet, data);
        }

        // Otherwise, handle as new entry
        return handleCreate(sheet, data);

    } catch (error) {
        // Return error response
        return ContentService.createTextOutput(JSON.stringify({
            success: false,
            error: error.toString(),
            stack: error.stack
        })).setMimeType(ContentService.MimeType.JSON);
    }
}

function handleCreate(sheet, data) {
    // Define the exact column order matching your headers (37 columns now, removed BodyMapImage)
    const columns = [
        'Date', 'PatientName', 'Age', 'Occupation', 'MechanismOfInjury',
        'AggravatingEasingFactors', 'TwentyFourHourHistory', 'ImprovingStaticWorse',
        'NewOrOldInjury', 'PastHistory', 'DiagnosticImaging', 'PainLocation',
        'PainIntensity_VAS', 'PainPattern', 'ObservationPosture',
        'Active_L_Flex', 'Active_R_Flex', 'Active_L_Ext', 'Active_R_Ext',
        'Passive_L_Flex', 'Passive_R_Flex', 'Passive_L_Ext', 'Passive_R_Ext',
        'EndFeel', 'CapsularPattern', 'ResistedIsometrics', 'FunctionalTesting',
        'SensoryScan', 'Reflexes', 'NeuroSpecialTests', 'SpecialTests',
        'JointPlayMovements', 'Palpation_Tenderness', 'Palpation_Effusion',
        'Comments', 'SubmittedBy', 'Timestamp'
    ];

    // Create row data in the correct order
    const rowData = columns.map(col => {
        const value = data[col];
        // Handle undefined/null values
        if (value === undefined || value === null) {
            return '';
        }
        return value;
    });

    // Add timestamp if not provided
    if (!data.Timestamp) {
        rowData[rowData.length - 1] = new Date().toISOString();
    }

    // Append the row to the sheet
    sheet.appendRow(rowData);

    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Assessment saved successfully',
        rowNumber: sheet.getLastRow()
    })).setMimeType(ContentService.MimeType.JSON);
}

function handleUpdate(sheet, data) {
    const rowIndex = data.rowIndex;

    // Define the exact column order (37 columns, removed BodyMapImage)
    const columns = [
        'Date', 'PatientName', 'Age', 'Occupation', 'MechanismOfInjury',
        'AggravatingEasingFactors', 'TwentyFourHourHistory', 'ImprovingStaticWorse',
        'NewOrOldInjury', 'PastHistory', 'DiagnosticImaging', 'PainLocation',
        'PainIntensity_VAS', 'PainPattern', 'ObservationPosture',
        'Active_L_Flex', 'Active_R_Flex', 'Active_L_Ext', 'Active_R_Ext',
        'Passive_L_Flex', 'Passive_R_Flex', 'Passive_L_Ext', 'Passive_R_Ext',
        'EndFeel', 'CapsularPattern', 'ResistedIsometrics', 'FunctionalTesting',
        'SensoryScan', 'Reflexes', 'NeuroSpecialTests', 'SpecialTests',
        'JointPlayMovements', 'Palpation_Tenderness', 'Palpation_Effusion',
        'Comments', 'SubmittedBy', 'Timestamp'
    ];

    // Create row data in the correct order
    const rowData = columns.map(col => {
        const value = data[col];
        if (value === undefined || value === null) {
            return '';
        }
        return value;
    });

    // Update timestamp
    rowData[rowData.length - 1] = new Date().toISOString();

    // Update the specific row
    const range = sheet.getRange(rowIndex, 1, 1, rowData.length);
    range.setValues([rowData]);

    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Assessment updated successfully',
        rowNumber: rowIndex
    })).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
    try {
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
        const data = sheet.getDataRange().getValues();

        // Check if sheet has data
        if (data.length === 0) {
            return ContentService.createTextOutput(JSON.stringify({
                success: true,
                data: []
            })).setMimeType(ContentService.MimeType.JSON);
        }

        const headers = data[0];
        const rows = data.slice(1);

        // Convert rows to objects using headers
        const assessments = rows.map(row => {
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = row[index];
            });
            return obj;
        });

        // Return success response with data
        return ContentService.createTextOutput(JSON.stringify({
            success: true,
            data: assessments,
            count: assessments.length
        })).setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        // Return error response
        return ContentService.createTextOutput(JSON.stringify({
            success: false,
            error: error.toString(),
            stack: error.stack
        })).setMimeType(ContentService.MimeType.JSON);
    }
}

/**
 * Test function to verify the script works
 * Run this from the Apps Script editor to test
 */
function testScript() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    Logger.log('Sheet name: ' + sheet.getName());
    Logger.log('Last row: ' + sheet.getLastRow());
    Logger.log('Last column: ' + sheet.getLastColumn());

    // Test data
    const testData = {
        Date: new Date().toISOString().split('T')[0],
        PatientName: 'Test Patient',
        Age: '30',
        Occupation: 'Engineer',
        MechanismOfInjury: 'Test injury',
        Timestamp: new Date().toISOString()
    };

    Logger.log('Test data: ' + JSON.stringify(testData));
}
