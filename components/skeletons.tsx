import { Loader2 } from "lucide-react";

export function SkeletonPulse() {
    return <div className="animate-pulse bg-slate-200 rounded-md" />;
}

export function HighSpeedLoader() {
    return (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <p className="text-sm font-bold text-slate-500 animate-pulse tracking-tight uppercase">Synchronizing Clinic Data...</p>
        </div>
    );
}

export function DashboardSkeleton() {
    return (
        <div className="space-y-4 p-4 animate-pulse">
            <div className="h-10 w-full max-w-sm bg-slate-100 rounded-xl" />
            <div className="border rounded-xl border-slate-100 overflow-hidden">
                <div className="h-12 bg-slate-50 border-b border-slate-100" />
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 border-b border-slate-50 last:border-0" />
                ))}
            </div>
        </div>
    );
}
