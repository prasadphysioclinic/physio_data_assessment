"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { FileText, RefreshCw, Save, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDateShort } from "@/lib/format-date";
import { useRouter } from "next/navigation";

interface Assessment {
    id: number | string;
    Date: string;
    PatientName: string;
    DailyNote?: string;
    [key: string]: any;
}

interface DailyNoteSheetProps {
    assessment: Assessment;
    onUpdate?: () => void;
    children?: React.ReactNode;
}

export function DailyNoteSheet({ assessment, onUpdate, children }: DailyNoteSheetProps) {
    const [note, setNote] = useState(assessment.DailyNote || "");
    const [isSaving, setIsSaving] = useState(false);
    const [open, setOpen] = useState(false);
    const router = useRouter();

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
                if (onUpdate) {
                    onUpdate();
                } else {
                    router.refresh();
                }
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
                {children || (
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
                )}
            </SheetTrigger>
            <SheetContent 
                side="right" 
                className="w-full sm:max-w-md border-l border-slate-200 shadow-2xl flex flex-col p-0 gap-0 bg-white opacity-100"
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
