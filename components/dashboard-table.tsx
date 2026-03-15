"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Search } from "lucide-react";
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
    [key: string]: any;
}

interface DashboardTableProps {
    assessments: Assessment[];
}

export function DashboardTable({ assessments }: DashboardTableProps) {
    const [searchQuery, setSearchQuery] = useState("");

    // Sort assessments by Date and Timestamp descending (latest first)
    const sortedAssessments = [...assessments].sort((a, b) => {
        try {
            // Try to sort by Timestamp if available (most reliable for "last entry")
            if (a.Timestamp && b.Timestamp) {
                try {
                    const parseDate = (ts: string) => {
                        if (!ts || typeof ts !== 'string') return 0;
                        const parts = ts.split(', ');
                        if (parts.length < 2) return 0;
                        const [datePart, timePart] = parts;
                        const dateParts = datePart.split('/');
                        if (dateParts.length < 3) return 0;
                        const [day, month, year] = dateParts;
                        return new Date(`${year}-${month}-${day}T${timePart}`).getTime() || 0;
                    };
                    return parseDate(b.Timestamp) - parseDate(a.Timestamp);
                } catch {
                    return 0; // If parsing fails, treat as equal
                }
            }
            // Fallback to Date if Timestamp is missing
            const dateA = a.Date ? new Date(a.Date).getTime() : 0;
            const dateB = b.Date ? new Date(b.Date).getTime() : 0;
            return (dateB || 0) - (dateA || 0);
        } catch {
            return 0; // If anything fails, treat as equal
        }
    });


    // Filter assessments based on search query
    const filteredAssessments = sortedAssessments.filter((assessment) => {
        const query = searchQuery.toLowerCase();
        return (
            (assessment.PatientName && assessment.PatientName.toLowerCase().includes(query)) ||
            (assessment.Age && assessment.Age.toString().toLowerCase().includes(query)) ||
            (assessment.Occupation && assessment.Occupation.toLowerCase().includes(query)) ||
            (assessment.Diagnosis && assessment.Diagnosis.toLowerCase().includes(query)) ||
            (assessment.ChiefComplaint && assessment.ChiefComplaint.toLowerCase().includes(query)) ||
            (assessment.PastHistory && assessment.PastHistory.toLowerCase().includes(query)) ||
            (assessment.DailyNotes && assessment.DailyNotes.toLowerCase().includes(query)) ||
            (assessment.Date && assessment.Date.toLowerCase().includes(query))
        );
    });

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search by name, age, occupation, or diagnosis..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
                {searchQuery && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSearchQuery("")}
                    >
                        Clear
                    </Button>
                )}
            </div>

            {/* Results Count */}
            {searchQuery && (
                <p className="text-sm text-muted-foreground">
                    Found {filteredAssessments.length} of {assessments.length} assessments
                </p>
            )}

            {/* Table */}
            <div className="rounded-md border mobile-scroll">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Patient Name</TableHead>
                            <TableHead>Age</TableHead>
                            <TableHead>Occupation</TableHead>
                            <TableHead>Diagnosis/History</TableHead>
                            <TableHead>Daily Notes</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAssessments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    {searchQuery
                                        ? "No assessments found matching your search."
                                        : "No assessments found."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredAssessments.map((assessment, index) => {
                                // Find the original index in the full assessments array
                                const originalIndex = assessments.findIndex(
                                    (a) => a === assessment
                                );

                                return (
                                    <TableRow key={originalIndex}>
                                        <TableCell>{formatDateShort(assessment.Date)}</TableCell>
                                        <TableCell className="font-medium">
                                            {assessment.PatientName || 'N/A'}
                                        </TableCell>
                                        <TableCell>{assessment.Age || '-'}</TableCell>
                                        <TableCell>{assessment.Occupation || '-'}</TableCell>
                                        <TableCell className="max-w-[150px] truncate">
                                            {assessment.Diagnosis || assessment.ChiefComplaint || assessment.PastHistory || '-'}
                                        </TableCell>
                                        <TableCell className="max-w-[150px] truncate italic text-muted-foreground">
                                            {assessment.DailyNotes || "-"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/assessment/${originalIndex}`}>
                                                        View
                                                    </Link>
                                                </Button>
                                                <Button variant="outline" size="sm" asChild className="h-8 px-2 text-xs">
                                                    <Link href={`/assessment/${originalIndex}/edit`}>
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
    );
}
