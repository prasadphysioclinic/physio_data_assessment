import { NextResponse } from "next/server";
import { saveToGoogleSheet, getFromGoogleSheet, AssessmentData } from "@/lib/apps-script";

/**
 * POST /api/assessments
 * Handles clinical record creation. 
 * Maps frontend fields to strict Google Sheet column names.
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();

        // 65-Column Mapping Strategy (STRICT ALIGNMENT)
        const rowData: AssessmentData = {
            // 1-13
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

            // 14-18
            ChiefComplaint: body.chiefComplaint || "",
            PresentHistory: body.presentHistory || "",
            PastHistory: body.pastHistory || "",
            DiagnosticImaging: body.diagnosticImaging || "",
            RedFlags: body.redFlags || "",

            // 19-34
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

            // 35-40
            PainHistory: body.painHistory || "",
            AggravatingFactors: body.aggravatingFactors || "",
            EasingFactors: body.easingFactors || "",
            PainDescription: body.painDescription || "",
            PainIntensity_VAS: body.painVas || 0,
            SymptomsLocation: body.symptomsLocation || "",

            // 41-48
            Diagnosis: body.diagnosis || "",
            TreatmentPlan: body.treatmentPlan || "",
            ManualTherapy: body.manualTherapy || "",
            Electrotherapy: body.electrotherapy || "",
            ExercisePrescription: body.exercisePrescription || "",
            PatientEducation: body.patientEducation || "",
            HomeFollowups: body.homeFollowups || "",
            WhatTreatment: body.whatTreatment || "",

            // 49-52
            PatientSummary: body.patientSummary || "",
            Review1: body.review1 || "",
            Review2: body.review2 || "",
            Review3: body.review3 || "",
            DailyNote: body.dailyNote || "",

            // 53-56
            TwentyFourHourHistory: body.twentyFourHourHistory || "",
            ImprovingStaticWorse: body.improvingStaticWorse || "",
            NewOrOldInjury: body.newOldInjury || "",
            SubmittedBy: body.submittedBy || "System",

            // 57-60 (Handled by Apps Script on initial upload, but passed here for safety)
            Media1: "",
            Media2: "",
            Media3: "",
            Media4: "",

            Timestamp: new Intl.DateTimeFormat('en-GB', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit', second: '2-digit',
                hour12: true, timeZone: 'Asia/Kolkata',
            }).format(new Date()).replace(', ', ', '),

            // Payload metadata
            files: body.files || [],
            action: body.action || 'create',
            rowIndex: body.rowIndex
        };

        const result = await saveToGoogleSheet(rowData);
        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        console.error("Save Error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Persistence failure" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const assessments = await getFromGoogleSheet();
        return NextResponse.json(assessments);
    } catch (error) {
        console.error("Fetch Error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Retrieval failure" },
            { status: 500 }
        );
    }
}
