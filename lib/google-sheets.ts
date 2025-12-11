import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

// Config variables
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;

const serviceAccountAuth = new JWT({
    email: GOOGLE_CLIENT_EMAIL,
    key: GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
    ],
});

export const doc = new GoogleSpreadsheet(SPREADSHEET_ID as string, serviceAccountAuth);

export async function loadDoc() {
    if (!SPREADSHEET_ID || !GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY) {
        throw new Error('Google Sheets credentials are missing');
    }
    await doc.loadInfo();
    return doc;
}

export async function addAssessment(data: any) {
    await loadDoc();
    const sheet = doc.sheetsByIndex[0]; // Assuming the first sheet is used
    await sheet.addRow(data);
}

export async function getAssessments() {
    await loadDoc();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    return rows.map((row) => row.toObject());
}
