import { NextResponse } from "next/server";
import { saveToGoogleSheet, getFromGoogleSheet, AssessmentData } from "@/lib/apps-script";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Map form data to exact Google Sheet column names
        const rowData: AssessmentData = {
            Date: body.date,
            PatientName: body.name,
            Age: body.age,
            PhoneNumber: body.phoneNumber || "",
            Occupation: body.occupation || "",
            ChiefComplaint: body.chiefComplaint || "",
            PresentHistory: body.presentHistory || "",
            PastHistory: body.pastHistory || "",
            AggravatingEasingFactors: body.aggravatingFactors || "",
            TwentyFourHourHistory: body.twentyFourHourHistory || "",
            ImprovingStaticWorse: body.improvingStaticWorse || "",
            NewOrOldInjury: body.newOldInjury || "",
            DiagnosticImaging: body.diagnosticImaging || "",
            PainLocation: body.painLocation || "",
            PainIntensity_VAS: body.painVas || 0,
            PainPattern: body.painDescription || "",
            ObservationPosture: body.observation || "",
            Active_L_Flex: body.active_L_Flex || "",
            Active_R_Flex: body.active_R_Flex || "",
            Active_L_Ext: body.active_L_Ext || "",
            Active_R_Ext: body.active_R_Ext || "",
            Passive_L_Flex: body.passive_L_Flex || "",
            Passive_R_Flex: body.passive_R_Flex || "",
            Passive_L_Ext: body.passive_L_Ext || "",
            Passive_R_Ext: body.passive_R_Ext || "",
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
            WhatTreatment: body.whatTreatment || "",
            TreatmentPlan: body.treatmentPlan || "",
            SubmittedBy: body.submittedBy || "System",
            Timestamp: new Date().toISOString(),
        };

        const result = await saveToGoogleSheet(rowData);

        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        console.error("Error saving assessment:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to save assessment" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const assessments = await getFromGoogleSheet();
        return NextResponse.json(assessments);
    } catch (error) {
        console.error("Error fetching assessments:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to fetch assessments" },
            { status: 500 }
        );
    }
}
