"use client";

import { Button } from "@/components/ui/button";
import { FileDown, FileText } from "lucide-react";
import { useState } from "react";
import { formatDate, formatDateTime } from "@/lib/format-date";
import { cn } from "@/lib/utils";

interface ReportProps {
    assessment: any;
    className?: string;
}

// Helper to load image in browser
const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
    });
};

// Helper to draw the letterhead header on each page
const drawHeader = (doc: any, logoImg: HTMLImageElement | null, pageWidth: number) => {
    // Dr. C. BABUPRASAD in serif Times-Bold font size 13
    doc.setFont('times', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(40, 40, 40); // Dark grey
    doc.text('Dr. C. BABUPRASAD', 15, 21);
    
    // Measure width and render PT., in a smaller font size (9.5)
    const nameWidth = doc.getTextWidth('Dr. C. BABUPRASAD');
    doc.setFont('times', 'bold');
    doc.setFontSize(9.5);
    doc.text(' PT.,', 15 + nameWidth, 21);
    
    // Subtitle in helvetica bold
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(115, 115, 115); // Lighter grey
    doc.text('PHYSIOTHERAPIST & MANUAL THERAPIST', 15, 25.5);
    
    // Regd No: L13530
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(140, 140, 140); // Even lighter grey
    doc.text('Regd No: L13530', 15, 29.5);
    
    // Draw Header Logo (Right)
    if (logoImg) {
        doc.addImage(logoImg, 'PNG', pageWidth - 15 - 30, 11, 30, 30);
    }
    
    // Divider Line (Subtle)
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.4);
    doc.line(15, 43, pageWidth - 15, 43);
};

// Helper to draw the footer on each page
const drawFooter = (doc: any, pageWidth: number, i: number, totalPages: number) => {
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.line(15, 271, pageWidth - 15, 271);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(115, 115, 115);
    doc.text('Gurupatham Hospital, Subramaniya Nagar, Opp to Thirubeni Cars, Junction, Salem - 5', pageWidth / 2, 276, { align: 'center' });
    doc.text('Email: cbprasad08@gmail.com   |   Phone: 98422 44441', pageWidth / 2, 280, { align: 'center' });
    
    // Page Numbers & Confidentiality
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, 287, { align: 'center' });
    doc.text('This document is a confidential medical record and should be treated as such.', pageWidth / 2, 291, { align: 'center' });
};

// Helper to draw the E-Signature & Stamp Area
const drawSignatureAndStamp = (doc: any, sigImg: HTMLImageElement | null, pageWidth: number, y: number): number => {
    // Pin signature block to the bottom of the page (starts at y = 210, right above footer)
    if (y > 210) {
        doc.addPage();
        y = 210;
    } else {
        y = 210;
    }

    const rightXCenter = pageWidth - 20 - 22.5; // Center of the signature area on the right

    // Draw Signature on the right
    if (sigImg) {
        // Width 35, Height 22 (maintaining ratio)
        doc.addImage(sigImg, 'PNG', pageWidth - 20 - 35, y - 2, 35, 22);
    }

    // Signature Line
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.4);
    doc.line(pageWidth - 20 - 45, y + 21, pageWidth - 20, y + 21);

    // Authorized Signature Text
    doc.setFont('times', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);
    doc.text('Dr. C. Babuprasad', rightXCenter, y + 26, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(115, 115, 115);
    doc.text('Authorized Signature', rightXCenter, y + 30, { align: 'center' });

    // Draw Stamp as royal blue text centered on the right directly below signature
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(26, 54, 153); // Royal Blue stamp color
    doc.text('Dr.C.Babuprasad.PT.,', rightXCenter, y + 37, { align: 'center' });
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text('Physiotherapist', rightXCenter, y + 41, { align: 'center' });
    doc.text('Reg No:L13530', rightXCenter, y + 45, { align: 'center' });
    
    return y + 50;
};

