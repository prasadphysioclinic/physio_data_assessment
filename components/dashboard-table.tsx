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
        // Try to sort by Timestamp if available (most reliable for "last entry")
        if (a.Timestamp && b.Timestamp) {
            // "08/03/2026, 11:51:03" format from Intl.DateTimeFormat 'en-GB'
            // We can compare them as strings if they are formatted consistently,
            // or convert them to sortable dates.
            try {
                const parseDate = (ts: string) => {
                    const [datePart, timePart] = ts.split(', ');
                    const [day, month, year] = datePart.split('/');
                    return new Date(`${year}-${month}-${day}T${timePart}`).getTime();
                };
                return parseDate(b.Timestamp) - parseDate(a.Timestamp);
            } catch (e) {
                // Fallback to string comparison if parsing fails
                return b.Timestamp.localeCompare(a.Timestamp);
            }
        }
        // Fallback to Date if Timestamp is missing
        return new Date(b.Date).getTime() - new Date(a.Date).getTime();
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
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAssessments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
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
                                            {assessment.PatientName}
                                        </TableCell>
                                        <TableCell>{assessment.Age}</TableCell>
                                        <TableCell>{assessment.Occupation}</TableCell>
                                        <TableCell className="max-w-[200px] truncate">
                                            {assessment.Diagnosis || assessment.ChiefComplaint || assessment.PastHistory}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={`/assessment/${originalIndex}`}>
                                                    View
                                                </Link>
                                            </Button>
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
