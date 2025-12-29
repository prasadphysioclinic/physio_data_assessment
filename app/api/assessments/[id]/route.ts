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

        const APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;

        if (!APPS_SCRIPT_URL) {
            throw new Error('GOOGLE_APPS_SCRIPT_URL is not configured');
        }

        // Prepare the data with all new fields
        const updateData = {
            action: 'update',
            rowIndex: assessmentIndex + 2, // +2 for header row and 1-based indexing

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

            // System fields
            SubmittedBy: "System (Updated)",
            Timestamp: new Date().toISOString(),
        };

        // Send update request to Apps Script
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData),
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
