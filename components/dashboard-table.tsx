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
import { Search, Eye, Edit, Loader2 } from "lucide-react";
import { formatDateShort } from "@/lib/format-date";

interface Assessment {
    Date: string;
    PatientName: string;
    Age: string;
    Occupation: string;
    MechanismOfInjury?: string;
    PastHistory?: string;
    [key: string]: any;
}

interface DashboardTableProps {
    assessments: Assessment[];
    loading?: boolean;
}

export function DashboardTable({ assessments, loading = false }: DashboardTableProps) {
    const [searchQuery, setSearchQuery] = useState("");

    // Filter assessments based on search query
    const filteredAssessments = assessments.filter((assessment) => {
        const query = searchQuery.toLowerCase();
        return (
            assessment.PatientName?.toLowerCase().includes(query) ||
            assessment.Age?.toString().toLowerCase().includes(query) ||
            assessment.Occupation?.toLowerCase().includes(query) ||
            assessment.MechanismOfInjury?.toLowerCase().includes(query) ||
            assessment.PastHistory?.toLowerCase().includes(query) ||
            assessment.Date?.toLowerCase().includes(query)
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
                        {loading ? (
                            // Loading skeleton
                            [...Array(5)].map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell>
                                        <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="h-4 w-8 bg-muted rounded animate-pulse"></div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="h-4 w-40 bg-muted rounded animate-pulse"></div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="h-8 w-16 bg-muted rounded animate-pulse ml-auto"></div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : filteredAssessments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    {searchQuery
                                        ? "No assessments found matching your search."
                                        : "No assessments found. Click 'New Assessment' to create one."}
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
                                            {assessment.PastHistory || assessment.MechanismOfInjury}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/assessment/${originalIndex}`}>
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        View
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/assessment/${originalIndex}/edit`}>
                                                        <Edit className="h-4 w-4" />
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
