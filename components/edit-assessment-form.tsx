"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, X, Loader2 } from "lucide-react";

const formSchema = z.object({
    // I. Patient Demographics
    date: z.string(),
    name: z.string().min(2, "Name is required"),
    age: z.string(),
    sex: z.string().optional(),
    occupation: z.string().optional(),
    phoneNumber: z.string().optional(),
    height: z.string().optional(),
    weight: z.string().optional(),
    bloodPressure: z.string().optional(),
    sugarLevel: z.string().optional(),

    // II. Clinical History
    chiefComplaint: z.string().optional(),
    presentHistory: z.string().optional(),
    pastHistory: z.string().optional(),
    diagnosticImaging: z.string().optional(),
    redFlags: z.string().optional(),

    // III. Observation & Physical Examination
    observation: z.string().optional(),
    activeMovements: z.string().optional(),
    passiveMovements: z.string().optional(),
    musclePower: z.string().optional(),
    palpation: z.string().optional(),
    gait: z.string().optional(),
    neurologicalTests: z.string().optional(),
    sensation: z.string().optional(),
    reflexes: z.string().optional(),
    specialTests: z.string().optional(),
    endFeel: z.string().optional(),
    capsularPattern: z.string().optional(),
    resistedIsometricMovements: z.string().optional(),
    functionalTesting: z.string().optional(),
    jointPlayMovements: z.string().optional(),
    comments: z.string().optional(),

    // IV. Pain Assessment
    painHistory: z.string().optional(),
    aggravatingFactors: z.string().optional(),
    easingFactors: z.string().optional(),
    painDescription: z.string().optional(),
    painVas: z.number().min(0).max(10),
    symptomsLocation: z.string().optional(),

    // V. Diagnosis & Treatment Plan
    diagnosis: z.string().optional(),
    treatmentPlan: z.string().optional(),
    manualTherapy: z.string().optional(),
    electrotherapy: z.string().optional(),
    exercisePrescription: z.string().optional(),
    patientEducation: z.string().optional(),
    homeFollowups: z.string().optional(),
    whatTreatment: z.string().optional(),

    // VI. Summary & Follow-up
    patientSummary: z.string().optional(),
    review1: z.string().optional(),
    review2: z.string().optional(),
    review3: z.string().optional(),
});

interface EditFormProps {
    assessment: any;
    assessmentIndex: number;
}

