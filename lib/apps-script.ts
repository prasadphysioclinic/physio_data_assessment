// Google Apps Script integration
const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL;

// Timeout constants (Google Apps Script can hang)
const GET_TIMEOUT_MS = 15000;  // 15 seconds for reads
const POST_TIMEOUT_MS = 30000; // 30 seconds for writes (media uploads can be large)

export interface AssessmentData {
    // I. Patient Demographics
    Date: string;
    PatientName: string;
    Age: string;
    Sex?: string;
    Occupation?: string;
    PhoneNumber?: string;
    Height?: string;
    Weight?: string;
    BloodPressure?: string;
    DiabeticMellitus?: string;
    DietHabit?: string;
    SleepingHistory?: string;
    MenstruationHistory?: string;

    // II. Clinical History
    ChiefComplaint?: string;
    PresentHistory?: string;
    MechanismOfInjury?: string;
    AggravatingEasingFactors?: string;
    PastHistory?: string;
    DiagnosticImaging?: string;
    RedFlags?: string;

    // III. Observation & Physical Examination
    Observation?: string;
    ObservationPosture?: string;
    ActiveROM?: string;
    Active_L_Flex?: string;
    Active_R_Flex?: string;
    Active_L_Ext?: string;
    Active_R_Ext?: string;
    PassiveROM?: string;
    Passive_L_Flex?: string;
    Passive_R_Flex?: string;
    Passive_L_Ext?: string;
    Passive_R_Ext?: string;
    MusclePower?: string;
    Palpation?: string;
    Palpation_Tenderness?: string;
    Palpation_Effusion?: string;
    Gait?: string;
    NeurologicalTests?: string;
    SensoryScan?: string;
    Reflexes?: string;
    SpecialTests?: string;
    NeuroSpecialTests?: string;
    EndFeel?: string;
    CapsularPattern?: string;
    ResistedIsometrics?: string;
    FunctionalTesting?: string;
    JointPlayMovements?: string;
    Comments?: string;

    // IV. Pain Assessment
    PainHistory?: string;
    AggravatingFactors?: string;
    EasingFactors?: string;
    PainDescription?: string;
    PainPattern?: string;
    PainIntensity_VAS?: number | string;
    PainLocation?: string;
    SymptomsLocation?: string;

    // V. Diagnosis & Treatment Plan
    Diagnosis?: string;
    TreatmentPlan?: string;
    ManualTherapy?: string;
    Electrotherapy?: string;
    ExercisePrescription?: string;
    PatientEducation?: string;
    HomeFollowups?: string;
    WhatTreatment?: string;

    // VI. Summary & Follow-up
    PatientSummary?: string;
    Review1?: string;
    Review2?: string;
    Review3?: string;
    DailyNotes?: string;

    // Legacy & System
    TwentyFourHourHistory?: string;
    ImprovingStaticWorse?: string;
    NewOrOldInjury?: string;
    SubmittedBy?: string;
    Timestamp?: string;

    // Media fields (Google Drive URLs)
    Media_1?: string;
    Media_2?: string;
    Media_3?: string;
    Media_4?: string;

    // Temporary storage for files being uploaded
    files?: {
        name: string;
        type: string;
        data: string; // base64
    }[];

    // Action for updates
    action?: 'create' | 'update';
    rowIndex?: number;
    [key: string]: any;
}

export async function saveToGoogleSheet(data: AssessmentData) {
    if (!APPS_SCRIPT_URL) {
        throw new Error('NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL is not configured. Add it in Vercel Environment Variables.');
    }

    // Timeout to prevent infinite server waits
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), POST_TIMEOUT_MS);

    try {
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            redirect: 'follow',
            signal: controller.signal,
        });

        clearTimeout(timeoutId);
        const text = await response.text();

        if (!response.ok) {
            throw new Error(`Failed to save to Google Sheet (HTTP ${response.status}): ${text.substring(0, 200)}`);
        }

        // Safely parse JSON — Google might return HTML instead
        try {
            const result = JSON.parse(text);
            // Validate response structure
            if (typeof result !== 'object' || result === null) {
                throw new Error('Invalid response structure from Apps Script');
            }
            return result;
        } catch (parseErr) {
            console.error('Non-JSON response from Apps Script (save):', text.substring(0, 300));
            throw new Error('Google Apps Script returned invalid response. Check script deployment permissions.');
        }
    } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof DOMException && error.name === 'AbortError') {
            throw new Error('Google Apps Script request timed out (30s). The script may be overloaded.');
        }
        if (error instanceof Error) throw error;
        throw new Error('Network error connecting to Google Apps Script');
    }
}

export async function getFromGoogleSheet() {
    if (!APPS_SCRIPT_URL) {
        throw new Error('NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL is not configured. Add it in Vercel Environment Variables.');
    }

    // Timeout to prevent infinite server waits
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), GET_TIMEOUT_MS);

    try {
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'GET',
            redirect: 'follow',
            signal: controller.signal,
            cache: 'no-store', // Always fresh data from Google Sheets
        });

        clearTimeout(timeoutId);
        const text = await response.text();

        if (!response.ok) {
            throw new Error(`Failed to fetch from Google Sheet (HTTP ${response.status}): ${text.substring(0, 200)}`);
        }

        // Safely parse JSON — Google might return HTML (auth page) instead
        let result;
        try {
            result = JSON.parse(text);
        } catch {
            console.error('Non-JSON response from Apps Script (get):', text.substring(0, 300));
            throw new Error('Google Apps Script returned HTML instead of JSON. Redeploy your script with "Anyone" access.');
        }

        // Validate and normalize the response structure
        if (Array.isArray(result)) {
            return result;
        }

        if (result && typeof result === 'object' && Array.isArray(result.data)) {
            return result.data;
        }

        // If result is an object but not the expected format, return empty array
        console.warn('Unexpected response format from Apps Script:', JSON.stringify(result).substring(0, 200));
        return [];
    } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof DOMException && error.name === 'AbortError') {
            throw new Error('Google Apps Script request timed out (15s). Check your internet connection.');
        }
        if (error instanceof Error) throw error;
        throw new Error('Network error connecting to Google Apps Script');
    }
}

