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
            (assessment.Date && String(assessment.Date).toLowerCase().includes(query))
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

            <div className="rounded-xl border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="w-[110px]">Date</TableHead>
                                <TableHead>Patient</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="hidden md:table-cell">Occupation</TableHead>
                                <TableHead className="hidden md:table-cell">Diagnosis</TableHead>
                                <TableHead className="hidden lg:table-cell">Daily Note</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAssessments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground italic">
                                        {searchQuery ? "No results found." : "No assessments recorded yet."}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredAssessments.map((assessment) => {
                                    const targetId = assessment.id;
                                    const slug = getSlug(assessment.PatientName);

                                    return (
                                        <TableRow key={`${targetId}-${assessment.Date}`} className={rowClass}>
                                            <TableCell className="font-medium">
                                                <div className="flex flex-col">
                                                    <span className="text-sm">{formatDateShort(assessment.Date)}</span>
                                                    <span className="text-[10px] text-muted-foreground font-mono">{assessment.Timestamp?.split(', ')[1]}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-sm">
                                                        {assessment.PatientName || 'Unknown'}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground">{assessment.Age ? `${assessment.Age} yrs` : 'Age N/A'} • {assessment.Sex || '-'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getPainBadge(assessment.PainIntensity_VAS)}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell text-sm">
                                                {assessment.Occupation || '-'}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell max-w-[150px] truncate text-sm">
                                                {assessment.Diagnosis || assessment.ChiefComplaint || '-'}
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell max-w-[200px] truncate text-xs text-muted-foreground">
                                                {assessment.DailyNote || '-'}
                                            </TableCell>

                                            <TableCell className="text-right">
                                                <div className="flex flex-col sm:flex-row justify-end gap-1.5 sm:gap-2">
                                                    <Button variant="outline" size="sm" asChild className={`h-8 sm:h-9 rounded-lg text-[10px] sm:text-xs font-bold px-2 sm:px-3 ${btnClass}`}>
                                                        <Link href={`/assessment/${targetId}`}>
                                                            View
                                                        </Link>
                                                    </Button>
                                                    <Button variant="secondary" size="sm" asChild className={`h-8 sm:h-9 rounded-lg text-[10px] sm:text-xs font-bold px-2 sm:px-3 ${btnClass}`}>
                                                        <Link href={`/assessment/${targetId}/edit`}>
                                                            Edit
                                                        </Link>
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