export function EditAssessmentForm({ assessment, assessmentIndex }: EditFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            // I. Demographics - ensure all values are strings
            date: assessment.Date ? String(assessment.Date).split('T')[0] : new Date().toISOString().split("T")[0],
            name: String(assessment.PatientName || ""),
            age: String(assessment.Age || ""),
            sex: String(assessment.Sex || ""),
            occupation: String(assessment.Occupation || ""),
            phoneNumber: String(assessment.PhoneNumber || ""),
            height: String(assessment.Height || ""),
            weight: String(assessment.Weight || ""),
            bloodPressure: String(assessment.BloodPressure || ""),
            sugarLevel: String(assessment.SugarLevel || ""),

            // II. Clinical History
            chiefComplaint: String(assessment.ChiefComplaint || ""),
            presentHistory: String(assessment.PresentHistory || ""),
            pastHistory: String(assessment.PastHistory || ""),
            diagnosticImaging: String(assessment.DiagnosticImaging || ""),
            redFlags: String(assessment.RedFlags || ""),

            // III. Physical Exam
            observation: String(assessment.Observation || ""),
            activeMovements: String(assessment.ActiveROM || ""),
            passiveMovements: String(assessment.PassiveROM || ""),
            musclePower: String(assessment.MusclePower || ""),
            palpation: String(assessment.Palpation || ""),
            gait: String(assessment.Gait || ""),
            neurologicalTests: String(assessment.NeurologicalTests || ""),
            sensation: String(assessment.Sensation || ""),
            reflexes: String(assessment.Reflexes || ""),
            specialTests: String(assessment.SpecialTests || ""),
            endFeel: String(assessment.EndFeel || ""),
            capsularPattern: String(assessment.CapsularPattern || ""),
            resistedIsometricMovements: String(assessment.ResistedIsometrics || ""),
            functionalTesting: String(assessment.FunctionalTesting || ""),
            jointPlayMovements: String(assessment.JointPlayMovements || ""),
            comments: String(assessment.Comments || ""),

            // IV. Pain
            painHistory: String(assessment.PainHistory || ""),
            aggravatingFactors: String(assessment.AggravatingFactors || ""),
            easingFactors: String(assessment.EasingFactors || ""),
            painDescription: String(assessment.PainDescription || ""),
            painVas: Number(assessment.PainIntensity_VAS) || 0,
            symptomsLocation: String(assessment.SymptomsLocation || ""),

            // V. Treatment
            diagnosis: String(assessment.Diagnosis || ""),
            treatmentPlan: String(assessment.TreatmentPlan || ""),
            manualTherapy: String(assessment.ManualTherapy || ""),
            electrotherapy: String(assessment.Electrotherapy || ""),
            exercisePrescription: String(assessment.ExercisePrescription || ""),
            patientEducation: String(assessment.PatientEducation || ""),
            homeFollowups: String(assessment.HomeFollowups || ""),
            whatTreatment: String(assessment.WhatTreatment || ""),

            // VI. Summary
            patientSummary: String(assessment.PatientSummary || ""),
            review1: String(assessment.Review1 || ""),
            review2: String(assessment.Review2 || ""),
            review3: String(assessment.Review3 || ""),
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/assessments/${assessmentIndex}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                throw new Error(errorData.error || "Failed to update assessment");
            }

            alert("Assessment updated successfully!");
            router.push(`/assessment/${assessmentIndex}`);
            router.refresh();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Error updating assessment";
            alert(`Error: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button asChild variant="ghost" size="sm" className="gap-2">
                    <Link href={`/assessment/${assessmentIndex}`}>
                        <ArrowLeft className="h-4 w-4" />
                        Back to Assessment
                    </Link>
                </Button>
            </div>

            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Edit Assessment
                </h1>
                <p className="text-muted-foreground">
                    Update details for <span className="font-semibold">{assessment.PatientName}</span>
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                    {/* ========== I. PATIENT DEMOGRAPHICS ========== */}
                    <Card>
                        <CardHeader className="bg-primary/5">
                            <CardTitle className="text-lg">I. Patient Demographics</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="date" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date</FormLabel>
                                        <FormControl><Input type="date" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="name" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name *</FormLabel>
                                        <FormControl><Input placeholder="Patient Name" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <FormField control={form.control} name="age" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Age</FormLabel>
                                        <FormControl><Input placeholder="Age" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="sex" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sex</FormLabel>
                                        <FormControl><Input placeholder="M/F" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="occupation" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Occupation</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <FormField control={form.control} name="height" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Height</FormLabel>
                                        <FormControl><Input placeholder="cm" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="weight" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Weight</FormLabel>
                                        <FormControl><Input placeholder="kg" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="bloodPressure" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Blood Pressure</FormLabel>
                                        <FormControl><Input placeholder="120/80" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="sugarLevel" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sugar Level</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* ========== II. CLINICAL HISTORY ========== */}
                    <Card>
                        <CardHeader className="bg-primary/5">
                            <CardTitle className="text-lg">II. Clinical History</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            <FormField control={form.control} name="chiefComplaint" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Chief Complaints</FormLabel>
                                    <FormControl><Textarea {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="presentHistory" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Present History</FormLabel>
                                        <FormControl><Textarea {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="pastHistory" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Past Medical History</FormLabel>
                                        <FormControl><Textarea {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                            <FormField control={form.control} name="diagnosticImaging" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Diagnostic Image Reports</FormLabel>
                                    <FormControl><Textarea {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="redFlags" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Red Flags</FormLabel>
                                    <FormControl><Textarea {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    {/* ========== III. PHYSICAL EXAMINATION ========== */}
                    <Card>
                        <CardHeader className="bg-primary/5">
                            <CardTitle className="text-lg">III. Observation & Physical Examination</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            <FormField control={form.control} name="observation" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>On Observation (Posture)</FormLabel>
                                    <FormControl><Textarea {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <Separator />
                            <p className="text-sm font-medium text-muted-foreground">Range of Motion</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="activeMovements" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Active ROM</FormLabel>
                                        <FormControl><Textarea {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="passiveMovements" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Passive ROM</FormLabel>
                                        <FormControl><Textarea {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField control={form.control} name="musclePower" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Muscle Power</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="palpation" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Palpation</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="gait" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Gait</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                            <Separator />
                            <p className="text-sm font-medium text-muted-foreground">Neurological Screening</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField control={form.control} name="sensation" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sensation</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="reflexes" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Reflexes</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="neurologicalTests" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Neuro Tests</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                            <FormField control={form.control} name="specialTests" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Special Tests</FormLabel>
                                    <FormControl><Textarea {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField control={form.control} name="endFeel" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>End Feel</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="capsularPattern" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Capsular Pattern</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="jointPlayMovements" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Joint Play</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="resistedIsometricMovements" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Resisted Isometrics</FormLabel>
                                        <FormControl><Textarea {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="functionalTesting" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Functional Testing</FormLabel>
                                        <FormControl><Textarea {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                            <FormField control={form.control} name="comments" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Additional Comments</FormLabel>
                                    <FormControl><Textarea {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    {/* ========== IV. PAIN ASSESSMENT ========== */}
                    <Card>
                        <CardHeader className="bg-primary/5">
                            <CardTitle className="text-lg">IV. Pain Assessment</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            <FormField control={form.control} name="painHistory" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pain History</FormLabel>
                                    <FormControl><Textarea {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="aggravatingFactors" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Aggravating Factors</FormLabel>
                                        <FormControl><Textarea {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="easingFactors" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Easing Factors</FormLabel>
                                        <FormControl><Textarea {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                            <FormField control={form.control} name="painDescription" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type of Pain (Patient's Words)</FormLabel>
                                    <FormControl><Textarea {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="painVas" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>VAS Score (0-10): {field.value}</FormLabel>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm">0</span>
                                        <FormControl>
                                            <Slider min={0} max={10} step={1} value={[field.value]} onValueChange={(v) => field.onChange(v[0])} />
                                        </FormControl>
                                        <span className="text-sm">10</span>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="symptomsLocation" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Symptoms Location</FormLabel>
                                    <FormControl><Textarea {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    {/* ========== V. DIAGNOSIS & TREATMENT ========== */}
                    <Card>
                        <CardHeader className="bg-primary/5">
                            <CardTitle className="text-lg">V. Diagnosis & Treatment Plan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            <FormField control={form.control} name="diagnosis" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Diagnosis</FormLabel>
                                    <FormControl><Textarea {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="treatmentPlan" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Treatment Plan</FormLabel>
                                    <FormControl><Textarea {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="manualTherapy" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Manual Therapy</FormLabel>
                                        <FormControl><Textarea {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="electrotherapy" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Electrotherapy</FormLabel>
                                        <FormControl><Textarea {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                            <FormField control={form.control} name="exercisePrescription" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Exercise Prescription</FormLabel>
                                    <FormControl><Textarea {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="patientEducation" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Patient Education</FormLabel>
                                        <FormControl><Textarea {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="homeFollowups" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Home Follow-ups</FormLabel>
                                        <FormControl><Textarea {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                            <FormField control={form.control} name="whatTreatment" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Treatment Given (This Session)</FormLabel>
                                    <FormControl><Textarea {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    {/* ========== VI. SUMMARY ========== */}
                    <Card>
                        <CardHeader className="bg-primary/5">
                            <CardTitle className="text-lg">VI. Summary & Follow-up</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            <FormField control={form.control} name="patientSummary" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Patient Summary</FormLabel>
                                    <FormControl><Textarea className="min-h-[100px]" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField control={form.control} name="review1" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Review 1</FormLabel>
                                        <FormControl><Textarea {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="review2" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Review 2</FormLabel>
                                        <FormControl><Textarea {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="review3" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Review 3</FormLabel>
                                        <FormControl><Textarea {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="sticky bottom-0 bg-background/95 backdrop-blur border-t pt-4 pb-2 -mx-4 px-4">
                        <div className="flex flex-col sm:flex-row justify-between gap-3">
                            <Button type="button" variant="outline" asChild className="gap-2">
                                <Link href={`/assessment/${assessmentIndex}`}>
                                    <X className="h-4 w-4" />
                                    Cancel
                                </Link>
                            </Button>
                            <Button type="submit" size="lg" disabled={isSubmitting} className="gap-2 min-w-[180px]">
                                {isSubmitting ? (
                                    <><Loader2 className="h-4 w-4 animate-spin" />Updating...</>
                                ) : (
                                    <><Save className="h-4 w-4" />Update Assessment</>
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}
