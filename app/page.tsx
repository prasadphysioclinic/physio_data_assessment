"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle, RefreshCw, CheckCircle, X } from "lucide-react";
import { DashboardTable } from "@/components/dashboard-table";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

// Component that uses useSearchParams
function SuccessToast() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const success = searchParams.get('success');
    if (success) {
      setSuccessMessage(success);
      router.replace('/', { scroll: false });
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  }, [searchParams, router]);

  if (!successMessage) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
      <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg px-4 py-3 shadow-lg flex items-center gap-3">
        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
        <span className="text-green-800 dark:text-green-200 font-medium">{successMessage}</span>
        <button
          onClick={() => setSuccessMessage(null)}
          className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssessments();
  }, []);

  async function fetchAssessments() {
    setLoading(true);
    try {
      const response = await fetch('/api/assessments');
      const data = await response.json();
      setAssessments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch assessments:", error);
      setAssessments([]);
    } finally {
      setLoading(false);
    }
  }

  function handleRefresh() {
    fetchAssessments();
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Success Toast - wrapped in Suspense */}
      <Suspense fallback={null}>
        <SuccessToast />
      </Suspense>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Patient Assessments
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                Loading assessments...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                {assessments.length} assessment{assessments.length !== 1 ? 's' : ''} • Synced with Google Sheets
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
          <Button asChild size="sm" className="flex-1 sm:flex-none">
            <Link href="/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              <span className="hidden xs:inline">New Assessment</span>
              <span className="xs:hidden">New</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-card border rounded-lg p-4">
          <p className="text-xs text-muted-foreground">Total Patients</p>
          <p className="text-2xl font-bold">{loading ? '-' : assessments.length}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <p className="text-xs text-muted-foreground">Today</p>
          <p className="text-2xl font-bold">
            {loading ? '-' : assessments.filter((a: any) => {
              const today = new Date().toISOString().split('T')[0];
              return a.Date?.includes(today);
            }).length}
          </p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <p className="text-xs text-muted-foreground">This Week</p>
          <p className="text-2xl font-bold">
            {loading ? '-' : assessments.filter((a: any) => {
              const now = new Date();
              const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
              const assessmentDate = new Date(a.Date);
              return assessmentDate >= weekAgo;
            }).length}
          </p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <p className="text-xs text-muted-foreground">Avg. Pain Score</p>
          <p className="text-2xl font-bold">
            {loading ? '-' : assessments.length > 0
              ? (assessments.reduce((sum: number, a: any) => sum + (parseInt(a.PainIntensity_VAS) || 0), 0) / assessments.length).toFixed(1)
              : '0'}
          </p>
        </div>
      </div>

      {/* Table */}
      <DashboardTable assessments={assessments} loading={loading} />
    </div>
  );
}
