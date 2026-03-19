"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Search, UserCircle, ExternalLink, Calendar } from "lucide-react";
import { formatDateShort } from "@/lib/format-date";

interface Assessment {
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
    [key: string]: any;
}

interface DashboardTableProps {
    assessments: Assessment[];
}

export function DashboardTable({ assessments }: DashboardTableProps) {
    const [searchQuery, setSearchQuery] = useState("");

    // Create a mapping for patient slugs
    const getSlug = (name: string) => (name || '').trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    // Button and Row performance optimization: instant feedback
    const btnClass = "transition-none active:scale-[0.98]";
    const rowClass = "group hover:bg-slate-50 transition-none cursor-default";

    // Sort assessments by Date descending (latest first)
    const sortedAssessments = [...assessments].sort((a, b) => {
        const dateA = a.Date ? new Date(a.Date).getTime() : 0;
        const dateB = b.Date ? new Date(b.Date).getTime() : 0;
        return (dateB || 0) - (dateA || 0);
    });

    // Filter assessments based on search query
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

    const getPainBadge = (vas: any) => {
        const score = parseInt(vas);
        if (isNaN(score)) return null;
        if (score <= 3) return <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">VAS {score}</Badge>;
        if (score <= 6) return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200">VAS {score}</Badge>;
        return <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">VAS {score}</Badge>;
    };

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
                {searchQuery && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSearchQuery("")}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        Clear Search
                    </Button>
                )}
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <Table className="table-fixed w-[1200px]">
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="w-[110px] px-3 font-black text-[11px] uppercase tracking-widest text-slate-800">Date</TableHead>
                                <TableHead className="w-[210px] px-3 font-black text-[11px] uppercase tracking-widest text-slate-800">Patient Details</TableHead>
                                <TableHead className="w-[140px] px-3 text-center font-black text-[11px] uppercase tracking-widest text-slate-800">Occupation</TableHead>
                                <TableHead className="w-[140px] px-3 text-center font-black text-[11px] uppercase tracking-widest text-slate-800">Contact</TableHead>
                                <TableHead className="w-[100px] px-3 text-center font-black text-[11px] uppercase tracking-widest text-slate-800">Status</TableHead>
                                <TableHead className="w-[180px] px-3 font-black text-[11px] uppercase tracking-widest text-slate-800">Diagnosis</TableHead>
                                <TableHead className="w-[180px] px-3 font-black text-[11px] uppercase tracking-widest text-slate-800">Daily Note</TableHead>
                                <TableHead className="text-right w-[140px] px-3 pr-8 font-black text-[11px] uppercase tracking-widest text-slate-800">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAssessments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-32 text-center text-muted-foreground italic">
                                        {searchQuery ? "No results found." : "No assessments recorded yet."}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredAssessments.map((assessment) => {
                                    const targetId = assessment.id;
                                    const slug = getSlug(assessment.PatientName);

                                    return (
                                        <TableRow key={`${targetId}-${assessment.Date}`} className={rowClass}>
                                            <TableCell className="px-3 py-3 w-[110px] overflow-hidden">
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-[11px] font-bold whitespace-nowrap text-slate-700">{formatDateShort(assessment.Date)}</span>
                                                    <span className="text-[9px] text-muted-foreground font-mono">{assessment.Timestamp?.split(', ')[1]}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-3 py-3 w-[210px] overflow-hidden">
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
                                            <TableCell className="px-3 py-3 text-center w-[140px] overflow-hidden">
                                                <div className="w-full truncate">
                                                    <span className="text-[11px] font-bold capitalize text-slate-600">
                                                        {assessment.Occupation || '-'}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-3 py-3 text-center w-[140px] overflow-hidden">
                                                <div className="w-full truncate">
                                                    <span className="text-[11px] text-primary font-black">
                                                        {assessment.PhoneNumber || '-'}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-2 text-center">
                                                {getPainBadge(assessment.PainIntensity_VAS)}
                                            </TableCell>
                                            <TableCell className="px-3 py-3 w-[180px] overflow-hidden">
                                                <div className="w-full truncate">
                                                    <span className="text-[11px] font-bold text-slate-700">
                                                        {assessment.Diagnosis || assessment.ChiefComplaint || '-'}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-3 py-3 w-[180px] overflow-hidden">
                                                <div className="w-full truncate">
                                                    <span className="text-[10px] text-slate-500 italic">
                                                        {assessment.DailyNote || '-'}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right px-3 pr-8 w-[140px]">
                                                <div className="flex flex-row justify-end gap-2 h-full items-center">
                                                    <Button variant="outline" size="sm" asChild className={`h-8 rounded-lg text-[10px] font-black px-3 ${btnClass} border-slate-200`}>
                                                        <Link href={`/assessment/${targetId}`}>VIEW</Link>
                                                    </Button>
                                                    <Button variant="secondary" size="sm" asChild className={`h-8 rounded-lg text-[10px] font-black px-3 ${btnClass} bg-slate-100`}>
                                                        <Link href={`/assessment/${targetId}/edit`}>EDIT</Link>
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
                💡 View mode includes patient history, clinical findings, and media attachments.
            </p>
        </div>
    );
}