// Helper to render demographics box in standard report
const drawDemographicsGrid = (doc: any, assessment: any, yStart: number, pageWidth: number): number => {
    let y = yStart;
    
    // Draw a subtle border container with light background
    doc.setFillColor(250, 250, 250); // grey-50 background
    doc.setDrawColor(226, 232, 240); // slate-200 border
    doc.setLineWidth(0.3);
    doc.rect(15, y, pageWidth - 30, 48, 'FD');
    
    // Column boundaries
    const col1X = 20;
    const col2X = 110;
    
    const drawGridItem = (label: string, value: string | undefined | null, x: number, gridY: number) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139); // slate-500
        doc.text(label.toUpperCase(), x, gridY);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(30, 41, 59); // slate-800
        doc.text(value || 'N/A', x, gridY + 4);
    };
    
    // Row 1
    drawGridItem('Patient Name', assessment.PatientName, col1X, y + 6);
    drawGridItem('Clinical Date', formatDate(assessment.Date), col2X, y + 6);
    
    // Row 2
    drawGridItem('Age / Gender', `${assessment.Age || 'N/A'} / ${assessment.Sex || 'N/A'}`, col1X, y + 16);
    drawGridItem('Primary Contact', assessment.PhoneNumber, col2X, y + 16);
    
    // Row 3
    drawGridItem('Occupation', assessment.Occupation, col1X, y + 26);
    drawGridItem('Physique (H/W)', `${assessment.Height || '-'} / ${assessment.Weight || '-'}`, col2X, y + 26);
    
    // Row 4
    drawGridItem('Clinical Vitals', `BP: ${assessment.BloodPressure || 'N/A'} | DM: ${assessment.DiabeticMellitus || 'N/A'}`, col1X, y + 36);
    drawGridItem('Sleep & Cycle', `Sleep: ${assessment.SleepingHistory || 'N/A'} | Cycle: ${assessment.MenstruationHistory || 'N/A'}`, col2X, y + 36);

    return y + 54;
};

// Helper to render demographics box in summary report
const drawSummaryDemographicsGrid = (doc: any, assessment: any, yStart: number, pageWidth: number): number => {
    let y = yStart;
    
    doc.setFillColor(250, 250, 250);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.rect(15, y, pageWidth - 30, 26, 'FD');
    
    const col1X = 20;
    const col2X = 110;
    
    const drawGridItem = (label: string, value: string | undefined | null, x: number, gridY: number) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text(label.toUpperCase(), x, gridY);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(30, 41, 59);
        doc.text(value || 'N/A', x, gridY + 4);
    };
    
    drawGridItem('Patient Name', assessment.PatientName, col1X, y + 6);
    drawGridItem('Clinical Date', formatDate(assessment.Date), col2X, y + 6);
    drawGridItem('Age / Gender', `${assessment.Age || 'N/A'} / ${assessment.Sex || 'N/A'}`, col1X, y + 16);
    drawGridItem('Occupation', assessment.Occupation, col2X, y + 16);

    return y + 32;
};

