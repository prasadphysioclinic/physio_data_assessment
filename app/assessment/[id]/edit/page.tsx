import { getFromGoogleSheet } from "@/lib/apps-script";
import { EditAssessmentForm } from "@/components/edit-assessment-form";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditAssessmentPage(props: PageProps) {
    const params = await props.params;
    let assessments = [];
    
    try {
        const data = await getFromGoogleSheet();
        // Sanity filter: remove corrupted rows
        assessments = Array.isArray(data)
            ? data.filter((a: any) => a && typeof a === 'object' && !Array.isArray(a) && a.PatientName)
            : [];
    } catch (error) {
        console.error("Failed to fetch assessment for editing:", error);
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6 bg-muted/20 rounded-xl border-2 border-dashed">
                <h2 className="text-xl font-bold text-destructive mb-2">Connection Error</h2>
                <p className="text-muted-foreground mb-6">Could not retrieve data from Google Sheets.</p>
                <Link href="/" className="text-primary hover:underline font-medium">Return to Dashboard</Link>
            </div>
        );
    }

    const assessmentIndex = Number(params.id);

    if (isNaN(assessmentIndex) || assessmentIndex < 0 || assessmentIndex >= assessments.length) {
        notFound();
    }

    const assessment = assessments[assessmentIndex];

    return <EditAssessmentForm assessment={assessment} assessmentIndex={assessmentIndex} />;
}
