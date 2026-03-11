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
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Camera, Video, X, Upload, FileVideo, FileImage, Plus } from "lucide-react";
import { useRef } from "react";

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
    pastHistory: z.string().optional(),
    diagnosticImaging: z.string().optional(),
    redFlags: z.string().optional(),

    // III. Observation & Physical Examination
    observation: z.string().optional(),
    activeROM: z.string().optional(),
    passiveROM: z.string().optional(),
    musclePower: z.string().optional(),
    palpation: z.string().optional(),
    gait: z.string().optional(),
    neurologicalTests: z.string().optional(),
    sensation: z.string().optional(),
    reflexes: z.string().optional(),
    specialTests: z.string().optional(),
    endFeel: z.string().optional(),
    capsularPattern: z.string().optional(),
    resistedIsometrics: z.string().optional(),
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

    // Legacy/Mixed
    twentyFourHourHistory: z.string().optional(),
    improvingStaticWorse: z.string().optional(),
    newOldInjury: z.string().optional(),
});

export function AssessmentForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            date: new Date().toISOString().split('T')[0],
            name: "",
            age: "",
            sex: "",
            occupation: "",
            phoneNumber: "",
            height: "",
            weight: "",
            bloodPressure: "",
            diabeticMellitus: "",
            dietHabit: "",
            sleepingHistory: "",
            menstruationHistory: "",
            chiefComplaint: "",
            presentHistory: "",
            pastHistory: "",
            diagnosticImaging: "",
            redFlags: "",
            observation: "",
            activeROM: "",
            passiveROM: "",
            musclePower: "",
            palpation: "",
            gait: "",
            neurologicalTests: "",
            sensation: "",
            reflexes: "",
            specialTests: "",
            endFeel: "",
            capsularPattern: "",
            resistedIsometrics: "",
            functionalTesting: "",
            jointPlayMovements: "",
            comments: "",
            painHistory: "",
            aggravatingFactors: "",
            easingFactors: "",
            painDescription: "",
            painVas: 0,
            symptomsLocation: "",
            diagnosis: "",
            treatmentPlan: "",
            manualTherapy: "",
            electrotherapy: "",
            exercisePrescription: "",
            patientEducation: "",
            homeFollowups: "",
            whatTreatment: "",
            patientSummary: "",
            review1: "",
            review2: "",
            review3: "",
            twentyFourHourHistory: "",
            improvingStaticWorse: "Static",
            newOldInjury: "New",
        },
    });

    const [mediaFiles, setMediaFiles] = useState<{ file: File; base64: string; type: 'image' | 'video' }[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newFiles = Array.from(files);
        if (mediaFiles.length + newFiles.length > 4) {
            alert("Maximum 4 attachments allowed");
            return;
        }

        const processedFiles = await Promise.all(
            newFiles.map(async (file) => {
                const base64 = await toBase64(file);
                return {
                    file,
                    base64: base64 as string,
                    type: (file.type.startsWith('video/') ? 'video' : 'image') as 'image' | 'video'
                };
            })
        );

        setMediaFiles([...mediaFiles, ...processedFiles]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const toBase64 = (file: File) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const removeFile = (index: number) => {
        setMediaFiles(mediaFiles.filter((_, i) => i !== index));
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log('Form submission started');
        setIsSubmitting(true);
        try {
            // Include media files in the submission
            const payload = {
                ...values,
                files: mediaFiles.map(mf => ({
                    name: mf.file.name,
                    type: mf.file.type,
                    data: mf.base64.split(',')[1] // Just the bytes
                }))
            };

            const response = await fetch('/api/assessments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                console.error('Server error:', errorData);
                throw new Error(errorData.error || "Failed to submit assessment");
            }

            const result = await response.json();
            console.log('Success response:', result);

            alert("Assessment saved successfully!");
            form.reset();
        } catch (error) {
            console.error('Form submission error:', error);
            const errorMessage = error instanceof Error ? error.message : "Error saving assessment";
            alert(`Error: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
            console.log('Form submission completed');
        }
    }

    return (
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
                                </div>
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
                                    name="presentHistory"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>History of Present Illness</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Onset, progression..." {...field} />
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
                                                <Textarea placeholder="Surgeries, other conditions..." {...field} />
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
                                            <FormLabel>Diagnostic Imaging / Reports</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="X-ray, MRI, Blood tests..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="redFlags"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Red Flags</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Any warning signs..." {...field} />
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
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="Improving" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">Improving</FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="Static" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">Static</FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="Worse" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">Worse</FormLabel>
                                                        </FormItem>
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
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="New" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">New</FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="Old" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">Old</FormLabel>
                                                        </FormItem>
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
                                            <FormLabel>24-Hour Severity/Symptoms</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Morning/Night patterns..." {...field} />
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
                                            <FormLabel>Past History</FormLabel>
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
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Observation (Posture)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <FormField
                                    control={form.control}
                                    name="observation"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Textarea className="min-h-[100px]" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Examination Results</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="activeROM"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Active ROM</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="L/R Ext/Flex" {...field} />
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
                                                    <Textarea placeholder="L/R Ext/Flex" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="musclePower"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Muscle Power (MMT)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="MMT Grade..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="gait"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Gait</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Normal, Antalgic..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="sensation"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Sensation</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Normal, Impaired..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="reflexes"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Reflexes</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Grades..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="palpation"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Palpation</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Tenderness, swelling..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="comments"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Additional Comments</FormLabel>
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
                                        name="endFeel"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>End Feel</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="capsularPattern"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Capsular Pattern</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
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
                            <CardContent className="space-y-6">
                                <div className="flex justify-center border p-4 rounded-md">
                                    <div className="relative w-[300px] h-[400px]">
                                        <Image
                                            src="/body-chart.png"
                                            alt="Body Chart"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                </div>
                                <FormField
                                    control={form.control}
                                    name="symptomsLocation"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Symptoms Location (Describe)</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Describe where the symptoms are..." {...field} />
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
                                            <FormLabel>VAS: Intensity of Pain (0-10)</FormLabel>
                                            <div className="flex items-center gap-4">
                                                <span className="w-8 text-center">{field.value}</span>
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
                                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                                <span>No Pain</span>
                                                <span>Worst Pain</span>
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
                                            <FormLabel>Pain Type</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Constant, periodic, episodic, occasional" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Tests</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="resistedIsometrics"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Resisted Isometrics</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="functionalTesting"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Functional Testing</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="neurologicalTests"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Neurological Tests (Sensory, Reflexes)</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="specialTests"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Special Tests</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="jointPlayMovements"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Joint Play Movements</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="palpation"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Palpation (Tenderness, Effusion)</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Treatment Plan</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="diagnosis"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Physiotherapy Diagnosis</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Based on assessment..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="manualTherapy"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Manual Therapy</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Techniques used..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="electrotherapy"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Electrotherapy</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Modalities used..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="exercisePrescription"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Exercise Prescription</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Home exercise program..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Reviews & Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="review1"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Review 1</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="review2"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Review 2</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="review3"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Review 3</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="patientSummary"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Overall Patient Summary</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Media Attachments Section */}
                <Card className="mt-6">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Media Attachments (Max 4)</CardTitle>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={mediaFiles.length >= 4}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Photo/Video
                        </Button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*,video/*"
                            multiple
                            onChange={handleFileChange}
                        />
                    </CardHeader>
                    <CardContent>
                        {mediaFiles.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg text-muted-foreground">
                                <Upload className="h-10 w-10 mb-2 opacity-20" />
                                <p>No media attached. Click the button above to add up to 4 photos or videos.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {mediaFiles.map((mf, index) => (
                                    <div key={index} className="relative group rounded-lg overflow-hidden border">
                                        {mf.type === 'image' ? (
                                            <img
                                                src={mf.base64}
                                                alt={`Attachment ${index + 1}`}
                                                className="w-full h-48 object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-48 bg-black flex items-center justify-center">
                                                <FileVideo className="h-12 w-12 text-white opacity-50" />
                                                <span className="absolute bottom-2 left-2 text-[10px] text-white bg-black/50 px-1 rounded">Video</span>
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeFile(index)}
                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                        <div className="p-2 text-xs truncate bg-background border-t">
                                            {mf.file.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="flex justify-end pt-6">
                    <Button type="submit" size="lg" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save Assessment"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
