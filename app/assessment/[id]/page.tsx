import { getFromGoogleSheet } from "@/lib/apps-script";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Pencil, User, ClipboardList, Activity, Stethoscope, FileText, Camera, HeartPulse, Scale, Pill, Coffee, Moon, CalendarDays } from "lucide-react";
import { notFound } from "next/navigation";
import { formatDate, formatDateTime } from "@/lib/format-date";
import { DownloadReportButton } from "@/components/download-report";
import { convertDriveUrl, isVideoUrl } from "@/lib/utils-data";

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

    const SectionHeader = ({ icon: Icon, title, bgColor, textColor }: { icon: any; title: string; bgColor: string; textColor: string }) => (
        <div className="flex items-center gap-3 mb-5 border-b pb-4">
            <div className={`p-2.5 rounded-2xl ${bgColor} ${textColor} shadow-inner`}>
                <Icon className="h-5 w-5" />
            </div>
            <h2 className={`text-xl font-black tracking-tight ${textColor}`}>{title}</h2>
        </div>
    );

    const InfoRow = ({ label, value, fullWidth = false, icon: Icon }: { label: string; value: string | number | undefined; fullWidth?: boolean; icon?: any }) => (
        <div className={`group transition-all duration-300 ${fullWidth ? 'col-span-full' : ''}`}>
            <div className="flex items-center gap-2 mb-1.5">
                {Icon && <Icon className="h-4 w-4 text-primary/40 group-hover:text-primary/70 transition-colors" />}
                <p className="text-[10px] uppercase tracking-widest font-black text-slate-400/80">{label}</p>
            </div>
            <div className={`p-3 rounded-xl bg-slate-50/50 border border-slate-100/50 group-hover:border-primary/20 group-hover:bg-white transition-all ${fullWidth ? 'min-h-[60px]' : ''}`}>
                <p className="text-[13px] font-bold text-slate-800 leading-relaxed">
                    {value || <span className="text-slate-300 font-medium italic">Empty</span>}
                </p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-10 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <Button asChild variant="ghost" size="sm" className="w-fit rounded-2xl hover:bg-white hover:shadow-sm transition-all text-slate-500 font-bold">
                        <Link href="/">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Return to Dashboard
                        </Link>
                    </Button>
                    <div className="flex gap-3">
                        <DownloadReportButton assessment={assessment} />
                        <Button asChild size="sm" className="bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 rounded-2xl px-6 h-11 border-none transform active:scale-95 transition-all text-sm font-black tracking-wide">
                            <Link href={`/assessment/${assessmentIndex}/edit`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit Record
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Hero Patient Section */}
                <Card className="overflow-hidden border-none shadow-2xl bg-white rounded-[2rem]">
                    <div className="h-3 bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600" />
                    <CardContent className="p-8 sm:p-12">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div className="flex items-center gap-7">
                                <div className="h-20 w-20 rounded-[1.5rem] bg-primary/5 flex items-center justify-center text-primary shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)]">
                                    <User className="h-10 w-10" />
                                </div>
                                <div>
                                    <h1 className="text-3xl sm:text-4xl font-[900] text-slate-900 tracking-tight leading-none mb-3 italic">{assessment.PatientName || 'Unnamed Patient'}</h1>
                                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500 font-black uppercase tracking-widest">
                                        <span className="flex items-center"><Activity className="h-4 w-4 mr-2 text-primary/60" /> Age: {assessment.Age || 'N/A'}</span>
                                        <span className="flex items-center"><ClipboardList className="h-4 w-4 mr-2 text-primary/60" /> File: #{assessmentIndex + 1}</span>
                                        <span className={`flex items-center px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 ${assessment.ImprovingStaticWorse?.toLowerCase().includes('improving') ? 'text-emerald-600' : 'text-primary'}`}>
                                            Status: {assessment.ImprovingStaticWorse || 'Static'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-50/80 backdrop-blur-sm p-6 rounded-[1.5rem] border border-slate-100 min-w-[240px] shadow-sm flex flex-col justify-center">
                                <p className="text-[10px] uppercase font-black text-slate-400 mb-2 tracking-[0.2em]">Clinical Timestamp</p>
                                <p className="text-base font-black text-slate-700 tracking-tight">
                                    {assessment.Timestamp ? formatDateTime(assessment.Timestamp) : formatDate(assessment.Date)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Daily Note Feature Section */}
                {assessment.DailyNote && (
                    <Card className="border-none shadow-xl bg-primary text-white rounded-[2rem] overflow-hidden">
                        <CardContent className="p-8 flex items-start gap-6">
                            <div className="p-4 rounded-3xl bg-white/10 text-white shadow-inner">
                                <FileText className="h-8 w-8" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-[11px] font-[900] uppercase tracking-[0.3em] text-white/60">Professional Consultation Note</p>
                                <p className="text-xl font-bold leading-relaxed">{assessment.DailyNote}</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Demographics and History */}
                    <div className="lg:col-span-1 space-y-8">
                        <Card className="border-none shadow-xl rounded-[2rem] bg-white overflow-hidden">
                            <CardContent className="p-8 pt-10">
                                <SectionHeader title="Demographics" icon={User} bgColor="bg-blue-50" textColor="text-blue-600" />
                                <div className="grid grid-cols-1 gap-5">
                                    <div className="grid grid-cols-2 gap-4">
                                        <InfoRow label="Gender" value={assessment.Sex} />
                                        <InfoRow label="Occupation" value={assessment.Occupation} />
                                    </div>
                                    <InfoRow label="Phone Number" value={assessment.PhoneNumber} />
                                    <InfoRow label="Physique (H/W)" value={`${assessment.Height || '-'} / ${assessment.Weight || '-'}`} icon={Scale} />
                                    <InfoRow label="Clinical Vitals" value={`BP: ${assessment.BloodPressure || 'N/A'} | DM: ${assessment.DiabeticMellitus || 'No'}`} icon={HeartPulse} />
                                    <InfoRow label="Diet Habits" value={assessment.DietHabit} icon={Coffee} />
                                    <InfoRow label="Sleep Pattern" value={assessment.SleepingHistory} icon={Moon} />
                                    <InfoRow label="Menstrual Course" value={assessment.MenstruationHistory} icon={CalendarDays} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-xl rounded-[2rem] bg-white overflow-hidden">
                            <CardContent className="p-8 pt-10">
                                <SectionHeader title="Clinical History" icon={ClipboardList} bgColor="bg-amber-50" textColor="text-amber-600" />
                                <div className="space-y-5">
                                    <InfoRow label="Chief Complaint" value={assessment.ChiefComplaint} fullWidth />
                                    <InfoRow label="Present Illness" value={assessment.PresentHistory} fullWidth />
                                    <InfoRow label="Past Medical History" value={assessment.PastHistory} fullWidth />
                                    <InfoRow label="Imaging / Diagnostics" value={assessment.DiagnosticImaging} fullWidth />
                                    <InfoRow label="Clinical Presentation" value={assessment.ImprovingStaticWorse} />
                                    <InfoRow label="Injury Classification" value={assessment.NewOrOldInjury} />
                                    <div className="pt-2">
                                        <InfoRow label="Risk Factors / Red Flags" value={assessment.RedFlags} fullWidth />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Middle Column: Physical Examination */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="border-none shadow-xl rounded-[2rem] bg-white overflow-hidden">
                            <CardContent className="p-8 pt-10">
                                <SectionHeader title="Structural Analysis" icon={Activity} bgColor="bg-emerald-50" textColor="text-emerald-600" />
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <InfoRow label="Static Observation" value={assessment.Observation} fullWidth />
                                    <InfoRow label="Active ROM" value={assessment.ActiveROM} />
                                    <InfoRow label="Passive ROM" value={assessment.PassiveROM} />
                                    <InfoRow label="Muscle Power (MMT)" value={assessment.MusclePower} />
                                    <InfoRow label="Tissue Palpation" value={assessment.Palpation} />
                                    <InfoRow label="Gait Analysis" value={assessment.Gait} />
                                    <InfoRow label="End Feel" value={assessment.EndFeel} />
                                    <InfoRow label="Capsular Pattern" value={assessment.CapsularPattern} />
                                    <InfoRow label="Resisted Isometrics" value={assessment.ResistedIsometrics} />
                                    <InfoRow label="Functional Testing" value={assessment.FunctionalTesting} />
                                    <InfoRow label="Accessory Movements" value={assessment.JointPlayMovements} />
                                    <InfoRow label="Clinical Comments" value={assessment.Comments} fullWidth />
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card className="border-none shadow-xl rounded-[2rem] bg-white overflow-hidden">
                                <CardContent className="p-8 pt-10">
                                    <SectionHeader title="Neurological" icon={Stethoscope} bgColor="bg-indigo-50" textColor="text-indigo-600" />
                                    <div className="space-y-5">
                                        <InfoRow label="Neurological Tests" value={assessment.NeurologicalTests} fullWidth />
                                        <InfoRow label="Sensory mapping" value={assessment.Sensation} fullWidth />
                                        <InfoRow label="Deep Tendon Reflexes" value={assessment.Reflexes} fullWidth />
                                        <InfoRow label="Special Clinical Tests" value={assessment.SpecialTests} fullWidth />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-xl rounded-[2rem] bg-white overflow-hidden">
                                <CardContent className="p-8 pt-10 flex flex-col items-center">
                                    <SectionHeader title="Pain Profile" icon={Activity} bgColor="bg-rose-50" textColor="text-rose-600" />
                                    <div className="bg-rose-50/50 rounded-[2rem] p-8 w-full text-center border border-rose-100 shadow-inner mb-6">
                                        <p className="text-[10px] font-black text-rose-500 uppercase mb-2 tracking-[0.2em]">Pain Intensity (VAS)</p>
                                        <p className="text-6xl font-[900] text-rose-600 tracking-tighter">{assessment.PainIntensity_VAS || 0}<span className="text-2xl text-rose-300 font-bold">/10</span></p>
                                    </div>
                                    <div className="w-full space-y-5">
                                        <InfoRow label="24-Hour History" value={assessment.TwentyFourHourHistory} fullWidth />
                                        <InfoRow label="Symptoms Location" value={assessment.SymptomsLocation} fullWidth />
                                        <InfoRow label="History of Pain" value={assessment.PainHistory} fullWidth />
                                        <InfoRow label="Pain Description" value={assessment.PainDescription} fullWidth />
                                        <div className="grid grid-cols-2 gap-4">
                                            <InfoRow label="Aggravating" value={assessment.AggravatingFactors} />
                                            <InfoRow label="Easing" value={assessment.EasingFactors} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Management & Intervention */}
                        <Card className="border-none shadow-2xl bg-slate-900 text-white rounded-[2rem] overflow-hidden">
                            <CardContent className="p-8 sm:p-12">
                                <SectionHeader title="Intervention Strategy" icon={Stethoscope} bgColor="bg-white/10" textColor="text-white" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-6">
                                        <InfoRow label="Clinical Diagnosis" value={assessment.Diagnosis} fullWidth />
                                        <InfoRow label="Management Plan" value={assessment.TreatmentPlan} fullWidth />
                                        <InfoRow label="Patient Education" value={assessment.PatientEducation} fullWidth />
                                        <InfoRow label="Treatment Provided" value={assessment.WhatTreatment} fullWidth />
                                    </div>
                                    <div className="space-y-5 bg-white/5 p-8 rounded-[2rem] border border-white/10 shadow-2xl backdrop-blur-md">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                                            <p className="text-[11px] uppercase tracking-widest font-black text-slate-400">Modalities Prescribed</p>
                                        </div>
                                        <div className="space-y-4">
                                            {[
                                                { l: "Manual Therapy", v: assessment.ManualTherapy },
                                                { l: "Electrotherapy", v: assessment.Electrotherapy },
                                                { l: "Exercises", v: assessment.ExercisePrescription },
                                                { l: "Follow-up", v: assessment.HomeFollowups }
                                            ].map((item, i) => (
                                                <div key={i} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                                                    <span className="text-xs font-bold text-slate-400">{item.l}</span>
                                                    <span className="text-sm font-[800] text-white">{item.v || 'N/A'}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Media Engine */}
                        <Card className="border-none shadow-xl overflow-hidden rounded-[2rem] bg-white">
                            <CardContent className="p-0">
                                <div className="p-8 border-b bg-slate-50/50 flex items-center justify-between">
                                    <SectionHeader title="Media Evidence" icon={Camera} bgColor="bg-indigo-50" textColor="text-indigo-600" />
                                </div>
                                <div className="p-8">
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
                                            return (
                                                <div className="flex flex-col items-center justify-center py-20 text-slate-300 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-100">
                                                    <Camera className="h-12 w-12 mb-4 opacity-20" />
                                                    <p className="text-sm font-black tracking-tight uppercase">No clinical captures available</p>
                                                </div>
                                            );
                                        }

                                        return (
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                                {allMedia.map((url, i) => {
                                                    const directUrl = convertDriveUrl(url);
                                                    const isVideoCode = isVideoUrl(url);
                                                    return (
                                                        <div key={i} className="group relative aspect-square shadow-lg rounded-[1.5rem] overflow-hidden bg-slate-100 hover:shadow-2xl transition-all duration-500">
                                                            {isVideoCode ? (
                                                                <video src={directUrl} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <img src={directUrl} alt="Evidence" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                            )}
                                                            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                                                <Button size="icon" variant="ghost" className="text-white hover:bg-white/20 rounded-full" asChild>
                                                                    <a href={url} target="_blank" rel="noopener noreferrer"><Camera className="h-8 w-8" /></a>
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })()}
                                </div>
                            </CardContent>
                        </Card>

                         {/* Reviews & Summary */}
                         <Card className="border-none shadow-xl rounded-[2rem] bg-white overflow-hidden">
                            <CardContent className="p-8 pt-10">
                                <SectionHeader title="Clinical Progress Review" icon={FileText} bgColor="bg-slate-50" textColor="text-slate-600" />
                                <div className="space-y-8">
                                    <InfoRow label="Comprehensive Patient Summary" value={assessment.PatientSummary} fullWidth />
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100 group hover:border-primary/20 transition-all">
                                            <InfoRow label="Review 1" value={assessment.Review1} />
                                        </div>
                                        <div className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100 group hover:border-primary/20 transition-all">
                                            <InfoRow label="Review 2" value={assessment.Review2} />
                                        </div>
                                        <div className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100 group hover:border-primary/20 transition-all">
                                            <InfoRow label="Review 3" value={assessment.Review3} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                                        <InfoRow label="Submitted / Authenticated By" value={assessment.SubmittedBy} icon={User} />
                                        <InfoRow label="Record Health Index" value="Clinical Standard Verified" icon={HeartPulse} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
