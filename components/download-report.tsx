"use client";

import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { useState } from "react";
import { formatDate, formatDateTime } from "@/lib/format-date";

import { cn } from "@/lib/utils";

interface ReportProps {
    assessment: any;
    className?: string;
}

export function DownloadReportButton({ assessment, className }: ReportProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    async function generatePDF() {
        setIsGenerating(true);
        try {
            const { jsPDF } = await import('jspdf');
            const doc = new jsPDF('p', 'mm', 'a4');
            const pageWidth = doc.internal.pageSize.getWidth();
            let y = 15;

            // Load Logo Image
            let logoImg: HTMLImageElement | null = null;
            try {
                const loadImage = (src: string): Promise<HTMLImageElement> => {
                    return new Promise((resolve, reject) => {
                        const img = new Image();
                        img.src = src;
                        img.onload = () => resolve(img);
                        img.onerror = (err) => reject(err);
                    });
                };
                logoImg = await loadImage('/58ef474e-0785-4b57-ad47-1f10d96ed4dc-removebg-preview.png');
            } catch (err) {
                console.error("Failed to load logo image:", err);
            }

            const addTitle = (text: string) => {
                if (y > 250) { 
                    doc.addPage(); 
                    y = 50; 
                }
                doc.setFontSize(10.5);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(30, 58, 138); // Blue-800
                doc.text(text, 15, y);
                y += 2;
                doc.setDrawColor(219, 234, 254); // Blue-100
                doc.setLineWidth(0.4);
                doc.line(15, y, pageWidth - 15, y);
                y += 6;
            };

            const addField = (label: string, value: string | undefined | null) => {
                if (y > 260) { 
                    doc.addPage(); 
                    y = 50; 
                }
                const val = value || 'N/A';
                doc.setFontSize(8.5);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(71, 85, 105); // Slate-600
                doc.text(`${label}:`, 15, y);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(30, 41, 59); // Slate-800
                const lines = doc.splitTextToSize(String(val), pageWidth - 70);
                doc.text(lines, 55, y);
                y += Math.max(lines.length * 4, 5) + 1;
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
            addField('Patient Name', assessment.PatientName);
            addField('Age / Gender', `${assessment.Age || 'N/A'} / ${assessment.Sex || 'N/A'}`);
            addField('Occupation', assessment.Occupation);
            addField('Primary Contact', assessment.PhoneNumber);
            addField('Clinical Date', formatDate(assessment.Date));
            addField('Physique (H/W)', `${assessment.Height || '-'} / ${assessment.Weight || '-'}`);
            addField('Clinical Vitals', `BP: ${assessment.BloodPressure || 'N/A'} | DM: ${assessment.DiabeticMellitus || 'N/A'}`);
            addField('Habits & Lifestyle', assessment.DietHabit);
            addField('Sleep & Cycle', `Sleep: ${assessment.SleepingHistory || 'N/A'} | Cycle: ${assessment.MenstruationHistory || 'N/A'}`);
            y += 4;

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
            doc.setFontSize(8.5);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(71, 85, 105);
            doc.text('Pain Intensity (VAS):', 15, y);
            const barX = 55;
            const barW = 100;
            const barH = 4;
            doc.setFillColor(241, 245, 249);
            doc.rect(barX, y - 3, barW, barH, 'F');
            const filledW = (Math.min(displayVas, 10) / 10) * barW;
            const r = displayVas <= 3 ? 34 : displayVas <= 6 ? 234 : 220;
            const g = displayVas <= 3 ? 197 : displayVas <= 6 ? 179 : 38;
            const b = displayVas <= 3 ? 94 : displayVas <= 6 ? 8 : 38;
            doc.setFillColor(r, g, b);
            doc.rect(barX, y - 3, filledW, barH, 'F');
            doc.setTextColor(30, 41, 59);
            doc.setFont('helvetica', 'bold');
            doc.text(`${displayVas}/10`, barX + barW + 5, y);
            y += 10;

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

            // ── Page Header & Footer Post-Processing ──
            const totalPages = doc.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                doc.setPage(i);
                
                // Draw Header Left
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(13);
                doc.setTextColor(30, 41, 59); // slate-800
                doc.text('Dr. C. BABUPRASAD PT.,', 15, 20);
                
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(7.5);
                doc.setTextColor(71, 85, 105); // slate-600
                doc.text('PHYSIOTHERAPIST & MANUAL THERAPIST', 15, 24.5);
                
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8.5);
                doc.setTextColor(100, 116, 139); // slate-500
                doc.text('Regd No: L13530', 15, 28.5);
                
                // Draw Header Logo (Right)
                if (logoImg) {
                    doc.addImage(logoImg, 'PNG', pageWidth - 15 - 28, 11, 28, 28);
                }
                
                // Divider Line
                doc.setDrawColor(226, 232, 240); // slate-200
                doc.setLineWidth(0.4);
                doc.line(15, 42, pageWidth - 15, 42);
                
                // Draw Footer
                doc.setDrawColor(226, 232, 240);
                doc.setLineWidth(0.4);
                doc.line(15, 271, pageWidth - 15, 271);
                
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(7.5);
                doc.setTextColor(71, 85, 105);
                doc.text('Gurupatham Hospital, Subramaniya Nagar, Opp to Thirubeni Cars, Junction, Salem - 5', pageWidth / 2, 276, { align: 'center' });
                doc.text('Email: cbprasad08@gmail.com   |   Phone: 98422 44441', pageWidth / 2, 280, { align: 'center' });
                
                // Page Numbers & Confidentiality
                doc.setFontSize(7);
                doc.setTextColor(148, 163, 184);
                doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, 287, { align: 'center' });
                doc.text('This document is a confidential medical record and should be treated as such.', pageWidth / 2, 291, { align: 'center' });
            }

            const fileName = `PhysioReport_${(assessment.PatientName || 'Patient').replace(/\s+/g, '_')}_${assessment.Date || 'NoDate'}.pdf`;
            doc.save(fileName);
        } catch (error) {
            console.error('PDF generation error:', error);
            alert('An unexpected error occurred during report generation. Please verify internet connectivity.');
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
