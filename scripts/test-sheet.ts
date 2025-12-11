import { doc, loadDoc } from '../lib/google-sheets';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testConnection() {
    try {
        console.log('Loading Google Sheet...');
        await loadDoc();
        console.log('Google Sheet loaded successfully.');
        console.log('Title:', doc.title);

        const sheet = doc.sheetsByIndex[0];
        console.log('Sheet Title:', sheet.title);
        console.log('Header Values:', sheet.headerValues);

        console.log('Attempting to add a test row...');
        await sheet.addRow({
            "Date": new Date().toISOString(),
            "Patient Name": "Test Patient",
            "Age": "30"
        });
        console.log('Test row added successfully.');

    } catch (error) {
        console.error('Error connecting to Google Sheet:', error);
    }
}

testConnection();
