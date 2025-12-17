import { AssessmentForm } from "@/components/assessment-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NewAssessmentPage() {
    return (
        <div className="max-w-5xl mx-auto">
            {/* Header with Back Button */}
            <div className="mb-8">
                <Link href="/">
                    <Button variant="ghost" className="mb-4 gap-2 hover:bg-primary/10">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Button>
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            New Assessment
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Fill out the form below to create a new patient assessment.
                        </p>
                    </div>
                    <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-lg">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Auto-saves to Google Sheets
                    </div>
                </div>
            </div>

            {/* Form */}
            <AssessmentForm />
        </div>
    );
}
