import { getFromGoogleSheet } from "@/lib/apps-script";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { notFound } from "next/navigation";
import { formatDate, formatDateTime } from "@/lib/format-date";

export const dynamic = 'force-dynamic';
export const revalidate = 0; // Always fetch fresh data from Google Sheets

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function AssessmentDetailPage(props: PageProps) {
    const params = await props.params;
    const assessments = await getFromGoogleSheet();
    const assessmentIndex = parseInt(params.id);

    if (isNaN(assessmentIndex) || assessmentIndex < 0 || assessmentIndex >= assessments.length) {
        notFound();
    }

    const assessment = assessments[assessmentIndex];

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
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Assessment Details</h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                    Patient: {assessment.PatientName} | Date: {formatDate(assessment.Date)}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Patient Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Patient Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Name</p>
                            <p className="text-base">{assessment.PatientName || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Age</p>
                            <p className="text-base">{assessment.Age || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Occupation</p>
                            <p className="text-base">{assessment.Occupation || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Date</p>
                            <p className="text-base">{formatDate(assessment.Date)}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* History */}
                <Card>
                    <CardHeader>
                        <CardTitle>History</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Mechanism of Injury</p>
                            <p className="text-base">{assessment.MechanismOfInjury || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Aggravating/Easing Factors</p>
                            <p className="text-base">{assessment.AggravatingEasingFactors || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">24-Hour History</p>
                            <p className="text-base">{assessment.TwentyFourHourHistory || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Status</p>
                            <p className="text-base">{assessment.ImprovingStaticWorse || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Injury Type</p>
                            <p className="text-base">{assessment.NewOrOldInjury || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Past History</p>
                            <p className="text-base">{assessment.PastHistory || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Diagnostic Imaging</p>
                            <p className="text-base">{assessment.DiagnosticImaging || 'N/A'}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Pain & Symptoms */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pain & Symptoms</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Pain Location</p>
                            <p className="text-base">{assessment.PainLocation || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Pain Intensity (VAS 0-10)</p>
                            <p className="text-base font-semibold text-lg">{assessment.PainIntensity_VAS || '0'}/10</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Pain Pattern</p>
                            <p className="text-base">{assessment.PainPattern || 'N/A'}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Observation */}
                <Card>
                    <CardHeader>
                        <CardTitle>Observation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Posture</p>
                            <p className="text-base">{assessment.ObservationPosture || 'N/A'}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Active Movements */}
                <Card>
                    <CardHeader>
                        <CardTitle>Active Movements</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Left Flexion</p>
                                <p className="text-base">{assessment.Active_L_Flex || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Right Flexion</p>
                                <p className="text-base">{assessment.Active_R_Flex || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Left Extension</p>
                                <p className="text-base">{assessment.Active_L_Ext || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Right Extension</p>
                                <p className="text-base">{assessment.Active_R_Ext || 'N/A'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Passive Movements */}
                <Card>
                    <CardHeader>
                        <CardTitle>Passive Movements</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Left Flexion</p>
                                <p className="text-base">{assessment.Passive_L_Flex || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Right Flexion</p>
                                <p className="text-base">{assessment.Passive_R_Flex || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Left Extension</p>
                                <p className="text-base">{assessment.Passive_L_Ext || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Right Extension</p>
                                <p className="text-base">{assessment.Passive_R_Ext || 'N/A'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Examination Findings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Examination Findings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">End Feel</p>
                            <p className="text-base">{assessment.EndFeel || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Capsular Pattern</p>
                            <p className="text-base">{assessment.CapsularPattern || 'N/A'}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Tests */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tests</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Resisted Isometrics</p>
                            <p className="text-base">{assessment.ResistedIsometrics || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Functional Testing</p>
                            <p className="text-base">{assessment.FunctionalTesting || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Sensory Scan</p>
                            <p className="text-base">{assessment.SensoryScan || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Reflexes</p>
                            <p className="text-base">{assessment.Reflexes || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Neurological Special Tests</p>
                            <p className="text-base">{assessment.NeuroSpecialTests || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Special Tests</p>
                            <p className="text-base">{assessment.SpecialTests || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Joint Play Movements</p>
                            <p className="text-base">{assessment.JointPlayMovements || 'N/A'}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Palpation */}
                <Card>
                    <CardHeader>
                        <CardTitle>Palpation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Tenderness</p>
                            <p className="text-base">{assessment.Palpation_Tenderness || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Effusion</p>
                            <p className="text-base">{assessment.Palpation_Effusion || 'N/A'}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Media Attachments */}
                {(assessment.Media1 || assessment.Media2 || assessment.Media3 || assessment.Media4) && (
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Media Attachments</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[assessment.Media1, assessment.Media2, assessment.Media3, assessment.Media4].map((url, index) => {
                                    if (!url) return null;

                                    // Check if it's likely a video (Apps Script will tag it or we can check extension in URL)
                                    // For now, we'll try to infer or just provide a link if unsure.
                                    // Drive URLs for videos often contain 'video' in the name or we can check the file name if we stored it.
                                    const isVideo = url.toLowerCase().includes('mp4') || url.toLowerCase().includes('mov') || url.toLowerCase().includes('video');

                                    return (
                                        <div key={index} className="space-y-2">
                                            <div className="rounded-lg overflow-hidden border bg-muted aspect-video flex items-center justify-center">
                                                {isVideo ? (
                                                    <video
                                                        src={url}
                                                        controls
                                                        className="w-full h-full object-contain"
                                                    />
                                                ) : (
                                                    <img
                                                        src={url}
                                                        alt={`Attachment ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            // Fallback for Drive URLs that might need a different view
                                                            (e.target as HTMLImageElement).src = '/file-placeholder.png';
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            <Button variant="outline" size="sm" className="w-full text-[10px]" asChild>
                                                <a href={url} target="_blank" rel="noopener noreferrer">
                                                    Open Original
                                                </a>
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Additional Information */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Additional Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Comments</p>
                            <p className="text-base">{assessment.Comments || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Submitted By</p>
                            <p className="text-base">{assessment.SubmittedBy || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Timestamp</p>
                            <p className="text-base">{formatDateTime(assessment.Timestamp)}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
