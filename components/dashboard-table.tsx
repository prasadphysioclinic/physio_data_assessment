"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, RefreshCw, Eye, Pencil, Trash2, LayoutDashboard, PlusCircle, FileText, CheckCircle2, AlertCircle, Save } from "lucide-react";
import { formatDateShort } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

interface Assessment {
    id: number | string;
    Date: string;
    Timestamp?: string;
    PatientName: string;
    Age: string;
    Occupation: string;
    Diagnosis?: string;
    ChiefComplaint?: string;
    PastHistory?: string;
    PainIntensity_VAS?: string | number;
    DailyNote?: string;
    PhoneNumber?: string;
    Sex?: string;
    [key: string]: any;
}

interface DashboardTableProps {
    assessments: Assessment[];
}

/**
 * Interactive Daily Note Component
 * Provides a high-premium side-panel for instant read/write operations
 */
function DailyNoteCell({ assessment, onUpdate }: { assessment: Assessment, onUpdate: () => void }) {
    const [note, setNote] = useState(assessment.DailyNote || "");
    const [isSaving, setIsSaving] = useState(false);
    const [open, setOpen] = useState(false);

    const handleSave = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsSaving(true);
        try {
            const response = await fetch(`/api/assessments/${assessment.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dailyNote: note }),
            });

            if (response.ok) {
                setOpen(false);
                onUpdate();
            }
        } catch (error) {
            console.error("Failed to save note:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild onClick={(e) => e.stopPropagation()}>
                <button className="group flex items-center gap-2 hover:bg-slate-50 p-1.5 rounded-lg transition-all border border-transparent hover:border-slate-200 w-full text-left">
                    <div className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                        note ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-400"
                    )}>
                        <FileText className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-[9px] font-black uppercase tracking-tighter text-slate-400 group-hover:text-primary transition-colors">Daily Note</span>
                        <span className="text-[10px] text-slate-600 truncate font-medium italic">
                            {note || "Add note..."}
                        </span>
                    </div>
                </button>
            </SheetTrigger>
            <SheetContent 
                side="right" 
                className="w-full sm:max-w-md border-l border-slate-200 shadow-2xl flex flex-col p-0 gap-0"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <SheetHeader>
                        <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-[10px] font-bold border-primary/20 bg-primary/5 text-primary">SESSION RECORD</Badge>
                        </div>
                        <SheetTitle className="text-xl font-black text-slate-900 tracking-tight">Clinical Daily Note</SheetTitle>
                        <SheetDescription className="text-xs text-slate-500 font-medium">
                            Patient: <span className="font-bold text-slate-700">{assessment.PatientName}</span> • {formatDateShort(assessment.Date)}
                        </SheetDescription>
                    </SheetHeader>
                </div>

                <div className="flex-1 p-6 space-y-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-black tracking-widest text-slate-400">Continuous Progress Observation</Label>
                        <Textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Type progress note, treatment adjustments, or clinical observations here..."
                            className="min-h-[300px] resize-none border-slate-200 focus-visible:ring-primary/20 rounded-xl bg-slate-50 text-sm font-medium leading-relaxed"
                        />
                    </div>
                    
                    <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex gap-3">
                        <AlertCircle className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-blue-700 leading-tight">
                            Daily notes are synchronized in real-time. Changes here will be reflected in the cloud record and PDF reports immediately.
                        </p>
                    </div>
                </div>

                <div className="p-6 bg-white border-t border-slate-100">
                    <Button 
                        onClick={handleSave} 
                        className="w-full h-12 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/10 transition-all active:scale-[0.98]"
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="mr-2 h-4 w-4" />
                        )}
                        {isSaving ? "Syncing Record..." : "Confirm & Save Entry"}
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}

export function DashboardTable({ assessments }: DashboardTableProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Create a mapping for patient slugs
    const getSlug = (name: string) => (name || '').trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.refresh();
        setTimeout(() => setIsRefreshing(false), 800);
    };

    const sortedAssessments = [...assessments].sort((a, b) => {
        const dateA = a.Date ? new Date(a.Date).getTime() : 0;
        const dateB = b.Date ? new Date(b.Date).getTime() : 0;
        return (dateB || 0) - (dateA || 0);
    });

    const filteredAssessments = sortedAssessments.filter((assessment) => {
        const query = searchQuery.toLowerCase();
        return (
            (assessment.PatientName && String(assessment.PatientName).toLowerCase().includes(query)) ||
            (assessment.Diagnosis && String(assessment.Diagnosis).toLowerCase().includes(query)) ||
            (assessment.ChiefComplaint && String(assessment.ChiefComplaint).toLowerCase().includes(query)) ||
            (assessment.Date && String(assessment.Date).toLowerCase().includes(query)) ||
            (assessment.PhoneNumber && String(assessment.PhoneNumber).toLowerCase().includes(query))
        );
    });

    // Button and Row performance optimization: instant feedback
    const btnClass = "transition-none active:scale-[0.98]";
    const rowClass = "group hover:bg-slate-50 transition-colors cursor-pointer active:bg-slate-100";

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="relative flex-1 w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search patient name, diagnosis..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-10 rounded-xl"
                    />
                </div>
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="h-10 px-4 rounded-xl border-slate-200 font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm active:scale-95 ml-auto"
                >
                    <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
                    {isRefreshing ? 'Syncing...' : 'Refresh'}
                </Button>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <Table className="table-fixed w-[1200px]">
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="w-[110px] px-3 font-black text-[11px] uppercase tracking-widest text-slate-800">Date</TableHead>
                                <TableHead className="w-[240px] px-3 font-black text-[11px] uppercase tracking-widest text-slate-800">Patient Details</TableHead>
                                <TableHead className="w-[140px] px-3 text-center font-black text-[11px] uppercase tracking-widest text-slate-800">Occupation</TableHead>
                                <TableHead className="w-[140px] px-3 text-center font-black text-[11px] uppercase tracking-widest text-slate-800">Contact</TableHead>
                                <TableHead className="w-[250px] px-3 font-black text-[11px] uppercase tracking-widest text-slate-800">Clinical Diagnosis</TableHead>
                                <TableHead className="w-[200px] px-3 font-black text-[11px] uppercase tracking-widest text-slate-800">Review Note</TableHead>
                                <TableHead className="text-right w-[140px] px-3 pr-8 font-black text-[11px] uppercase tracking-widest text-slate-800">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAssessments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground italic">
                                        {searchQuery ? "No results found." : "No assessments recorded yet."}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredAssessments.map((assessment) => {
                                    const targetId = assessment.id;

                                    return (
                                        <TableRow 
                                            key={`${targetId}-${assessment.Date}`} 
                                            className={rowClass}
                                            onClick={() => router.push(`/assessment/${targetId}`)}
                                        >
                                            <TableCell className="px-3 py-3 w-[110px]">
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-[11px] font-bold whitespace-nowrap text-slate-700">{formatDateShort(assessment.Date)}</span>
                                                    <span className="text-[9px] text-muted-foreground font-mono">{assessment.Timestamp?.split(', ')[1]}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-3 py-3 w-[240px]">
                                                <div className="w-full flex flex-col gap-0.5 min-w-0">
                                                    <div className="w-full truncate">
                                                        <span className="text-[12px] font-black leading-tight uppercase tracking-tight text-slate-900">
                                                            {assessment.PatientName || 'Unknown'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-x-2 text-[10px] text-muted-foreground">
                                                        <span className="bg-slate-100 px-1 rounded font-mono shrink-0">{assessment.Age ? `${assessment.Age}y` : 'Age?'}</span>
                                                        <span className="shrink-0">{assessment.Sex || '-'}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-3 py-3 text-center w-[140px]">
                                                <span className="text-[11px] font-bold capitalize text-slate-600 truncate block">
                                                    {assessment.Occupation || '-'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-3 py-3 text-center w-[140px]">
                                                <span className="text-[11px] text-primary font-black truncate block">
                                                    {assessment.PhoneNumber || '-'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-3 py-3 w-[250px]">
                                                <span className="text-[11px] font-bold text-slate-700 truncate block">
                                                    {assessment.Diagnosis || assessment['Problem List'] || '-'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-3 py-3 w-[200px]">
                                                <DailyNoteCell assessment={assessment} onUpdate={handleRefresh} />
                                            </TableCell>
                                            <TableCell className="text-right px-3 pr-8 w-[140px]">
                                                <div className="flex flex-row justify-end gap-2 h-full items-center" onClick={(e) => e.stopPropagation()}>
                                                    <Button variant="outline" size="sm" asChild className={`h-8 rounded-lg text-[10px] font-black px-3 ${btnClass} border-slate-200 active:scale-95 transition-all`}>
                                                        <Link href={`/assessment/${targetId}`} prefetch={true}>VIEW</Link>
                                                    </Button>
                                                    <Button variant="secondary" size="sm" asChild className={`h-8 rounded-lg text-[10px] font-black px-3 ${btnClass} bg-slate-100 active:scale-95 transition-all`}>
                                                        <Link href={`/assessment/${targetId}/edit`} prefetch={true}>EDIT</Link>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <p className="text-[10px] text-muted-foreground text-center italic">
                💡 Clinical Diagnosis and Daily Notes are instantly editable for rapid workflow.
            </p>
        </div>
    );
}

