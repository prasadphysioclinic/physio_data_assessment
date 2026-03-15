import { NextResponse } from "next/server";
import { getFromGoogleSheet, saveToGoogleSheet, AssessmentData } from "@/lib/apps-script";

export const dynamic = 'force-dynamic';

interface RouteParams {
    params: Promise<{
        id: string;
    }>;
}

export async function PUT(request: Request, context: RouteParams) {
    try {
        const params = await context.params;
        const assessmentIndex = Number(params.id);
        const body = await request.json();

        // Get all assessments from Google Sheet
        const assessments = await getFromGoogleSheet();

        if (isNaN(assessmentIndex) || assessmentIndex < 0 || assessmentIndex >= assessments.length) {
            return NextResponse.json(
                { error: "Assessment not found" },
                { status: 404 }
            );
        }

        const existingRow = assessments[assessmentIndex];
        const existingMedia: string[] = body.existingMedia || [];

        // Prepare the data with the row index, merging with existing row data to PRESERVE OTHER COLUMNS
        const updateData: any = {
            ...existingRow, // Spread everything first (preserves unknown columns)
            rowIndex: assessmentIndex + 2,
            Date: body.date,
            PatientName: body.name,
            Age: body.age,
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
            MechanismOfInjury: body.mechanismOfInjury || "",
            AggravatingEasingFactors: body.aggravatingEasingFactors || "", // Fixed key
            PastHistory: body.pastHistory || "",
            DiagnosticImaging: body.diagnosticImaging || "",
            RedFlags: body.redFlags || "",

            Observation: body.observation || "",
            ObservationPosture: body.observationPosture || "", 
            ActiveROM: body.activeROM || "",
            Active_L_Flex: body.active_L_Flex || "",
            Active_R_Flex: body.active_R_Flex || "",
            Active_L_Ext: body.active_L_Ext || "",
            Active_R_Ext: body.active_R_Ext || "",
            PassiveROM: body.passiveROM || "",
            Passive_L_Flex: body.passive_L_Flex || "",
            Passive_R_Flex: body.passive_R_Flex || "",
            Passive_L_Ext: body.passive_L_Ext || "",
            Passive_R_Ext: body.passive_R_Ext || "",
            MusclePower: body.musclePower || "",
            Palpation: body.palpation || "",
            Palpation_Tenderness: body.palpation_Tenderness || "",
            Palpation_Effusion: body.palpation_Effusion || "",
            Gait: body.gait || "",
            NeurologicalTests: body.neurologicalTests || "",
            SensoryScan: body.sensoryScan || "",
            Reflexes: body.reflexes || "",
            SpecialTests: body.specialTests || "",
            NeuroSpecialTests: body.neuroSpecialTests || "",
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
            PainPattern: body.painPattern || "", 
            PainIntensity_VAS: body.painVas || 0,
            PainLocation: body.painLocation || "",
            SymptomsLocation: body.symptomsLocation || "",

            Diagnosis: body.diagnosis || "",
            TreatmentPlan: body.treatmentPlan || "",
            ManualTherapy: body.manualTherapy || "",
            Electrotherapy: body.electrotherapy || "",
            ExercisePrescription: body.exercisePrescription || "",
            PatientEducation: body.patientEducation || "" ,
            HomeFollowups: body.homeFollowups || "",
            WhatTreatment: body.whatTreatment || "",

            PatientSummary: body.patientSummary || "",
            Review1: body.review1 || "",
            Review2: body.review2 || "",
            Review3: body.review3 || "",
            DailyNotes: body.dailyNotes || "",

            TwentyFourHourHistory: body.twentyFourHourHistory || "",
            ImprovingStaticWorse: body.improvingStaticWorse || "",
            NewOrOldInjury: body.newOldInjury || "",
            SubmittedBy: "System (Updated)",
            Timestamp: new Intl.DateTimeFormat('en-GB', {
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit', second: '2-digit',
                hour12: false, timeZone: 'Asia/Kolkata'
            }).format(new Date()),

            // ─── MEDIA PRESERVATION LOGIC ─────────────────────────────────────
            // We only update Media columns if we have explicit values from the form.
            // This prevents accidental deletion of images stored in non-standard columns.
            
            // Map the current state of existing media back to standard slots
            Media_1: existingMedia.length > 0 ? existingMedia[0] : (existingRow.Media_1 || existingRow.Media1 || ""),
            Media_2: existingMedia.length > 1 ? existingMedia[1] : (existingRow.Media_2 || existingRow.Media2 || ""),
            Media_3: existingMedia.length > 2 ? existingMedia[2] : (existingRow.Media_3 || existingRow.Media3 || ""),
            Media_4: existingMedia.length > 3 ? existingMedia[3] : (existingRow.Media_4 || existingRow.Media4 || ""),
            
            // Also update non-underscored versions for legacy compatibility
            Media1: existingMedia.length > 0 ? existingMedia[0] : (existingRow.Media1 || existingRow.Media_1 || ""),
            Media2: existingMedia.length > 1 ? existingMedia[1] : (existingRow.Media2 || existingRow.Media_2 || ""),
            Media3: existingMedia.length > 2 ? existingMedia[2] : (existingRow.Media3 || existingRow.Media_3 || ""),
            Media4: existingMedia.length > 3 ? existingMedia[3] : (existingRow.Media4 || existingRow.Media_4 || ""),
        };

        const payload: any = {
            action: 'update',
            ...updateData,
        };

        if (body.files && body.files.length > 0) {
            payload.files = body.files;
        }

        const result = await saveToGoogleSheet(payload);
        return NextResponse.json({ success: true, data: result });

    } catch (error) {
        console.error("Error updating assessment:", error);
        if (error instanceof DOMException && error.name === 'AbortError') {
            return NextResponse.json(
                { error: "Request to Google Apps Script timed out (30s)" },
                { status: 504 }
            );
        }
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to update assessment" },
            { status: 500 }
        );
    }
}

