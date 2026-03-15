import { getFromGoogleSheet } from "@/lib/apps-script";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, User, Calendar, ClipboardList } from "lucide-react";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/format-date";
import { groupByPatient, extractPainHistory } from "@/lib/utils-data";
import { PainProgressChart } from "@/components/pain-progress-chart";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function PatientProfilePage(props: PageProps) {
    const params = await props.params;
    let assessments = [];
    
    try {
        const data = await getFromGoogleSheet();
        assessments = Array.isArray(data)
            ? data.filter((a: any) => a && typeof a === 'object' && !Array.isArray(a) && a.PatientName)
            : [];
    } catch (error) {
        console.error("Failed to fetch data for patient profile:", error);
        return <div className="p-8 text-center">Error loading data.</div>;
    }

    const profiles = groupByPatient(assessments);
    const profile = profiles.find(p => p.slug === params.slug);

    if (!profile) {
        notFound();
    }

    const patientAssessments = profile.assessmentIndices.map(i => ({
        ...assessments[i],
        originalIndex: i
    })).sort((a, b) => (b.Date || '').localeCompare(a.Date || ''));

    const painHistory = extractPainHistory(assessments, profile.assessmentIndices);

    return (
        <div className="space-y-6">
            <Button asChild variant="ghost" size="sm">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Link>
            </Button>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Left: Patient Info & Graph */}
                <div className="flex-1 space-y-6">
                    <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                            <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/20">
                                <User className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">{profile.name}</h1>
                                <p className="text-muted-foreground">Patient Profile • {profile.totalVisits} Visit{profile.totalVisits !== 1 ? 's' : ''}</p>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider font-mono">First Visit</p>
                                    <p className="text-sm font-semibold truncate">{profile.firstVisitDate ? formatDate(profile.firstVisitDate) : 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider font-mono">Last Visit</p>
                                    <p className="text-sm font-semibold truncate">{profile.lastVisitDate ? formatDate(profile.lastVisitDate) : 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider font-mono">Total Visits</p>
                                    <p className="text-sm font-semibold">{profile.totalVisits}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider font-mono">Latest Pain (VAS)</p>
                                    <p className="text-sm font-semibold">{profile.latestPainScore !== null ? `${profile.latestPainScore}/10` : 'N/A'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <PainProgressChart data={painHistory} patientName={profile.name} />
                </div>

                {/* Right: Visit History List */}
                <div className="md:w-[400px] space-y-4">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <ClipboardList className="h-5 w-5 text-primary" />
                        Visit History
                    </h2>
                    <div className="space-y-3">
                        {patientAssessments.map((a, idx) => (
                            <Link key={idx} href={`/assessment/${a.originalIndex}`}>
                                <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-muted flex flex-col items-center justify-center text-[10px] font-bold group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                <Calendar className="h-4 w-4 mb-0.5" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm">{a.Date ? formatDate(a.Date) : 'Unknown Date'}</p>
                                                <p className="text-xs text-muted-foreground">Pain: {a.PainIntensity_VAS}/10 • {a.SubmittedBy || 'System'}</p>
                                            </div>
                                        </div>
                                        <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                            →
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
