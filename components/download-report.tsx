"use client";

import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { useState } from "react";

interface ReportProps {
    assessment: any;
}

export function DownloadReportButton({ assessment }: ReportProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    async function generatePDF() {
        setIsGenerating(true);
        try {
            const { jsPDF } = await import('jspdf');
            const doc = new jsPDF('p', 'mm', 'a4');
            const pageWidth = doc.internal.pageSize.getWidth();
            let y = 15;

            const addTitle = (text: string) => {
                if (y > 260) { doc.addPage(); y = 15; }
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(41, 98, 255);
                doc.text(text, 14, y);
                y += 2;
                doc.setDrawColor(41, 98, 255);
                doc.line(14, y, pageWidth - 14, y);
                y += 6;
            };

            const addField = (label: string, value: string | undefined | null) => {
                if (y > 275) { doc.addPage(); y = 15; }
                const val = value || 'N/A';
                doc.setFontSize(9);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(100, 100, 100);
                doc.text(`${label}:`, 14, y);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(0, 0, 0);
                const lines = doc.splitTextToSize(val, pageWidth - 65);
                doc.text(lines, 55, y);
                y += Math.max(lines.length * 4, 5) + 1;
            };

            // ── Header ──
            doc.setFillColor(41, 98, 255);
            doc.rect(0, 0, pageWidth, 35, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.text('PHYSIOTHERAPY ASSESSMENT REPORT', pageWidth / 2, 15, { align: 'center' });
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(`Generated: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' })}`, pageWidth / 2, 23, { align: 'center' });
            doc.text('Prasad Physiotherapy Clinic', pageWidth / 2, 30, { align: 'center' });
            y = 42;

            // ── Patient Demographics ──
            addTitle('I. PATIENT DEMOGRAPHICS');
            addField('Patient Name', assessment.PatientName);
            addField('Date', assessment.Date);
            addField('Age', assessment.Age);
            addField('Sex', assessment.Sex);
            addField('Occupation', assessment.Occupation);
            addField('Phone', assessment.PhoneNumber);
            addField('Height', assessment.Height);
            addField('Weight', assessment.Weight);
            addField('Blood Pressure', assessment.BloodPressure);
            addField('Diabetic Mellitus', assessment.DiabeticMellitus);
            y += 3;

            // ── Clinical History ──
            addTitle('II. CLINICAL HISTORY');
            addField('Chief Complaint', assessment.ChiefComplaint);
            addField('Present Illness', assessment.PresentHistory);
            addField('Mechanism of Injury', assessment.MechanismOfInjury);
            addField('Past History', assessment.PastHistory);
            addField('Diagnostic Imaging', assessment.DiagnosticImaging);
            addField('Red Flags', assessment.RedFlags);
            addField('Progress', assessment.ImprovingStaticWorse);
            addField('Injury Type', assessment.NewOrOldInjury);
            y += 3;

            // ── Observation & Examination ──
            addTitle('III. OBSERVATION & EXAMINATION');
            addField('Observation', assessment.Observation || assessment.ObservationPosture);
            addField('Active ROM', assessment.ActiveROM);
            addField('Passive ROM', assessment.PassiveROM);
            addField('Muscle Power', assessment.MusclePower);
            addField('Gait', assessment.Gait);
            addField('Palpation', assessment.Palpation);
            addField('Reflexes', assessment.Reflexes);
            addField('Special Tests', assessment.SpecialTests);
            addField('Neurological Tests', assessment.NeurologicalTests);
            addField('End Feel', assessment.EndFeel);
            y += 3;

            // ── Pain Assessment ──
            addTitle('IV. PAIN ASSESSMENT');
            addField('Pain Location', assessment.PainLocation || assessment.SymptomsLocation);
            addField('VAS Score', assessment.PainIntensity_VAS !== undefined ? `${assessment.PainIntensity_VAS}/10` : undefined);
            addField('Pain Type', assessment.PainDescription || assessment.PainPattern);
            addField('Aggravating', assessment.AggravatingFactors || assessment.AggravatingEasingFactors);
            addField('Easing', assessment.EasingFactors);

            // VAS Bar
            if (assessment.PainIntensity_VAS !== undefined) {
                const vas = parseInt(assessment.PainIntensity_VAS) || 0;
                if (y > 265) { doc.addPage(); y = 15; }
                doc.setFontSize(8);
                doc.setTextColor(100, 100, 100);
                doc.text('VAS Scale:', 14, y);
                const barX = 55;
                const barW = 100;
                const barH = 5;
                doc.setFillColor(230, 230, 230);
                doc.rect(barX, y - 3.5, barW, barH, 'F');
                const filledW = (vas / 10) * barW;
                const r = vas <= 3 ? 34 : vas <= 6 ? 234 : 239;
                const g = vas <= 3 ? 197 : vas <= 6 ? 179 : 68;
                const b = vas <= 3 ? 94 : vas <= 6 ? 8 : 68;
                doc.setFillColor(r, g, b);
                doc.rect(barX, y - 3.5, filledW, barH, 'F');
                doc.setTextColor(0, 0, 0);
                doc.text(`${vas}/10`, barX + barW + 3, y);
                y += 10;
            }
            y += 3;

            // ── Diagnosis & Treatment ──
            addTitle('V. DIAGNOSIS & TREATMENT PLAN');
            addField('Diagnosis', assessment.Diagnosis);
            addField('Manual Therapy', assessment.ManualTherapy);
            addField('Electrotherapy', assessment.Electrotherapy);
            addField('Exercise Prescription', assessment.ExercisePrescription);
            addField('Patient Education', assessment.PatientEducation);
            addField('Home Follow-ups', assessment.HomeFollowups);
            y += 3;

            // ── Reviews ──
            addTitle('VI. REVIEWS & FOLLOW-UP');
            addField('Review 1', assessment.Review1);
            addField('Review 2', assessment.Review2);
            addField('Review 3', assessment.Review3);
            addField('Patient Summary', assessment.PatientSummary);
            addField('Daily Notes', assessment.DailyNotes);

            // ── Footer ──
            const totalPages = doc.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(160, 160, 160);
                doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, 290, { align: 'center' });
                doc.text('Confidential Medical Record — Prasad Physiotherapy Clinic', pageWidth / 2, 294, { align: 'center' });
            }

            const fileName = `Assessment_${(assessment.PatientName || 'Patient').replace(/\s+/g, '_')}_${assessment.Date || 'NoDate'}.pdf`;
            doc.save(fileName);
        } catch (error) {
            console.error('PDF generation error:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    }

    return (
        <Button onClick={generatePDF} disabled={isGenerating} variant="outline" size="sm" className="gap-2">
            <FileDown className="h-4 w-4" />
            {isGenerating ? 'Generating...' : 'Download PDF'}
        </Button>
    );
}
