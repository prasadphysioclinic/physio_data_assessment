import { getFromGoogleSheet } from "@/lib/apps-script";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Pencil, User, ClipboardList, Activity, Stethoscope, FileText, Camera, HeartPulse, Scale, Pill, Coffee, Moon, CalendarDays } from "lucide-react";
import { notFound } from "next/navigation";
import { formatDate, formatDateTime } from "@/lib/format-date";
import { DownloadReportButton } from "@/components/download-report";
import { convertDriveUrl, isVideoUrl } from "@/lib/utils-data";
import { ClinicalMediaGallery } from "@/components/media-gallery";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function AssessmentDetailPage(props: PageProps) {
    const params = await props.params;
    let assessments = [];
    
    try {
        assessments = await getFromGoogleSheet();
    } catch (error) {
        console.error("Failed to fetch assessment details:", error);
        return (
            <div className="p-4 sm:p-8 space-y-6">
                <Button asChild variant="ghost" size="sm">
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </Button>
                <Card className="border-destructive bg-destructive/5">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center justify-center text-center py-10">
                            <h2 className="text-xl font-bold text-destructive mb-2">Synchronisation Error</h2>
                            <p className="text-muted-foreground mb-6">Could not connect to the clinical database. Verify APPS_SCRIPT_URL.</p>
                            <Button asChild variant="outline">
                                <Link href="/">Return to Dashboard</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const assessmentIndex = Number(params.id);
    if (isNaN(assessmentIndex) || assessmentIndex < 0 || assessmentIndex >= assessments.length) {
        notFound();
    }

    const assessment = assessments[assessmentIndex];

    const SectionHeader = ({ icon: Icon, title }: { icon: any; title: string }) => (
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <Icon className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">{title}</h2>
        </div>
    );

    const InfoRow = ({ label, value, fullWidth = false }: { label: string; value: string | number | undefined; fullWidth?: boolean }) => (
        <div className={`space-y-1 ${fullWidth ? 'col-span-full' : ''}`}>
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{label}</p>
            <div className={`p-2.5 rounded-lg bg-slate-50 border border-slate-100 min-h-[42px] flex items-center`}>
                <p className="text-sm font-semibold text-slate-700 leading-snug">
                    {value || <span className="text-slate-300 font-normal italic">Empty</span>}
                </p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fafafa] p-4 sm:p-6 font-sans">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header Actions - Optimized for Speed */}
                <div className="flex items-center justify-between">
                    <Button asChild variant="outline" size="sm" className="rounded-xl border-slate-200 bg-white hover:bg-slate-50 transition-none h-10 px-4">
                        <Link href="/">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Dashboard
                        </Link>
                    </Button>
                    <div className="flex gap-2">
                        <DownloadReportButton assessment={assessment} />
                        <Button asChild size="sm" className="rounded-xl shadow-sm h-10 px-6 transition-none font-bold">
                            <Link href={`/assessment/${assessmentIndex}/edit`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit Record
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Patient Header */}
                <Card className="border-slate-200 shadow-sm rounded-2xl bg-white">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-5">
                                <div className="h-16 w-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                                    <User className="h-8 w-8" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">{assessment.PatientName || 'Unnamed Patient'}</h1>
                                    <div className="flex flex-wrap gap-4 text-[11px] font-black text-slate-500 mt-1 uppercase tracking-wider">
                                        <span className="flex items-center gap-1.5"><Activity className="h-3.5 w-3.5" /> AGE: {assessment.Age || 'N/A'}</span>
                                        <span className="flex items-center gap-1.5 text-primary">STATUS: {assessment.ImprovingStaticWorse || 'STATIC'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Updated</p>
                                <p className="text-sm font-bold text-slate-700">{assessment.Timestamp ? formatDateTime(assessment.Timestamp) : formatDate(assessment.Date)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Demographics and Core History */}
                    <div className="space-y-6">
                        <Card className="border-slate-200 shadow-sm rounded-2xl bg-white">
                            <CardContent className="p-5">
                                <SectionHeader title="Patient Profile" icon={User} />
                                <div className="grid grid-cols-2 gap-4">
                                    <InfoRow label="Gender" value={assessment.Sex} />
                                    <InfoRow label="Occupation" value={assessment.Occupation} />
                                    <InfoRow label="Phone" value={assessment.PhoneNumber} />
                                    <InfoRow label="Physique" value={`${assessment.Height || '-'} / ${assessment.Weight || '-'}`} />
                                    <InfoRow label="Vitals" value={assessment.BloodPressure} />
                                    <InfoRow label="Diabetes" value={assessment.DiabeticMellitus} />
                                    <InfoRow label="Habits" value={assessment.DietHabit} fullWidth />
                                    <InfoRow label="Sleep" value={assessment.SleepingHistory} />
                                    <InfoRow label="Cycle" value={assessment.MenstruationHistory} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-200 shadow-sm rounded-2xl bg-white">
                            <CardContent className="p-5">
                                <SectionHeader title="Clinical History" icon={ClipboardList} />
                                <div className="space-y-4">
                                    <InfoRow label="Chief Complaint" value={assessment.ChiefComplaint} fullWidth />
                                    <InfoRow label="History of Illness" value={assessment.PresentHistory} fullWidth />
                                    <InfoRow label="Past Medical" value={assessment.PastHistory} fullWidth />
                                    <InfoRow label="Findings" value={assessment.DiagnosticImaging} fullWidth />
                                    <InfoRow label="Injury Type" value={assessment.NewOrOldInjury} />
                                    <InfoRow label="Red Flags" value={assessment.RedFlags} fullWidth />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Middle: Functional Assessment */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-slate-200 shadow-sm rounded-2xl bg-white">
                            <CardContent className="p-5">
                                <SectionHeader title="Physical Examination" icon={Activity} />
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <InfoRow label="Observation" value={assessment.Observation} fullWidth />
                                    <InfoRow label="Active ROM" value={assessment.ActiveROM} />
                                    <InfoRow label="Passive ROM" value={assessment.PassiveROM} />
                                    <InfoRow label="Muscle Power" value={assessment.MusclePower} />
                                    <InfoRow label="Palpation" value={assessment.Palpation} />
                                    <InfoRow label="Gait" value={assessment.Gait} />
                                    <InfoRow label="End Feel" value={assessment.EndFeel} />
                                    <InfoRow label="Functional" value={assessment.FunctionalTesting} />
                                    <InfoRow label="Capsular" value={assessment.CapsularPattern} />
                                    <InfoRow label="Isometrics" value={assessment.ResistedIsometrics} />
                                    <InfoRow label="Joint Play" value={assessment.JointPlayMovements} />
                                    <InfoRow label="Add. Comments" value={assessment.Comments} fullWidth />
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="border-slate-200 shadow-sm rounded-2xl bg-white">
                                <CardContent className="p-5">
                                    <SectionHeader title="Neurological" icon={Stethoscope} />
                                    <div className="space-y-4">
                                        <InfoRow label="Neuro Mapping" value={assessment.NeurologicalTests} fullWidth />
                                        <InfoRow label="Sensory" value={assessment.Sensation} fullWidth />
                                        <InfoRow label="DTR Reflexes" value={assessment.Reflexes} fullWidth />
                                        <InfoRow label="Special Tests" value={assessment.SpecialTests} fullWidth />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-slate-200 shadow-sm rounded-2xl bg-white">
                                <CardContent className="p-5">
                                    <SectionHeader title="Pain Profile" icon={Activity} />
                                    <div className="space-y-4">
                                        <InfoRow label="VAS Index (0-10)" value={`${(Number(assessment.PainIntensity_VAS) || 0) / 10}/10`} fullWidth />
                                        <InfoRow label="24h Response" value={assessment.TwentyFourHourHistory} fullWidth />
                                        <InfoRow label="Description" value={assessment.PainDescription} fullWidth />
                                        <div className="grid grid-cols-2 gap-4">
                                            <InfoRow label="Aggravating" value={assessment.AggravatingFactors} />
                                            <InfoRow label="Easing" value={assessment.EasingFactors} />
                                        </div>
                                        <InfoRow label="Location" value={assessment.SymptomsLocation} fullWidth />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Treatment Section */}
                        <Card className="border-slate-200 shadow-sm rounded-2xl bg-white">
                            <CardContent className="p-5">
                                <SectionHeader title="Clinical Management" icon={Pill} />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <InfoRow label="Diagnosis" value={assessment.Diagnosis} fullWidth />
                                        <InfoRow label="Strategy" value={assessment.TreatmentPlan} fullWidth />
                                        <InfoRow label="Intervention" value={assessment.WhatTreatment} fullWidth />
                                        <InfoRow label="Education" value={assessment.PatientEducation} fullWidth />
                                    </div>
                                    <div className="grid grid-cols-1 gap-3 content-start">
                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                                            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                                                <span className="text-[10px] font-bold text-slate-400">Manual</span>
                                                <span className="text-xs font-bold text-slate-700">{assessment.ManualTherapy || '-'}</span>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                                                <span className="text-[10px] font-bold text-slate-400">Electro</span>
                                                <span className="text-xs font-bold text-slate-700">{assessment.Electrotherapy || '-'}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-bold text-slate-400">Exercise</span>
                                                <span className="text-xs font-bold text-slate-700">{assessment.ExercisePrescription || '-'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Media Section */}
                        <Card className="border-slate-200 shadow-sm rounded-2xl bg-white">
                            <CardContent className="p-5">
                                <SectionHeader title="Clinical Media" icon={Camera} />
                                {(() => {
                                    const allMedia: string[] = [];
                                    const seenUrls = new Set<string>();
                                    const urlRegex = /(https?:\/\/[^\s]+|drive\.google\.com[^\s]+)/gi;
                                    const mediaColumns = ['Media1', 'Media2', 'Media3', 'Media4'];
                                    
                                    mediaColumns.forEach(col => {
                                        const value = assessment[col];
                                        if (!value) return;
                                        const valStr = String(value).trim();
                                        const matches = valStr.match(urlRegex);
                                        if (matches) {
                                            matches.forEach(m => {
                                                if (!seenUrls.has(m)) { allMedia.push(m); seenUrls.add(m); }
                                            });
                                        } else if (valStr.length >= 25 && valStr.length <= 50) {
                                           if (!seenUrls.has(valStr)) { allMedia.push(valStr); seenUrls.add(valStr); }
                                        }
                                    });

                                    if (allMedia.length === 0) {
                                        return <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-xl text-slate-300 text-[11px] font-black uppercase">No Media Files Found</div>;
                                    }

                                    return <ClinicalMediaGallery urls={allMedia} />;
                                })()}
                            </CardContent>
                        </Card>

                        {/* Summary & Daily Note Section */}
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                            <Card className="border-slate-200 shadow-sm rounded-2xl bg-white border-t-2 border-t-primary">
                                <CardContent className="p-5 space-y-6">
                                    <SectionHeader title="Session Notes & Summary" icon={FileText} />
                                    
                                    <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10">
                                        <p className="text-[9px] font-black text-primary tracking-widest mb-2 uppercase">Daily Progress Note</p>
                                        <p className="text-sm font-bold text-slate-800 leading-relaxed italic">
                                            "{assessment.DailyNote || 'No entry recorded for this session.'}"
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <InfoRow label="Review 1" value={assessment.Review1} />
                                        <InfoRow label="Review 2" value={assessment.Review2} />
                                        <InfoRow label="Review 3" value={assessment.Review3} />
                                    </div>
                                    <InfoRow label="Case Summary" value={assessment.PatientSummary} fullWidth />
                                    <div className="flex justify-between text-[9px] font-black text-slate-400 pt-6 border-t border-slate-100 uppercase tracking-widest">
                                        <span>Authenticated By: {assessment.SubmittedBy || 'Staff'}</span>
                                        <span>Medically Verified Record</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
