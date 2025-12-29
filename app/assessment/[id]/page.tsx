import { getFromGoogleSheet } from "@/lib/apps-script";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Pencil, Phone, Calendar, User, Briefcase, Activity, Stethoscope, Heart, FileText } from "lucide-react";
import { notFound } from "next/navigation";
import { formatDate, formatDateTime } from "@/lib/format-date";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

// Helper component for displaying field
function Field({ label, value }: { label: string; value: any }) {
    const displayValue = value === undefined || value === null || value === '' ? 'N/A' : value;
    return (
        <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-base">{displayValue}</p>
        </div>
    );
}

export default async function AssessmentDetailPage(props: PageProps) {
    const params = await props.params;
    const assessments = await getFromGoogleSheet();
    const assessmentIndex = parseInt(params.id);

    if (isNaN(assessmentIndex) || assessmentIndex < 0 || assessmentIndex >= assessments.length) {
        notFound();
    }

    const a = assessments[assessmentIndex];

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <Button asChild variant="ghost" size="sm">
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </Button>
                <Button asChild variant="default" size="sm" className="w-full sm:w-auto">
                    <Link href={`/assessment/${assessmentIndex}/edit`}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Assessment
                    </Link>
                </Button>
            </div>

            <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Assessment Details
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {a.PatientName}
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(a.Date)}
                    </span>
                    {a.PhoneNumber && (
                        <>
                            <span className="hidden sm:inline">•</span>
                            <span className="flex items-center gap-1">
                                <Phone className="h-4 w-4" />
                                {a.PhoneNumber}
                            </span>
                        </>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                {/* ========== I. PATIENT DEMOGRAPHICS ========== */}
                <Card className="border-l-4 border-l-primary">
                    <CardHeader className="bg-primary/5">
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            I. Patient Demographics
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Field label="Name" value={a.PatientName} />
                            <Field label="Age" value={a.Age} />
                            <Field label="Sex" value={a.Sex} />
                            <Field label="Occupation" value={a.Occupation} />
                            <Field label="Phone Number" value={a.PhoneNumber} />
                            <Field label="Height" value={a.Height} />
                            <Field label="Weight" value={a.Weight} />
                            <Field label="Blood Pressure" value={a.BloodPressure} />
                            <Field label="Sugar Level" value={a.SugarLevel} />
                            <Field label="Date" value={formatDate(a.Date)} />
                        </div>
                    </CardContent>
                </Card>

                {/* ========== II. CLINICAL HISTORY ========== */}
                <Card>
                    <CardHeader className="bg-primary/5">
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            II. Clinical History
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                        <Field label="Chief Complaints" value={a.ChiefComplaint} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Present History" value={a.PresentHistory} />
                            <Field label="Past Medical History" value={a.PastHistory} />
                        </div>
                        <Field label="Diagnostic Image Reports" value={a.DiagnosticImaging} />
                        <Field label="Red Flags" value={a.RedFlags} />
                    </CardContent>
                </Card>

                {/* ========== III. OBSERVATION & PHYSICAL EXAMINATION ========== */}
                <Card>
                    <CardHeader className="bg-primary/5">
                        <CardTitle className="flex items-center gap-2">
                            <Stethoscope className="h-5 w-5" />
                            III. Observation & Physical Examination
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                        <Field label="On Observation (Posture)" value={a.Observation} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Active ROM" value={a.ActiveROM} />
                            <Field label="Passive ROM" value={a.PassiveROM} />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <Field label="Muscle Power" value={a.MusclePower} />
                            <Field label="Palpation" value={a.Palpation} />
                            <Field label="Gait" value={a.Gait} />
                        </div>

                        <div className="border-t pt-4">
                            <p className="text-sm font-medium text-muted-foreground mb-3">Neurological Screening</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <Field label="Sensation" value={a.Sensation} />
                                <Field label="Reflexes" value={a.Reflexes} />
                                <Field label="Neurological Tests" value={a.NeurologicalTests} />
                            </div>
                        </div>

                        <Field label="Special Tests (Orthopedic)" value={a.SpecialTests} />

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <Field label="End Feel" value={a.EndFeel} />
                            <Field label="Capsular Pattern" value={a.CapsularPattern} />
                            <Field label="Joint Play Movements" value={a.JointPlayMovements} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Resisted Isometric Movements" value={a.ResistedIsometrics} />
                            <Field label="Functional Testing" value={a.FunctionalTesting} />
                        </div>

                        <Field label="Additional Comments" value={a.Comments} />
                    </CardContent>
                </Card>

                {/* ========== IV. PAIN ASSESSMENT ========== */}
                <Card>
                    <CardHeader className="bg-primary/5">
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            IV. Pain Assessment
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                        <Field label="Pain History" value={a.PainHistory} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Aggravating Factors" value={a.AggravatingFactors} />
                            <Field label="Easing Factors" value={a.EasingFactors} />
                        </div>

                        <Field label="Type of Pain (Patient's Words)" value={a.PainDescription} />

                        <div className="bg-muted/50 p-4 rounded-lg">
                            <p className="text-sm font-medium text-muted-foreground">VAS Score (0-10)</p>
                            <p className="text-3xl font-bold text-primary">{a.PainIntensity_VAS || '0'}/10</p>
                        </div>

                        <Field label="Symptoms Location" value={a.SymptomsLocation} />
                    </CardContent>
                </Card>

                {/* ========== V. DIAGNOSIS & TREATMENT PLAN ========== */}
                <Card className="border-l-4 border-l-green-500">
                    <CardHeader className="bg-green-50/50 dark:bg-green-950/20">
                        <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                            <Heart className="h-5 w-5" />
                            V. Diagnosis & Treatment Plan
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                        <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
                            <p className="text-sm font-medium text-muted-foreground">Diagnosis</p>
                            <p className="text-lg font-semibold">{a.Diagnosis || 'N/A'}</p>
                        </div>

                        <Field label="Treatment Plan" value={a.TreatmentPlan} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Manual Therapy" value={a.ManualTherapy} />
                            <Field label="Electrotherapy / Modalities" value={a.Electrotherapy} />
                        </div>

                        <Field label="Exercise Prescription" value={a.ExercisePrescription} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Patient Education" value={a.PatientEducation} />
                            <Field label="Home Follow-ups" value={a.HomeFollowups} />
                        </div>

                        <Field label="Treatment Given (This Session)" value={a.WhatTreatment} />
                    </CardContent>
                </Card>

                {/* ========== VI. SUMMARY & FOLLOW-UP ========== */}
                <Card className="border-l-4 border-l-blue-500">
                    <CardHeader className="bg-blue-50/50 dark:bg-blue-950/20">
                        <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                            <FileText className="h-5 w-5" />
                            VI. Summary & Follow-up
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                        <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
                            <p className="text-sm font-medium text-muted-foreground">Patient Summary</p>
                            <p className="text-base">{a.PatientSummary || 'N/A'}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Field label="Review 1" value={a.Review1} />
                            <Field label="Review 2" value={a.Review2} />
                            <Field label="Review 3" value={a.Review3} />
                        </div>
                    </CardContent>
                </Card>

                {/* System Info */}
                <Card className="bg-muted/30">
                    <CardContent className="pt-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <Field label="Submitted By" value={a.SubmittedBy} />
                            <Field label="Timestamp" value={formatDateTime(a.Timestamp)} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