// ── 1. Full Assessment Report Button ──
export function DownloadReportButton({ assessment, className }: ReportProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    async function generatePDF() {
        setIsGenerating(true);
        try {
            const { jsPDF } = await import('jspdf');
            const doc = new jsPDF('p', 'mm', 'a4');
            const pageWidth = doc.internal.pageSize.getWidth();
            let y = 15;

            // Load Images
            let logoImg: HTMLImageElement | null = null;
            let sigImg: HTMLImageElement | null = null;
            try {
                logoImg = await loadImage('/58ef474e-0785-4b57-ad47-1f10d96ed4dc-removebg-preview.png');
            } catch (e) { console.error("Logo error:", e); }
            try {
                sigImg = await loadImage('/image-removebg-preview (5).png');
            } catch (e) { console.error("Signature error:", e); }

            const addTitle = (text: string) => {
                if (y > 240) { 
                    doc.addPage(); 
                    y = 50; 
                }
                // Section header accent bar on the left
                doc.setFillColor(30, 58, 138); // Blue-800
                doc.rect(15, y - 4.5, 3, 6.5, 'F');

                doc.setFontSize(10.5);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(30, 58, 138); // Blue-800
                doc.text(text, 20, y);
                y += 2;
                doc.setDrawColor(226, 232, 240); // slate-200
                doc.setLineWidth(0.4);
                doc.line(15, y, pageWidth - 15, y);
                y += 7;
            };

            const addField = (label: string, value: string | undefined | null) => {
                if (y > 260) { 
                    doc.addPage(); 
                    y = 50; 
                }
                const val = value || 'N/A';

                doc.setFontSize(8);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(100, 116, 139); // slate-500
                doc.text(`${label.toUpperCase()}`, 15, y);
                
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(9);
                doc.setTextColor(30, 41, 59); // slate-800
                const lines = doc.splitTextToSize(String(val), pageWidth - 80);
                doc.text(lines, 65, y);
                y += Math.max(lines.length * 4.2, 6) + 1.5;
            };

            // ── Document Title ──
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.setTextColor(30, 41, 59);
            doc.text('CLINICAL ASSESSMENT REPORT', pageWidth / 2, 50, { align: 'center' });
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8.5);
            doc.text(`Patient ID: #${String(assessment.id || 'NEW').padStart(4, '0')}`, pageWidth / 2, 55, { align: 'center' });
            y = 65;

            // ── Patient Demographics ──
            addTitle('I. PATIENT IDENTIFICATION');
            y = drawDemographicsGrid(doc, assessment, y, pageWidth);
            y += 8;

            // ── History & Complaint ──
            addTitle('II. CLINICAL HISTORY');
            addField('Chief Complaint', assessment.ChiefComplaint);
            addField('Present History', assessment.PresentHistory);
            addField('Past Medical History', assessment.PastHistory);
            addField('Imaging Findings', assessment.DiagnosticImaging);
            addField('Red Flags', assessment.RedFlags);
            y += 4;

            // ── Physical Examination ──
            addTitle('III. PHYSICAL EXAMINATION');
            addField('General Observation', assessment.Observation);
            addField('Range of Motion (Active)', assessment.ActiveROM);
            addField('Range of Motion (Passive)', assessment.PassiveROM);
            addField('Manual Muscle Testing', assessment.MusclePower);
            addField('Palpation Findings', assessment.Palpation);
            addField('Gait Analysis', assessment.Gait);
            addField('Functional Testing', assessment.FunctionalTesting);
            addField('Neurological Tests', assessment.NeurologicalTests);
            addField('Sensory Mapping', assessment.Sensation);
            addField('DTR Reflexes', assessment.Reflexes);
            addField('Special Tests', assessment.SpecialTests);
            addField('Clinical Comments', assessment.Comments);
            y += 4;

            // ── Pain Profile ──
            addTitle('IV. PAIN ASSESSMENT PROFILE');
            addField('Symptoms Location', assessment.SymptomsLocation);
            addField('Pain History', assessment.PainHistory);
            addField('Pain Description', assessment.PainDescription);
            addField('Aggravating Factors', assessment.AggravatingFactors);
            addField('Easing Factors', assessment.EasingFactors);
            
            // VAS Intensity Rendering
            const rawVas = Number(assessment.PainIntensity_VAS || 0);
            const displayVas = rawVas / 10;
            if (y > 250) { doc.addPage(); y = 50; }
            
            if (y > 55) {
                doc.setDrawColor(241, 245, 249);
                doc.setLineWidth(0.2);
                doc.line(15, y - 2.5, pageWidth - 15, y - 2.5);
            }
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(100, 116, 139);
            doc.text('PAIN INTENSITY (VAS)', 15, y);
            const barX = 55;
            const barW = 100;
            const barH = 5;
            doc.setFillColor(241, 245, 249);
            doc.rect(barX, y - 3.5, barW, barH, 'F');
            const filledW = (Math.min(displayVas, 10) / 10) * barW;
            const r = displayVas <= 3 ? 34 : displayVas <= 6 ? 234 : 220;
            const g = displayVas <= 3 ? 197 : displayVas <= 6 ? 179 : 38;
            const b = displayVas <= 3 ? 94 : displayVas <= 6 ? 8 : 38;
            doc.setFillColor(r, g, b);
            doc.rect(barX, y - 3.5, filledW, barH, 'F');
            doc.setTextColor(30, 41, 59);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.text(`${displayVas}/10`, barX + barW + 5, y);
            y += 12;

            // ── Plan & Diagnosis ──
            addTitle('V. DIAGNOSIS & INTERVENTION');
            addField('Problem List', assessment['Problem List']);
            addField('Clinical Diagnosis', assessment.Diagnosis);
            addField('Treatment Plan', assessment.TreatmentPlan);
            addField('Manual Therapy', assessment.ManualTherapy);
            addField('Electrotherapy', assessment.Electrotherapy);
            addField('Exercise Prescription', assessment.ExercisePrescription);
            addField('Patient Education', assessment.PatientEducation);
            addField('Home Follow-ups', assessment.HomeFollowups);
            addField('Specific advise', assessment['Specific advice'] || assessment.WhatTreatment);
            y += 4;

            // ── Conclusion ──
            addTitle('VI. ADMINISTRATIVE SUMMARY');
            addField('Daily Progress Note', assessment.DailyNote);
            addField('Review Schedule', `R1: ${assessment.Review1 || '-'} | R2: ${assessment.Review2 || '-'} | R3: ${assessment.Review3 || '-'}`);
            addField('Record Date', formatDate(assessment.Date));
            addField('Record Timestamp', formatDateTime(assessment.Timestamp));

            // ── E-Signature & Stamp ──
            y = drawSignatureAndStamp(doc, sigImg, pageWidth, y);

            // ── Post-Process Headers, Footers, and Watermarks ──
            const totalPages = doc.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                doc.setPage(i);
                
                // Draw background watermark centered with low opacity (letterhead style)
                if (logoImg) {
                    try {
                        const GStateClass = (doc as any).GState;
                        if (GStateClass) {
                            doc.saveGraphicsState();
                            doc.setGState(new GStateClass({ opacity: 0.05 }));
                            doc.addImage(logoImg, 'PNG', (pageWidth - 90) / 2, (297 - 90) / 2, 90, 90);
                            doc.restoreGraphicsState();
                        }
                    } catch (err) {
                        console.error("Watermark rendering error:", err);
                    }
                }

                drawHeader(doc, logoImg, pageWidth);
                drawFooter(doc, pageWidth, i, totalPages);
            }

            const fileName = `PhysioReport_${(assessment.PatientName || 'Patient').replace(/\s+/g, '_')}_${assessment.Date || 'NoDate'}.pdf`;
            doc.save(fileName);
        } catch (error) {
            console.error('PDF generation error:', error);
            alert('An unexpected error occurred during report generation.');
        } finally {
            setIsGenerating(false);
        }
    }

    return (
        <Button 
            onClick={generatePDF} 
            disabled={isGenerating} 
            variant="outline" 
            size="sm" 
            className={cn("gap-2 border-blue-200 hover:bg-blue-50 text-blue-700 font-bold h-11", className)}
        >
            <FileDown className="h-4 w-4 shrink-0" />
            <span className="truncate">
                {isGenerating ? 'Compiling...' : (
                    <span className="flex items-center">
                        <span className="hidden xs:inline">Download Assessment Report</span>
                        <span className="xs:hidden">Get Report</span>
                    </span>
                )}
            </span>
        </Button>
    );
}

