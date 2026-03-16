import { NextResponse } from "next/server";
import { saveToGoogleSheet, getFromGoogleSheet, AssessmentData } from "@/lib/apps-script";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Map form data to exact Google Sheet column names from restructured Apps Script
        const rowData: AssessmentData = {
            Date: body.date || new Date().toISOString().split('T')[0],
            PatientName: body.name,
            Age: String(body.age),
            Sex: body.sex || "",
            Occupation: body.occupation || "",
            PhoneNumber: body.phoneNumber || "",
            Height: body.height || "",
            Weight: body.weight || "",
            BloodPressure: body.bloodPressure || "",
            DiabeticMellitus: body.diabeticMellitus || "",
            DietHabit: body.dietHabit || "",
            SleepingHistory: body.sleepingHistory || "",
            MenstruationHistory: body.menstruationHistory || "",

            ChiefComplaint: body.chiefComplaint || "",
            PresentHistory: body.presentHistory || "",
            PastHistory: body.pastHistory || "",
            DiagnosticImaging: body.diagnosticImaging || "",
            RedFlags: body.redFlags || "",
            Observation: body.observation || "",
            ActiveROM: body.activeROM || "",
            PassiveROM: body.passiveROM || "",
            MusclePower: body.musclePower || "",
            Palpation: body.palpation || "",
            Gait: body.gait || "",
            NeurologicalTests: body.neurologicalTests || "",
            Sensation: body.sensation || "",
            Reflexes: body.reflexes || "",
            SpecialTests: body.specialTests || "",
            EndFeel: body.endFeel || "",
            CapsularPattern: body.capsularPattern || "",
            ResistedIsometrics: body.resistedIsometrics || "",
            FunctionalTesting: body.functionalTesting || "",
            JointPlayMovements: body.jointPlayMovements || "",
            Comments: body.comments || "",

            PainHistory: body.painHistory || "",
            AggravatingFactors: body.aggravatingFactors || "",
            EasingFactors: body.easingFactors || "",
            PainDescription: body.painDescription || "",
            PainIntensity_VAS: body.painVas || 0,
            SymptomsLocation: body.symptomsLocation || "",

            Diagnosis: body.diagnosis || "",
            TreatmentPlan: body.treatmentPlan || "",
            ManualTherapy: body.manualTherapy || "",
            Electrotherapy: body.electrotherapy || "",
            ExercisePrescription: body.exercisePrescription || "",
            PatientEducation: body.patientEducation || "",
            HomeFollowups: body.homeFollowups || "",
            WhatTreatment: body.whatTreatment || "",
            PatientSummary: body.patientSummary || "",
            Review1: body.review1 || "",
            Review2: body.review2 || "",
            Review3: body.review3 || "",

            TwentyFourHourHistory: body.twentyFourHourHistory || "",
            ImprovingStaticWorse: body.improvingStaticWorse || "",
            NewOrOldInjury: body.newOldInjury || "",
            SubmittedBy: body.submittedBy || "System",

            Timestamp: new Intl.DateTimeFormat('en-GB', {
                dateStyle: 'short',
                timeStyle: 'medium',
                timeZone: 'Asia/Kolkata',
            }).format(new Date()),

            // Media file data for upload
            files: body.files || [],

            action: body.action || 'create',
            rowIndex: body.rowIndex
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
