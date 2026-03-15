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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
    diabeticMellitus: z.string().optional(),
    dietHabit: z.string().optional(),
    sleepingHistory: z.string().optional(),
    menstruationHistory: z.string().optional(),

    // II. Clinical History
    chiefComplaint: z.string().optional(),
    presentHistory: z.string().optional(),
    mechanismOfInjury: z.string().optional(),
    aggravatingFactors: z.string().optional(),
    easingFactors: z.string().optional(),
    pastHistory: z.string().optional(),
    diagnosticImaging: z.string().optional(),
    redFlags: z.string().optional(),

    // III. Observation & Physical Examination
    observation: z.string().optional(),
    activeROM: z.string().optional(),
    active_L_Flex: z.string().optional(),
    active_R_Flex: z.string().optional(),
    active_L_Ext: z.string().optional(),
    active_R_Ext: z.string().optional(),
    passiveROM: z.string().optional(),
    passive_L_Flex: z.string().optional(),
    passive_R_Flex: z.string().optional(),
    passive_L_Ext: z.string().optional(),
    passive_R_Ext: z.string().optional(),
    musclePower: z.string().optional(),
    palpation: z.string().optional(),
    palpation_Tenderness: z.string().optional(),
    palpation_Effusion: z.string().optional(),
    gait: z.string().optional(),
    neurologicalTests: z.string().optional(),
    sensoryScan: z.string().optional(),
    reflexes: z.string().optional(),
    specialTests: z.string().optional(),
    neuroSpecialTests: z.string().optional(),
    endFeel: z.string().optional(),
    capsularPattern: z.string().optional(),
    resistedIsometrics: z.string().optional(),
    functionalTesting: z.string().optional(),
    jointPlayMovements: z.string().optional(),
    comments: z.string().optional(),

    // IV. Pain Assessment
    painHistory: z.string().optional(),
    painDescription: z.string().optional(),
    painVas: z.number().min(0).max(10),
    painLocation: z.string().optional(),
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
    dailyNotes: z.string().optional(),

    // Legacy/Mixed
    twentyFourHourHistory: z.string().optional(),
    improvingStaticWorse: z.string().optional(),
    newOldInjury: z.string().optional(),
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
            date: assessment.Date ? assessment.Date.split('T')[0] : new Date().toISOString().split("T")[0],
            name: assessment.PatientName || "",
            age: assessment.Age?.toString() || "",
            sex: assessment.Sex || "",
            occupation: assessment.Occupation || "",
            phoneNumber: assessment.PhoneNumber || "",
            height: assessment.Height || "",
            weight: assessment.Weight || "",
            bloodPressure: assessment.BloodPressure || "",
            diabeticMellitus: assessment.DiabeticMellitus || "",
            dietHabit: assessment.DietHabit || "",
            sleepingHistory: assessment.SleepingHistory || "",
            menstruationHistory: assessment.MenstruationHistory || "",
            chiefComplaint: assessment.ChiefComplaint || "",
            presentHistory: assessment.PresentHistory || "",
            mechanismOfInjury: assessment.MechanismOfInjury || "",
            aggravatingFactors: assessment.AggravatingFactors || assessment.AggravatingEasingFactors || "",
            easingFactors: assessment.EasingFactors || "",
            pastHistory: assessment.PastHistory || "",
            diagnosticImaging: assessment.DiagnosticImaging || "",
            redFlags: assessment.RedFlags || "",
            observation: assessment.Observation || assessment.ObservationPosture || "",
            activeROM: assessment.ActiveROM || "",
            active_L_Flex: assessment.Active_L_Flex || "",
            active_R_Flex: assessment.Active_R_Flex || "",
            active_L_Ext: assessment.Active_L_Ext || "",
            active_R_Ext: assessment.Active_R_Ext || "",
            passiveROM: assessment.PassiveROM || "",
            passive_L_Flex: assessment.Passive_L_Flex || "",
            passive_R_Flex: assessment.Passive_R_Flex || "",
            passive_L_Ext: assessment.Passive_L_Ext || "",
            passive_R_Ext: assessment.Passive_R_Ext || "",
            musclePower: assessment.MusclePower || "",
            palpation: assessment.Palpation || "",
            palpation_Tenderness: assessment.Palpation_Tenderness || "",
            palpation_Effusion: assessment.Palpation_Effusion || "",
            gait: assessment.Gait || "",
            neurologicalTests: assessment.NeurologicalTests || "",
            sensoryScan: assessment.SensoryScan || "",
            reflexes: assessment.Reflexes || "",
            specialTests: assessment.SpecialTests || "",
            neuroSpecialTests: assessment.NeuroSpecialTests || "",
            endFeel: assessment.EndFeel || "",
            capsularPattern: assessment.CapsularPattern || "",
            resistedIsometrics: assessment.ResistedIsometrics || "",
            functionalTesting: assessment.FunctionalTesting || "",
            jointPlayMovements: assessment.JointPlayMovements || "",
            comments: assessment.Comments || "",
            painHistory: assessment.PainHistory || "",
            painDescription: assessment.PainDescription || assessment.PainPattern || "",
            painVas: parseInt(assessment.PainIntensity_VAS) || 0,
            painLocation: assessment.PainLocation || "",
            symptomsLocation: assessment.SymptomsLocation || "",
            diagnosis: assessment.Diagnosis || "",
            treatmentPlan: assessment.TreatmentPlan || "",
            manualTherapy: assessment.ManualTherapy || "",
            electrotherapy: assessment.Electrotherapy || "",
            exercisePrescription: assessment.ExercisePrescription || "",
            patientEducation: assessment.PatientEducation || "",
            homeFollowups: assessment.HomeFollowups || "",
            whatTreatment: assessment.WhatTreatment || "",
            patientSummary: assessment.PatientSummary || "",
            review1: assessment.Review1 || "",
            review2: assessment.Review2 || "",
            review3: assessment.Review3 || "",
            dailyNotes: assessment.DailyNotes || "",
            twentyFourHourHistory: assessment.TwentyFourHourHistory || "",
            improvingStaticWorse: assessment.ImprovingStaticWorse || "Static",
            newOldInjury: assessment.NewOrOldInjury || "New",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log('Updating assessment:', values);
        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/assessments/${assessmentIndex}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
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
            console.error('Form submission error:', error);
            alert(`Error: ${error instanceof Error ? error.message : "Error updating"}`);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button asChild variant="ghost" size="sm">
                    <Link href={`/assessment/${assessmentIndex}`}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Cancel
                    </Link>
                </Button>
            </div>

            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Edit Assessment</h1>
                <p className="text-muted-foreground">
                    Update all details for patient {assessment.PatientName}
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Patient Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="date"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Date</FormLabel>
                                                <FormControl>
                                                    <Input type="date" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Patient Name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="age"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Age</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Age" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="sex"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Sex</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Male/Female/Other" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="occupation"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Occupation</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Occupation" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="bloodPressure"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Blood Pressure</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g., 120/80" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="diabeticMellitus"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Diabetic Mellitus</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Sugar Level" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="dietHabit"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Diet Habit</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Diet" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="sleepingHistory"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Sleeping History</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Sleep pattern" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="menstruationHistory"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Menstruation History</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="History" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>History</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="mechanismOfInjury"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Mechanism of Injury</FormLabel>
                                                <FormControl>
                                                    <Textarea {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="chiefComplaint"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Chief Complaint</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Current issues..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="pastHistory"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Past Medical History</FormLabel>
                                                <FormControl>
                                                    <Textarea {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="diagnosticImaging"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Diagnostic Imaging</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="improvingStaticWorse"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Progress Status</FormLabel>
                                                    <FormControl>
                                                        <RadioGroup
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}
                                                            className="flex flex-col space-y-1"
                                                        >
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="Improving" id="edit-improving" />
                                                                <FormLabel htmlFor="edit-improving" className="font-normal">Improving</FormLabel>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="Static" id="edit-static" />
                                                                <FormLabel htmlFor="edit-static" className="font-normal">Static</FormLabel>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="Worse" id="edit-worse" />
                                                                <FormLabel htmlFor="edit-worse" className="font-normal">Worse</FormLabel>
                                                            </div>
                                                        </RadioGroup>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="newOldInjury"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Injury Type</FormLabel>
                                                    <FormControl>
                                                        <RadioGroup
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}
                                                            className="flex flex-col space-y-1"
                                                        >
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="New" id="edit-new" />
                                                                <FormLabel htmlFor="edit-new" className="font-normal">New</FormLabel>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="Old" id="edit-old" />
                                                                <FormLabel htmlFor="edit-old" className="font-normal">Old</FormLabel>
                                                            </div>
                                                        </RadioGroup>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="twentyFourHourHistory"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>24-Hour Severity</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Physical Examination</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="observation"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Posture/Observation</FormLabel>
                                                <FormControl>
                                                    <Textarea {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="activeROM"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Active ROM</FormLabel>
                                                    <FormControl>
                                                        <Textarea {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="passiveROM"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Passive ROM</FormLabel>
                                                    <FormControl>
                                                        <Textarea {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="active_L_Flex"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Left Flexion</FormLabel>
                                                    <FormControl><Input {...field} /></FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="active_R_Flex"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Right Flexion</FormLabel>
                                                    <FormControl><Input {...field} /></FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="active_L_Ext"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Left Extension</FormLabel>
                                                    <FormControl><Input {...field} /></FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="active_R_Ext"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Right Extension</FormLabel>
                                                    <FormControl><Input {...field} /></FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Pain & Symptoms</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="painLocation"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Pain Location</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="painVas"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>VAS: Pain Intensity (0-10)</FormLabel>
                                                <div className="flex items-center gap-4">
                                                    <span className="w-8 text-center font-bold text-lg">{field.value}</span>
                                                    <FormControl>
                                                        <Slider
                                                            min={0}
                                                            max={10}
                                                            step={1}
                                                            value={[field.value]}
                                                            onValueChange={(vals) => field.onChange(vals[0])}
                                                        />
                                                    </FormControl>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="painDescription"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Pain Pattern/Type</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Constant, periodic..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Advanced Tests</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="resistedIsometrics"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Resisted Isometrics</FormLabel>
                                                <FormControl><Textarea {...field} /></FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="specialTests"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Special Tests</FormLabel>
                                                <FormControl><Textarea {...field} /></FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="functionalTesting"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Functional Testing</FormLabel>
                                                <FormControl><Textarea {...field} /></FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="palpation_Tenderness"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Tenderness</FormLabel>
                                                    <FormControl><Input {...field} /></FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="palpation_Effusion"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Effusion</FormLabel>
                                                    <FormControl><Input {...field} /></FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="endFeel"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>End Feel</FormLabel>
                                                    <FormControl><Input {...field} /></FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="capsularPattern"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Capsular Pattern</FormLabel>
                                                    <FormControl><Input {...field} /></FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Diagnosis & Plan</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="diagnosis"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Diagnosis</FormLabel>
                                                <FormControl><Textarea {...field} /></FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="treatmentPlan"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Treatment Plan</FormLabel>
                                                <FormControl><Textarea {...field} /></FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="exercisePrescription"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Exercise Prescription</FormLabel>
                                                <FormControl><Textarea {...field} /></FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Reviews & Notes</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="review1"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Review 1</FormLabel>
                                                <FormControl><Input {...field} /></FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="dailyNotes"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-primary font-bold">Daily Notes</FormLabel>
                                                <FormControl>
                                                    <Textarea 
                                                        placeholder="Update progress..." 
                                                        className="min-h-[120px] bg-primary/5 border-primary/20"
                                                        {...field} 
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-6">
                        <Button type="button" variant="outline" asChild>
                            <Link href={`/assessment/${assessmentIndex}`}>Cancel</Link>
                        </Button>
                        <Button type="submit" size="lg" disabled={isSubmitting}>
                            {isSubmitting ? "Updating..." : "Update Assessment"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