// ── 2. Limited Summary Report Button ──
export function DownloadSummaryButton({ assessment, className }: ReportProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    async function generatePDF() {
        setIsGenerating(true);
        try {
            const { jsPDF } = await import('jspdf');
            const doc = new jsPDF('p', 'mm', 'a4');
            const pageWidth = doc.internal.pageSize.getWidth();
            let y = 15;

            // Load Images
            let logoImg: HTMLImageElement | null = null;
            let sigImg: HTMLImageElement | null = null;
            try {
                logoImg = await loadImage('/58ef474e-0785-4b57-ad47-1f10d96ed4dc-removebg-preview.png');
            } catch (e) { console.error("Logo error:", e); }
            try {
                sigImg = await loadImage('/image-removebg-preview (5).png');
            } catch (e) { console.error("Signature error:", e); }

            const addTitle = (text: string) => {
                if (y > 240) { 
                    doc.addPage(); 
                    y = 50; 
                }
                doc.setFillColor(30, 58, 138); // Blue-800
                doc.rect(15, y - 4.5, 3, 6.5, 'F');

                doc.setFontSize(10.5);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(30, 58, 138); // Blue-800
                doc.text(text, 20, y);
                y += 2;
                doc.setDrawColor(226, 232, 240); // slate-200
                doc.setLineWidth(0.4);
                doc.line(15, y, pageWidth - 15, y);
                y += 7;
            };

            const addField = (label: string, value: string | undefined | null) => {
                if (y > 260) { 
                    doc.addPage(); 
                    y = 50; 
                }
                const val = value || 'N/A';

                doc.setFontSize(8);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(100, 116, 139);
                doc.text(`${label.toUpperCase()}`, 15, y);
                
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(9);
                doc.setTextColor(30, 41, 59);
                const lines = doc.splitTextToSize(String(val), pageWidth - 80);
                doc.text(lines, 65, y);
                y += Math.max(lines.length * 4.2, 6) + 1.5;
            };

            // ── Document Title ──
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.setTextColor(30, 41, 59);
            doc.text('CLINICAL SESSION SUMMARY', pageWidth / 2, 50, { align: 'center' });
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8.5);
            doc.text(`Patient ID: #${String(assessment.id || 'NEW').padStart(4, '0')}`, pageWidth / 2, 55, { align: 'center' });
            y = 65;

            // ── Patient Identification ──
            addTitle('PATIENT IDENTIFICATION');
            y = drawSummaryDemographicsGrid(doc, assessment, y, pageWidth);
            y += 8;

            // ── Session Summary & Clinical Note ──
            addTitle('CLINICAL SUMMARY');
            addField('Chief Complaint', assessment.ChiefComplaint);
            addField('Diagnosis', assessment.Diagnosis);
            addField('Treatment', assessment.TreatmentPlan);
            addField('Session Notes & Summary', assessment.DailyNote);
            y += 4;

            // ── E-Signature & Stamp ──
            y = drawSignatureAndStamp(doc, sigImg, pageWidth, y);

            // ── Post-Process Headers, Footers, and Watermarks ──
            const totalPages = doc.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                doc.setPage(i);
                
                // Draw background watermark centered with low opacity (letterhead style)
                if (logoImg) {
                    try {
                        const GStateClass = (doc as any).GState;
                        if (GStateClass) {
                            doc.saveGraphicsState();
                            doc.setGState(new GStateClass({ opacity: 0.05 }));
                            doc.addImage(logoImg, 'PNG', (pageWidth - 90) / 2, (297 - 90) / 2, 90, 90);
                            doc.restoreGraphicsState();
                        }
                    } catch (err) {
                        console.error("Watermark rendering error:", err);
                    }
                }

                drawHeader(doc, logoImg, pageWidth);
                drawFooter(doc, pageWidth, i, totalPages);
            }

            const fileName = `PhysioSummary_${(assessment.PatientName || 'Patient').replace(/\s+/g, '_')}_${assessment.Date || 'NoDate'}.pdf`;
            doc.save(fileName);
        } catch (error) {
            console.error('PDF generation error:', error);
            alert('An unexpected error occurred during summary report generation.');
        } finally {
            setIsGenerating(false);
        }
    }

    return (
        <Button 
            onClick={generatePDF} 
            disabled={isGenerating} 
            variant="outline" 
            size="sm" 
            className={cn("gap-2 border-emerald-200 hover:bg-emerald-50 text-emerald-700 font-bold h-11", className)}
        >
            <FileText className="h-4 w-4 shrink-0" />
            <span className="truncate">
                {isGenerating ? 'Compiling...' : (
                    <span className="flex items-center">
                        <span className="hidden xs:inline">Download Session Summary</span>
                        <span className="xs:hidden">Get Summary</span>
                    </span>
                )}
            </span>
        </Button>
    );
}
