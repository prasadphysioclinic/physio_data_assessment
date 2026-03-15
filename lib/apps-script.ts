// Google Apps Script integration
const APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;

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
    Media1?: string;
    Media2?: string;
    Media3?: string;
    Media4?: string;

    // Temporary storage for files being uploaded
    files?: {
        name: string;
        type: string;
        data: string; // base64
    }[];

    // Action for updates
    action?: 'create' | 'update';
    rowIndex?: number;
}

export async function saveToGoogleSheet(data: AssessmentData) {
    if (!APPS_SCRIPT_URL) {
        throw new Error('GOOGLE_APPS_SCRIPT_URL is not configured');
    }

    try {
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            redirect: 'follow',
        });

        const text = await response.text();

        if (!response.ok) {
            throw new Error(`Failed to save to Google Sheet: ${text.substring(0, 200)}`);
        }

        // Safely parse JSON - Google might return HTML instead
        try {
            return JSON.parse(text);
        } catch {
            console.error('Non-JSON response from Apps Script (save):', text.substring(0, 300));
            throw new Error('Google Apps Script returned invalid response. Check script deployment.');
        }
    } catch (error) {
        if (error instanceof Error) throw error;
        throw new Error('Network error connecting to Google Apps Script');
    }
}

export async function getFromGoogleSheet() {
    if (!APPS_SCRIPT_URL) {
        throw new Error('GOOGLE_APPS_SCRIPT_URL is not configured');
    }

    try {
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'GET',
            redirect: 'follow',
            next: { revalidate: 0 },
        });

        const text = await response.text();

        if (!response.ok) {
            throw new Error(`Failed to fetch from Google Sheet: ${text.substring(0, 200)}`);
        }

        // Safely parse JSON - Google might return HTML (auth page) instead
        let result;
        try {
            result = JSON.parse(text);
        } catch {
            console.error('Non-JSON response from Apps Script (get):', text.substring(0, 300));
            throw new Error('Google Apps Script returned HTML instead of JSON. Redeploy your script as "Anyone" access.');
        }

        // Handle both formats: direct array or { data: [...] }
        if (Array.isArray(result)) {
            return result;
        }

        return result.data || [];
    } catch (error) {
        if (error instanceof Error) throw error;
        throw new Error('Network error connecting to Google Apps Script');
    }
}
