import { NextResponse } from "next/server";
import { getFromGoogleSheet, AssessmentData } from "@/lib/apps-script";

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

        const APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;

        if (!APPS_SCRIPT_URL) {
            throw new Error('GOOGLE_APPS_SCRIPT_URL is not configured');
        }

        // Map existing media URLs (ones the user kept) back into Media1-4 slots
        const existingMedia: string[] = body.existingMedia || [];

        // Prepare the data with the row index
        const updateData: AssessmentData = {
            rowIndex: assessmentIndex + 2, // +2: +1 header row, +1 for 1-based indexing
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
            AggravatingEasingFactors: body.aggravatingFactors || "",
            PastHistory: body.pastHistory || "",
            DiagnosticImaging: body.diagnosticImaging || "",
            RedFlags: body.redFlags || "",

            Observation: body.observation || "",
            ObservationPosture: body.observation || "", // Mapping both for compatibility
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
            PainPattern: body.painDescription || "", // Mapping both
            PainIntensity_VAS: body.painVas || 0,
            PainLocation: body.painLocation || "",
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

            // Preserve existing media URLs
            Media1: existingMedia[0] || "",
            Media2: existingMedia[1] || "",
            Media3: existingMedia[2] || "",
            Media4: existingMedia[3] || "",
        };

        // Include new file uploads if any
        const payload: any = {
            action: 'update',
            ...updateData,
        };

        if (body.files && body.files.length > 0) {
            payload.files = body.files;
        }

        // Send update request to Apps Script with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            redirect: 'follow',
            signal: controller.signal,
        });

        clearTimeout(timeoutId);
        const text = await response.text();

        if (!response.ok) {
            throw new Error(`Failed to update in Google Sheet: ${text.substring(0, 200)}`);
        }

        // Safe JSON parsing
        try {
            const result = JSON.parse(text);
            return NextResponse.json({ success: true, data: result });
        } catch {
            console.error('Non-JSON response from Apps Script (update):', text.substring(0, 300));
            return NextResponse.json({ success: true, message: 'Update sent but response was not JSON' });
        }

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

