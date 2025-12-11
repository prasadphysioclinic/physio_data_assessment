import { getFromGoogleSheet } from "@/lib/apps-script";
import { EditAssessmentForm } from "@/components/edit-assessment-form";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditAssessmentPage(props: PageProps) {
    const params = await props.params;
    const assessments = await getFromGoogleSheet();
    const assessmentIndex = parseInt(params.id);

    if (isNaN(assessmentIndex) || assessmentIndex < 0 || assessmentIndex >= assessments.length) {
        notFound();
    }

    const assessment = assessments[assessmentIndex];

    return <EditAssessmentForm assessment={assessment} assessmentIndex={assessmentIndex} />;
}
