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
    SugarLevel?: string;

    // II. Clinical History
    ChiefComplaint?: string;
    PresentHistory?: string;
    PastHistory?: string;
    DiagnosticImaging?: string;
    RedFlags?: string;

    // III. Observation & Physical Examination
    Observation?: string;
    ActiveROM?: string;
    PassiveROM?: string;
    MusclePower?: string;
    Palpation?: string;
    Gait?: string;
    NeurologicalTests?: string;
    Sensation?: string;
    Reflexes?: string;
    SpecialTests?: string;
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
    PainIntensity_VAS?: number;
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

    // Legacy fields
    TwentyFourHourHistory?: string;
    ImprovingStaticWorse?: string;
    NewOrOldInjury?: string;

    // System fields
    SubmittedBy?: string;
    Timestamp?: string;
}

export async function saveToGoogleSheet(data: AssessmentData) {
    if (!APPS_SCRIPT_URL) {
        throw new Error('GOOGLE_APPS_SCRIPT_URL is not configured');
    }

    const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        redirect: 'follow',
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save to Google Sheet: ${errorText}`);
    }

    return await response.json();
}

export async function getFromGoogleSheet() {
    if (!APPS_SCRIPT_URL) {
        throw new Error('GOOGLE_APPS_SCRIPT_URL is not configured');
    }

    const response = await fetch(APPS_SCRIPT_URL, {
        method: 'GET',
        redirect: 'follow',
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch from Google Sheet: ${errorText}`);
    }

    const result = await response.json();
    return result.data || [];
}
