import { NextResponse } from "next/server";
import { saveToGoogleSheet, getFromGoogleSheet, AssessmentData } from "@/lib/apps-script";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Map form data to exact Google Sheet column names
        const rowData: AssessmentData = {
            // I. Patient Demographics
            Date: body.date,
            PatientName: body.name,
            Age: body.age,
            Sex: body.sex || "",
            Occupation: body.occupation || "",
            PhoneNumber: body.phoneNumber || "",
            Height: body.height || "",
            Weight: body.weight || "",
            BloodPressure: body.bloodPressure || "",
            SugarLevel: body.sugarLevel || "",

            // II. Clinical History
            ChiefComplaint: body.chiefComplaint || "",
            PresentHistory: body.presentHistory || "",
            PastHistory: body.pastHistory || "",
            DiagnosticImaging: body.diagnosticImaging || "",
            RedFlags: body.redFlags || "",

            // III. Observation & Physical Examination
            Observation: body.observation || "",
            ActiveROM: body.activeMovements || "",
            PassiveROM: body.passiveMovements || "",
            MusclePower: body.musclePower || "",
            Palpation: body.palpation || "",
            Gait: body.gait || "",
            NeurologicalTests: body.neurologicalTests || "",
            Sensation: body.sensation || "",
            Reflexes: body.reflexes || "",
            SpecialTests: body.specialTests || "",
            EndFeel: body.endFeel || "",
            CapsularPattern: body.capsularPattern || "",
            ResistedIsometrics: body.resistedIsometricMovements || "",
            FunctionalTesting: body.functionalTesting || "",
            JointPlayMovements: body.jointPlayMovements || "",
            Comments: body.comments || "",

            // IV. Pain Assessment
            PainHistory: body.painHistory || "",
            AggravatingFactors: body.aggravatingFactors || "",
            EasingFactors: body.easingFactors || "",
            PainDescription: body.painDescription || "",
            PainIntensity_VAS: body.painVas || 0,
            SymptomsLocation: body.symptomsLocation || "",

            // V. Diagnosis & Treatment Plan
            Diagnosis: body.diagnosis || "",
            TreatmentPlan: body.treatmentPlan || "",
            ManualTherapy: body.manualTherapy || "",
            Electrotherapy: body.electrotherapy || "",
            ExercisePrescription: body.exercisePrescription || "",
            PatientEducation: body.patientEducation || "",
            HomeFollowups: body.homeFollowups || "",
            WhatTreatment: body.whatTreatment || "",

            // VI. Summary & Follow-up
            PatientSummary: body.patientSummary || "",
            Review1: body.review1 || "",
            Review2: body.review2 || "",
            Review3: body.review3 || "",

            // Legacy fields
            TwentyFourHourHistory: body.twentyFourHourHistory || "",
            ImprovingStaticWorse: body.improvingStaticWorse || "",
            NewOrOldInjury: body.newOldInjury || "",

            // System fields
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
