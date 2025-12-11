// Google Apps Script integration
const APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;

export interface AssessmentData {
    Date: string;
    PatientName: string;
    Age: string;
    Occupation?: string;
    MechanismOfInjury?: string;
    AggravatingEasingFactors?: string;
    TwentyFourHourHistory?: string;
    ImprovingStaticWorse?: string;
    NewOrOldInjury?: string;
    PastHistory?: string;
    DiagnosticImaging?: string;
    PainLocation?: string;
    PainIntensity_VAS?: number;
    PainPattern?: string;
    ObservationPosture?: string;
    Active_L_Flex?: string;
    Active_R_Flex?: string;
    Active_L_Ext?: string;
    Active_R_Ext?: string;
    Passive_L_Flex?: string;
    Passive_R_Flex?: string;
    Passive_L_Ext?: string;
    Passive_R_Ext?: string;
    EndFeel?: string;
    CapsularPattern?: string;
    ResistedIsometrics?: string;
    FunctionalTesting?: string;
    SensoryScan?: string;
    Reflexes?: string;
    NeuroSpecialTests?: string;
    SpecialTests?: string;
    JointPlayMovements?: string;
    Palpation_Tenderness?: string;
    Palpation_Effusion?: string;
    Comments?: string;
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
