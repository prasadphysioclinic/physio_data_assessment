import { Button } from "@/components/ui/button";
import { getFromGoogleSheet } from "@/lib/apps-script";
import Link from "next/link";
import { PlusCircle, RefreshCw } from "lucide-react";
import { DashboardTable } from "@/components/dashboard-table";

export const dynamic = 'force-dynamic';
export const revalidate = 0; // Always fetch fresh data

export default async function Home() {
  let assessments = [];
  try {
    assessments = await getFromGoogleSheet();
  } catch (error) {
    console.error("Failed to fetch assessments:", error);
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Patient Assessments</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Showing {assessments.length} assessment{assessments.length !== 1 ? 's' : ''} • Data synced with Google Sheets
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <form>
            <Button type="submit" variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </form>
          <Button asChild size="sm" className="flex-1 sm:flex-none">
            <Link href="/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              <span className="hidden xs:inline">New Assessment</span>
              <span className="xs:hidden">New</span>
            </Link>
          </Button>
        </div>
      </div>

      <DashboardTable assessments={assessments} />
    </div>
  );
}
