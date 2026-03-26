import { NextResponse } from "next/server";
import { getFromGoogleSheet, saveToGoogleSheet, AssessmentData } from "@/lib/apps-script";

export const dynamic = 'force-dynamic';

interface RouteParams {
    params: Promise<{
        id: string;
    }>;
}

/**
 * PUT /api/assessments/[id]
 * Handles record updates. 
 * Implements "Merge & Preserve" strategy for the 65 clinical columns.
 */
export async function PUT(request: Request, context: RouteParams) {
    try {
        const params = await context.params;
        const assessmentIndex = Number(params.id);
        const body = await request.json();

        // Fetch state to merge
        const assessments = await getFromGoogleSheet();

        if (isNaN(assessmentIndex) || assessmentIndex < 0 || assessmentIndex >= assessments.length) {
            return NextResponse.json({ error: "Record not found" }, { status: 404 });
        }

        const existingRow = assessments[assessmentIndex];
        const existingMedia: string[] = body.existingMedia || [];

        // 65-Column Mapping Strategy (UPDATE PHASE)
        const updateData: AssessmentData = {
            // 1-13: Patient Basics
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

            // 14-18: Clinical History
            ChiefComplaint: body.chiefComplaint || "",
            PresentHistory: body.presentHistory || "",
            PastHistory: body.pastHistory || "",
            DiagnosticImaging: body.diagnosticImaging || "",
            RedFlags: body.redFlags || "",

            // 19-30: Physical Exam & Comments
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
            FunctionalTesting: body.functionalTesting || "",
            Comments: body.comments || "",

            // 31-36: Pain Profile
            PainHistory: body.painHistory || "",
            AggravatingFactors: body.aggravatingFactors || "",
            EasingFactors: body.easingFactors || "",
            PainDescription: body.painDescription || "",
            PainIntensity_VAS: body.painVas || 0,
            SymptomsLocation: body.symptomsLocation || "",

            // 37-44: Treatment Strategy
            ['Problem List']: body.diagnosis || "",
            TreatmentPlan: body.treatmentPlan || "",
            ManualTherapy: body.manualTherapy || "",
            Electrotherapy: body.electrotherapy || "",
            ExercisePrescription: body.exercisePrescription || "",
            PatientEducation: body.patientEducation || "" ,
            HomeFollowups: body.homeFollowups || "",
            ['Specific advice']: body.whatTreatment || "",

            // 45-49: Summaries & Notes
            Review1: body.review1 || "",
            Review2: body.review2 || "",
            Review3: body.review3 || "",
            DailyNote: body.dailyNote || "",

            // 50-53: Media Preservation
            Media1: existingMedia.length > 0 ? existingMedia[0] : (existingRow.Media1 || ""),
            Media2: existingMedia.length > 1 ? existingMedia[1] : (existingRow.Media2 || ""),
            Media3: existingMedia.length > 2 ? existingMedia[2] : (existingRow.Media3 || ""),
            Media4: existingMedia.length > 3 ? existingMedia[3] : (existingRow.Media4 || ""),

            // 54: Timestamp Management
            Timestamp: new Intl.DateTimeFormat('en-GB', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit', second: '2-digit',
                hour12: true, timeZone: 'Asia/Kolkata'
            }).format(new Date()).replace(', ', ', '),

            // System Identification (Strategic Row Addressing)
            id: assessmentIndex,
            rowIndex: assessmentIndex + 2, // Map array index to 1-based sheet row (Header is Row 1)
            action: 'update'
        };

        const payload: any = { ...updateData };
        if (body.files && body.files.length > 0) {
            payload.files = body.files;
        }

        const result = await saveToGoogleSheet(payload);
        return NextResponse.json({ success: true, data: result });

    } catch (error) {
        console.error("Update Error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Sync failure" },
            { status: 500 }
        );
    }
}
