import { NextResponse } from "next/server";
import { getFromGoogleSheet } from "@/lib/apps-script";

export const dynamic = 'force-dynamic';

interface RouteParams {
    params: Promise<{
        id: string;
    }>;
}

export async function PUT(request: Request, context: RouteParams) {
    try {
        const params = await context.params;
        const assessmentIndex = parseInt(params.id);
        const body = await request.json();

        // Get all assessments from Google Sheet
        const assessments = await getFromGoogleSheet();

        if (isNaN(assessmentIndex) || assessmentIndex < 0 || assessmentIndex >= assessments.length) {
            return NextResponse.json(
                { error: "Assessment not found" },
                { status: 404 }
            );
        }

        // Update the Google Sheet via Apps Script
        // Since Google Sheets doesn't have a direct "update row" API,
        // we need to use the Apps Script to update the specific row
        const APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;

        if (!APPS_SCRIPT_URL) {
            throw new Error('GOOGLE_APPS_SCRIPT_URL is not configured');
        }

        // Prepare the data with the row index
        const updateData = {
            rowIndex: assessmentIndex + 2, // +2 because: +1 for header row, +1 for 1-based indexing
            Date: body.date,
            PatientName: body.name,
            Age: body.age,
            Occupation: body.occupation || "",
            MechanismOfInjury: body.mechanismOfInjury || "",
            AggravatingEasingFactors: body.aggravatingFactors || "",
            TwentyFourHourHistory: body.twentyFourHourHistory || "",
            ImprovingStaticWorse: body.improvingStaticWorse || "",
            NewOrOldInjury: body.newOldInjury || "",
            PastHistory: body.pastHistory || "",
            DiagnosticImaging: body.diagnosticImaging || "",
            PainLocation: body.painLocation || "",
            BodyMapImage: "",
            PainIntensity_VAS: body.painVas || 0,
            PainPattern: body.painDescription || "",
            ObservationPosture: body.observation || "",
            Active_L_Flex: "",
            Active_R_Flex: "",
            Active_L_Ext: "",
            Active_R_Ext: "",
            Passive_L_Flex: "",
            Passive_R_Flex: "",
            Passive_L_Ext: "",
            Passive_R_Ext: "",
            EndFeel: body.endFeel || "",
            CapsularPattern: body.capsularPattern || "",
            ResistedIsometrics: body.resistedIsometricMovements || "",
            FunctionalTesting: body.functionalTesting || "",
            SensoryScan: body.sensoryScan || "",
            Reflexes: body.reflexes || "",
            NeuroSpecialTests: body.neuroSpecialTests || "",
            SpecialTests: body.specialTests || "",
            JointPlayMovements: body.jointPlayMovements || "",
            Palpation_Tenderness: body.palpation_Tenderness || "",
            Palpation_Effusion: body.palpation_Effusion || "",
            Comments: body.comments || "",
            SubmittedBy: "System (Updated)",
            Timestamp: new Date().toISOString(),
        };

        // Send update request to Apps Script
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'update',
                ...updateData
            }),
            redirect: 'follow',
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to update in Google Sheet: ${errorText}`);
        }

        const result = await response.json();
        return NextResponse.json({ success: true, data: result });

    } catch (error) {
        console.error("Error updating assessment:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to update assessment" },
            { status: 500 }
        );
    }
}
