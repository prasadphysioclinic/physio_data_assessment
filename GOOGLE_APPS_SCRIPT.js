/**
 * PhysioTrack - Google Apps Script
 * Updated: December 2024
 * 
 * COMPLETE RESTRUCTURE with new fields:
 * - Demographics: Sex, Height, Weight, BloodPressure, SugarLevel
 * - Clinical History: RedFlags
 * - Physical Exam: MusclePower, Gait, Sensation, Reflexes
 * - Pain: PainHistory, EasingFactors
 * - Treatment: Diagnosis, ManualTherapy, Electrotherapy, ExercisePrescription, PatientEducation, HomeFollowups
 * - Reviews: Review1, Review2, Review3
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
        return ContentService.createTextOutput(JSON.stringify({
            success: false,
            error: error.toString(),
            stack: error.stack
        })).setMimeType(ContentService.MimeType.JSON);
    }
}

function handleCreate(sheet, data) {
    // Define the exact column order (50+ columns)
    const columns = getColumns();

    // Create row data in the correct order
    const rowData = columns.map(col => {
        const value = data[col];
        if (value === undefined || value === null) {
            return '';
        }
        return value;
    });

    // Add timestamp if not provided
    const timestampIndex = columns.indexOf('Timestamp');
    if (!data.Timestamp && timestampIndex !== -1) {
        rowData[timestampIndex] = new Date().toISOString();
    }

    // Append the row to the sheet
    sheet.appendRow(rowData);

    return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Assessment saved successfully',
        rowNumber: sheet.getLastRow()
    })).setMimeType(ContentService.MimeType.JSON);
}

function handleUpdate(sheet, data) {
    const rowIndex = data.rowIndex;
    const columns = getColumns();

    const rowData = columns.map(col => {
        const value = data[col];
        if (value === undefined || value === null) {
            return '';
        }
        return value;
    });

    // Update timestamp
    const timestampIndex = columns.indexOf('Timestamp');
    if (timestampIndex !== -1) {
        rowData[timestampIndex] = new Date().toISOString();
    }

    // Update the specific row
    const range = sheet.getRange(rowIndex, 1, 1, rowData.length);
    range.setValues([rowData]);

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

        if (data.length === 0) {
            return ContentService.createTextOutput(JSON.stringify({
                success: true,
                data: []
            })).setMimeType(ContentService.MimeType.JSON);
        }

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
            data: assessments,
            count: assessments.length
        })).setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({
            success: false,
            error: error.toString(),
            stack: error.stack
        })).setMimeType(ContentService.MimeType.JSON);
    }
}

/**
 * Returns the column headers in order
 */
function getColumns() {
    return [
        // I. Patient Demographics
        'Date', 'PatientName', 'Age', 'Sex', 'Occupation', 'PhoneNumber',
        'Height', 'Weight', 'BloodPressure', 'SugarLevel',

        // II. Clinical History
        'ChiefComplaint', 'PresentHistory', 'PastHistory', 'DiagnosticImaging', 'RedFlags',

        // III. Observation & Physical Examination
        'Observation', 'ActiveROM', 'PassiveROM', 'MusclePower', 'Palpation', 'Gait',
        'NeurologicalTests', 'Sensation', 'Reflexes', 'SpecialTests',
        'EndFeel', 'CapsularPattern', 'ResistedIsometrics', 'FunctionalTesting',
        'JointPlayMovements', 'Comments',

        // IV. Pain Assessment
        'PainHistory', 'AggravatingFactors', 'EasingFactors', 'PainDescription',
        'PainIntensity_VAS', 'SymptomsLocation',

        // V. Diagnosis & Treatment Plan
        'Diagnosis', 'TreatmentPlan', 'ManualTherapy', 'Electrotherapy',
        'ExercisePrescription', 'PatientEducation', 'HomeFollowups', 'WhatTreatment',

        // VI. Summary & Follow-up
        'PatientSummary', 'Review1', 'Review2', 'Review3',

        // Legacy & System
        'TwentyFourHourHistory', 'ImprovingStaticWorse', 'NewOrOldInjury',
        'SubmittedBy', 'Timestamp'
    ];
}

/**
 * Run this function ONCE to set up the headers in your sheet
 */
function setupHeaders() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const columns = getColumns();

    sheet.getRange(1, 1, 1, columns.length).setValues([columns]);
    Logger.log('Headers set up successfully! Total columns: ' + columns.length);
}

/**
 * Test function to verify the script works
 */
function testScript() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    Logger.log('Sheet name: ' + sheet.getName());
    Logger.log('Last row: ' + sheet.getLastRow());
    Logger.log('Last column: ' + sheet.getLastColumn());
    Logger.log('Expected columns: ' + getColumns().length);
}
