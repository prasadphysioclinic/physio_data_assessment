import { getFromGoogleSheet } from "@/lib/apps-script";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Pencil, User, ClipboardList, Activity, Stethoscope, FileText, Camera } from "lucide-react";
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

    const InfoRow = ({ label, value, fullWidth = false }: { label: string; value: string | number | undefined; fullWidth?: boolean }) => (
        <div className={`space-y-1 ${fullWidth ? 'col-span-full' : ''}`}>
            <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/70">{label}</p>
            <p className="text-sm font-medium leading-relaxed">{value || <span className="text-muted-foreground/30 italic">Not recorded</span>}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 sm:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <Button asChild variant="secondary" size="sm" className="w-fit">
                        <Link href="/">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Dashboard
                        </Link>
                    </Button>
                    <div className="flex gap-2">
                        <DownloadReportButton assessment={assessment} />
                        <Button asChild size="sm" className="bg-primary hover:bg-primary/90 shadow-lg">
                            <Link href={`/assessment/${assessmentIndex}/edit`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit Record
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Hero Patient Section */}
                <Card className="overflow-hidden border-none shadow-xl bg-white">
                    <div className="h-2 bg-gradient-to-r from-primary via-blue-500 to-indigo-600" />
                    <CardContent className="p-6 sm:p-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-5">
                                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                    <User className="h-8 w-8" />
                                </div>
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{assessment.PatientName}</h1>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1 font-medium">
                                        <span className="flex items-center"><Activity className="h-3.5 w-3.5 mr-1.5" /> Age: {assessment.Age}</span>
                                        <span className="flex items-center"><ClipboardList className="h-3.5 w-3.5 mr-1.5" /> ID: #{assessmentIndex + 1}</span>
                                        <span className="flex items-center text-primary font-bold">● {assessment.ImprovingStaticWorse}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 min-w-[200px]">
                                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Last Updated</p>
                                <p className="text-sm font-bold text-slate-700">{assessment.Timestamp ? formatDateTime(assessment.Timestamp) : formatDate(assessment.Date)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Demographics and History */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="border-none shadow-lg">
                            <CardHeader className="pb-3 flex flex-row items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-50 text-blue-600"><User className="h-4 w-4" /></div>
                                <CardTitle className="text-lg">Demographics</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-4">
                                <InfoRow label="Gender" value={assessment.Sex} />
                                <InfoRow label="Occupation" value={assessment.Occupation} />
                                <InfoRow label="Phone" value={assessment.PhoneNumber} />
                                <InfoRow label="Height/Weight" value={`${assessment.Height || '-'} / ${assessment.Weight || '-'}`} />
                                <InfoRow label="BP" value={assessment.BloodPressure} />
                                <InfoRow label="Diabetic" value={assessment.DiabeticMellitus} />
                                <InfoRow label="Diet" value={assessment.DietHabit} fullWidth />
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg">
                            <CardHeader className="pb-3 flex flex-row items-center gap-3">
                                <div className="p-2 rounded-lg bg-orange-50 text-orange-600"><ClipboardList className="h-4 w-4" /></div>
                                <CardTitle className="text-lg">Clinical History</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <InfoRow label="Chief Complaint" value={assessment.ChiefComplaint} fullWidth />
                                <InfoRow label="Present History" value={assessment.PresentHistory} fullWidth />
                                <InfoRow label="Past History" value={assessment.PastHistory} fullWidth />
                                <InfoRow label="Imaging Results" value={assessment.DiagnosticImaging} fullWidth />
                                <div className="pt-2 border-t border-slate-50">
                                    <InfoRow label="Red Flags" value={assessment.RedFlags} fullWidth />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Middle Column: Physical Examination */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="border-none shadow-lg col-span-full">
                                <CardHeader className="pb-3 flex flex-row items-center gap-3">
                                    <div className="p-2 rounded-lg bg-green-50 text-green-600"><Activity className="h-4 w-4" /></div>
                                    <CardTitle className="text-lg">Physical Examination</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="md:col-span-1 space-y-4">
                                        <InfoRow label="Active ROM" value={assessment.ActiveROM} />
                                        <InfoRow label="Passive ROM" value={assessment.PassiveROM} />
                                        <InfoRow label="Muscle Power" value={assessment.MusclePower} />
                                    </div>
                                    <div className="md:col-span-1 space-y-4">
                                        <InfoRow label="Observation" value={assessment.Observation} />
                                        <InfoRow label="Palpation" value={assessment.Palpation} />
                                        <InfoRow label="Gait" value={assessment.Gait} />
                                    </div>
                                    <div className="md:col-span-1 space-y-4">
                                        <InfoRow label="End Feel" value={assessment.EndFeel} />
                                        <InfoRow label="Capsular Pattern" value={assessment.CapsularPattern} />
                                        <InfoRow label="Isometric Resistance" value={assessment.ResistedIsometrics} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-lg">
                                <CardHeader className="pb-3 flex flex-row items-center gap-3">
                                    <div className="p-2 rounded-lg bg-purple-50 text-purple-600"><Stethoscope className="h-4 w-4" /></div>
                                    <CardTitle className="text-lg">Neurological & Special</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <InfoRow label="Neurological Tests" value={assessment.NeurologicalTests} fullWidth />
                                    <InfoRow label="Sensation" value={assessment.Sensation} fullWidth />
                                    <InfoRow label="Reflexes" value={assessment.Reflexes} fullWidth />
                                    <InfoRow label="Special Tests" value={assessment.SpecialTests} fullWidth />
                                    <InfoRow label="Joint Play" value={assessment.JointPlayMovements} fullWidth />
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-lg">
                                <CardHeader className="pb-3 flex flex-row items-center gap-3">
                                    <div className="p-2 rounded-lg bg-red-50 text-red-600"><Activity className="h-4 w-4" /></div>
                                    <CardTitle className="text-lg">Pain Assessment</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 text-center">
                                    <div className="bg-red-50 rounded-2xl p-4 inline-block mx-auto mb-2">
                                        <p className="text-xs font-black text-red-600 uppercase mb-1">Intensity (VAS)</p>
                                        <p className="text-4xl font-black text-red-700">{assessment.PainIntensity_VAS || 0}<span className="text-lg text-red-400">/10</span></p>
                                    </div>
                                    <div className="text-left space-y-3 pt-2">
                                        <InfoRow label="Symptoms Location" value={assessment.SymptomsLocation} fullWidth />
                                        <InfoRow label="Aggravating Factors" value={assessment.AggravatingFactors} fullWidth />
                                        <InfoRow label="Easing Factors" value={assessment.EasingFactors} fullWidth />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Analysis & Treatment */}
                        <Card className="border-none shadow-lg bg-slate-900 text-white">
                            <CardHeader className="pb-3 flex flex-row items-center gap-3">
                                <div className="p-2 rounded-lg bg-white/10 text-white"><FileText className="h-4 w-4" /></div>
                                <CardTitle className="text-lg">Plan of Care</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <InfoRow label="Diagnosis" value={assessment.Diagnosis} fullWidth />
                                    <InfoRow label="Treatment Plan" value={assessment.TreatmentPlan} fullWidth />
                                </div>
                                <div className="space-y-4 bg-white/5 p-4 rounded-xl">
                                    <p className="text-[10px] uppercase tracking-widest font-black text-slate-500">Modalities used</p>
                                    <div className="space-y-2">
                                        <div className="flex justify-between border-b border-white/10 pb-2">
                                            <span className="text-xs opacity-60">Manual Therapy</span>
                                            <span className="text-xs font-bold">{assessment.ManualTherapy || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-white/10 pb-2">
                                            <span className="text-xs opacity-60">Electrotherapy</span>
                                            <span className="text-xs font-bold">{assessment.Electrotherapy || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-xs opacity-60">Exercise</span>
                                            <span className="text-xs font-bold">{assessment.ExercisePrescription || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Media Engine (Embedded directly for seamless UX) */}
                        <Card className="border-none shadow-lg overflow-hidden">
                            <CardHeader className="pb-3 border-b bg-slate-50/50 flex flex-row items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600"><Camera className="h-4 w-4" /></div>
                                    <CardTitle className="text-lg">Clinical Media</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                {(() => {
                                    const allMedia: string[] = [];
                                    const seenUrls = new Set<string>();
                                    const urlRegex = /(https?:\/\/[^\s]+|drive\.google\.com[^\s]+)/gi;
                                    
                                    Object.entries(assessment).forEach(([key, value]) => {
                                        if (!value) return;
                                        const valStr = String(value).trim();
                                        const lowerKey = key.toLowerCase().replace(/[\s_-]/g, '');
                                        const systemBlacklist = ['patientname', 'date', 'timestamp', 'age', 'sex', 'occupation', 'phonenumber', 'action', 'rowindex', 'submittedby'];
                                        if (systemBlacklist.includes(lowerKey)) return;
                                        
                                        const matches = valStr.match(urlRegex);
                                        if (matches) {
                                            matches.forEach(m => {
                                                if (!seenUrls.has(m)) {
                                                    allMedia.push(m);
                                                    seenUrls.add(m);
                                                }
                                            });
                                        } else if (valStr.length >= 25 && valStr.length <= 50 && !valStr.includes(' ') && !valStr.includes('/') && !valStr.includes(':')) {
                                           if (!seenUrls.has(valStr)) {
                                               allMedia.push(valStr);
                                               seenUrls.add(valStr);
                                           }
                                        }
                                    });

                                    if (allMedia.length === 0) {
                                        return (
                                            <div className="flex flex-col items-center justify-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                                <Camera className="h-10 w-10 mb-3 opacity-20" />
                                                <p className="text-sm font-medium">No imaging evidence attached to this record</p>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                            {allMedia.map((url, i) => {
                                                const directUrl = convertDriveUrl(url);
                                                const isVideoCode = isVideoUrl(url);
                                                return (
                                                    <div key={i} className="group relative">
                                                        <div className="aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                                                            {isVideoCode ? (
                                                                <video src={directUrl} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <img src={directUrl} alt="Clinical evidence" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                                            )}
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                                <Button size="icon" variant="ghost" className="text-white hover:bg-white/20" asChild>
                                                                    <a href={url} target="_blank" rel="noopener noreferrer">
                                                                        <Camera className="h-5 w-5" />
                                                                    </a>
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })()}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
