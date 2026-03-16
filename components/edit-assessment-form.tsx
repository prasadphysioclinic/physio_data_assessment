"use client";

import { useState, useRef, useEffect } from "react";
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
import Image from "next/image";
import { ArrowLeft, Camera, Video, X, Upload, FileVideo, Plus } from "lucide-react";
import { sanitizeFormData, validateFileSize, checkDuplicate, compressImage, convertDriveUrl, isVideoUrl } from "@/lib/utils-data";
import { getFromGoogleSheet } from "@/lib/apps-script";

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
    sensation: z.string().optional(),
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

    // Media upload state
    const [mediaFiles, setMediaFiles] = useState<{ file: File; base64: string; type: 'image' | 'video' }[]>([]);
    const [existingMedia, setExistingMedia] = useState<string[]>([]);
    const [isStreaming, setIsStreaming] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('environment');
    const [isInitializing, setIsInitializing] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Load existing media URLs (Industrial Grade Scanner)
    useEffect(() => {
        const allMedia: string[] = [];
        const seenUrls = new Set<string>();
        const urlRegex = /(https?:\/\/[^\s]+|drive\.google\.com[^\s]+)/gi;

        Object.entries(assessment).forEach(([key, value]) => {
            if (!value) return;
            
            const valStr = String(value).trim();
            const lowerKey = key.toLowerCase().replace(/[\s_-]/g, '');
            
            // Skip known non-media metadata
            const systemBlacklist = ['patientname', 'date', 'timestamp', 'age', 'sex', 'occupation', 'phonenumber', 'action', 'rowindex', 'submittedby'];
            if (systemBlacklist.includes(lowerKey)) return;

            // Pattern Match
            const matches = valStr.match(urlRegex);
            if (matches) {
                matches.forEach(m => {
                    if (!seenUrls.has(m)) {
                        allMedia.push(m);
                        seenUrls.add(m);
                    }
                });
            } else if (valStr.length >= 25 && valStr.length <= 50 && !valStr.includes(' ') && !valStr.includes('/') && !valStr.includes(':')) {
               if (!seenUrls.has(valStr)) {
                   allMedia.push(valStr);
                   seenUrls.add(valStr);
               }
            }
        });
        
        setExistingMedia(allMedia);
    }, [assessment]);

    // Camera stream management
    useEffect(() => {
        if (isStreaming && videoRef.current && streamRef.current) {
            const v = videoRef.current;
            if (v.srcObject !== streamRef.current) {
                v.srcObject = streamRef.current;
                v.play().catch(e => console.error("Playback error:", e));
            }
        }
    }, [isStreaming, cameraFacing]);

    useEffect(() => {
        return () => { stopCamera(); };
    }, []);

    const startCamera = async () => {
        setIsInitializing(true);
        try {
            if (streamRef.current) stopCamera();
            let stream: MediaStream;
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: cameraFacing }, audio: true });
            } catch {
                stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: cameraFacing }, audio: false });
            }
            streamRef.current = stream;
            setIsStreaming(true);
        } catch (err) {
            alert("Could not access camera. Please check camera permissions.");
        } finally {
            setIsInitializing(false);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) videoRef.current.srcObject = null;
        setIsStreaming(false);
    };

    const totalMediaCount = existingMedia.length + mediaFiles.length;
    const maxNewMedia = 4 - existingMedia.length;

    const takePhoto = () => {
        if (!videoRef.current || totalMediaCount >= 4) return;
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(video, 0, 0);
            const base64 = canvas.toDataURL('image/jpeg');
            const arr = base64.split(',');
            const mime = arr[0].match(/:(.*?);/)![1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) u8arr[n] = bstr.charCodeAt(n);
            const blob = new Blob([u8arr], { type: mime });
            const rawFile = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
            
            compressImage(rawFile).then(({ base64, compressedFile }) => {
                setMediaFiles(prev => [...prev, { file: compressedFile, base64, type: 'image' }]);
            });
        }
    };

    const startRecording = () => {
        if (!streamRef.current || totalMediaCount >= 4) return;
        const chunks: BlobPart[] = [];
        const recorder = new MediaRecorder(streamRef.current);
        recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
        recorder.onstop = async () => {
            const blob = new Blob(chunks, { type: 'video/mp4' });
            const base64 = await toBase64(new File([blob], "video.mp4"));
            const file = new File([blob], `video_${Date.now()}.mp4`, { type: 'video/mp4' });
            setMediaFiles(prev => [...prev, { file, base64: base64 as string, type: 'video' }]);
        };
        recorder.start();
        mediaRecorderRef.current = recorder;
        setIsRecording(true);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const toBase64 = (file: File) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        const newFiles = Array.from(files);
        if (totalMediaCount + newFiles.length > 4) {
            alert(`Maximum 4 total attachments. You can add ${maxNewMedia - mediaFiles.length} more.`);
            return;
        }

        const validFiles: File[] = [];
        for (const file of newFiles) {
            const validation = validateFileSize(file);
            if (!validation.valid) {
                alert(validation.error);
                continue;
            }
            validFiles.push(file);
        }

        const processedFiles = await Promise.all(
            validFiles.map(async (file) => {
                const { base64, compressedFile } = await compressImage(file);
                return { 
                    file: compressedFile, 
                    base64: base64, 
                    type: (file.type.startsWith('video/') ? 'video' : 'image') as 'image' | 'video' 
                };
            })
        );
        
        setMediaFiles(prev => [...prev, ...processedFiles]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeNewFile = (index: number) => {
        setMediaFiles(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingMedia = (index: number) => {
        setExistingMedia(prev => prev.filter((_, i) => i !== index));
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            date: assessment.Date ? assessment.Date.split('T')[0] : new Date().toISOString().split("T")[0],
            name: assessment.PatientName || "",
            age: assessment.Age?.toString() || "",
            sex: assessment.Sex || "",
            occupation: assessment.Occupation?.toString() || "",
            phoneNumber: assessment.PhoneNumber?.toString() || "",
            height: assessment.Height?.toString() || "",
            weight: assessment.Weight?.toString() || "",
            bloodPressure: assessment.BloodPressure?.toString() || "",
            diabeticMellitus: assessment.DiabeticMellitus?.toString() || "",
            dietHabit: assessment.DietHabit?.toString() || "",
            sleepingHistory: assessment.SleepingHistory?.toString() || "",
            menstruationHistory: assessment.MenstruationHistory?.toString() || "",
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
            sensation: assessment.Sensation || "",
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

            twentyFourHourHistory: assessment.TwentyFourHourHistory || "",
            improvingStaticWorse: assessment.ImprovingStaticWorse || "Static",
            newOldInjury: assessment.NewOrOldInjury || "New",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            // 1. Sanitize data to prevent literal "undefined" in Sheets
            const sanitizedValues = sanitizeFormData(values);

            // 2. Check for duplicates
            const allData = await getFromGoogleSheet();
            const assessments = Array.isArray(allData) ? allData : [];
            if (checkDuplicate(assessments, sanitizedValues.name, sanitizedValues.date, assessmentIndex)) {
                if (!confirm(`An assessment for ${sanitizedValues.name} already exists on ${sanitizedValues.date}. Do you want to save anyway?`)) {
                    setIsSubmitting(false);
                    return;
                }
            }

            const payload = {
                ...sanitizedValues,
                existingMedia,
                files: mediaFiles.map(mf => ({
                    name: mf.file.name,
                    type: mf.file.type,
                    data: mf.base64.split(',')[1]
                }))
            };

            const response = await fetch(`/api/assessments/${assessmentIndex}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                throw new Error(errorData.error || "Failed to update assessment");
            }

            alert("Assessment updated successfully!");
            router.push(`/assessment/${assessmentIndex}`);
            router.refresh();
        } catch (error) {
            alert(`Error: ${error instanceof Error ? error.message : "Error updating"}`);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <Button asChild variant="ghost" size="sm">
                    <Link href={`/assessment/${assessmentIndex}`}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Cancel
                    </Link>
                </Button>
            </div>

            <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Edit Assessment</h1>
                <p className="text-muted-foreground text-sm">
                    Update all details for patient <strong>{assessment.PatientName || 'Unknown'}</strong> — All fields are visible for editing.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* ═══════ LEFT COLUMN ═══════ */}
                        <div className="space-y-6">

                            {/* Patient Details */}
                            <Card>
                                <CardHeader><CardTitle>Patient Details</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField control={form.control} name="date" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Date</FormLabel>
                                            <FormControl><Input type="date" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="name" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl><Input placeholder="Patient Name" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <div className="grid grid-cols-2 gap-4">
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
                                                <FormControl><Input placeholder="Male/Female/Other" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField control={form.control} name="occupation" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Occupation</FormLabel>
                                                <FormControl><Input placeholder="Occupation" {...field} /></FormControl>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone Number</FormLabel>
                                                <FormControl><Input placeholder="Contact" {...field} /></FormControl>
                                            </FormItem>
                                        )} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField control={form.control} name="height" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Height</FormLabel>
                                                <FormControl><Input placeholder="Height" {...field} /></FormControl>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="weight" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Weight</FormLabel>
                                                <FormControl><Input placeholder="Weight" {...field} /></FormControl>
                                            </FormItem>
                                        )} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField control={form.control} name="bloodPressure" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Blood Pressure</FormLabel>
                                                <FormControl><Input placeholder="e.g., 120/80" {...field} /></FormControl>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="diabeticMellitus" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Diabetic Mellitus</FormLabel>
                                                <FormControl><Input placeholder="Sugar Level" {...field} /></FormControl>
                                            </FormItem>
                                        )} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField control={form.control} name="dietHabit" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Diet Habit</FormLabel>
                                                <FormControl><Input placeholder="Diet" {...field} /></FormControl>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="sleepingHistory" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Sleeping History</FormLabel>
                                                <FormControl><Input placeholder="Sleep pattern" {...field} /></FormControl>
                                            </FormItem>
                                        )} />
                                    </div>
                                    <FormField control={form.control} name="menstruationHistory" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Menstruation History</FormLabel>
                                            <FormControl><Input placeholder="History" {...field} /></FormControl>
                                        </FormItem>
                                    )} />
                                </CardContent>
                            </Card>

                            {/* Clinical History */}
                            <Card>
                                <CardHeader><CardTitle>History</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField control={form.control} name="chiefComplaint" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Chief Complaint</FormLabel>
                                            <FormControl><Textarea placeholder="Current issues..." {...field} /></FormControl>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="presentHistory" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>History of Present Illness</FormLabel>
                                            <FormControl><Textarea placeholder="Onset, progression..." {...field} /></FormControl>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="mechanismOfInjury" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mechanism of Injury</FormLabel>
                                            <FormControl><Textarea {...field} /></FormControl>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="pastHistory" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Past Medical History</FormLabel>
                                            <FormControl><Textarea placeholder="Surgeries, other conditions..." {...field} /></FormControl>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="diagnosticImaging" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Diagnostic Imaging / Reports</FormLabel>
                                            <FormControl><Textarea placeholder="X-ray, MRI, Blood tests..." {...field} /></FormControl>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="redFlags" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Red Flags</FormLabel>
                                            <FormControl><Input placeholder="Any warning signs..." {...field} /></FormControl>
                                        </FormItem>
                                    )} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField control={form.control} name="improvingStaticWorse" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Progress Status</FormLabel>
                                                <FormControl>
                                                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl><RadioGroupItem value="Improving" /></FormControl>
                                                            <FormLabel className="font-normal">Improving</FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl><RadioGroupItem value="Static" /></FormControl>
                                                            <FormLabel className="font-normal">Static</FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl><RadioGroupItem value="Worse" /></FormControl>
                                                            <FormLabel className="font-normal">Worse</FormLabel>
                                                        </FormItem>
                                                    </RadioGroup>
                                                </FormControl>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="newOldInjury" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Injury Type</FormLabel>
                                                <FormControl>
                                                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl><RadioGroupItem value="New" /></FormControl>
                                                            <FormLabel className="font-normal">New</FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl><RadioGroupItem value="Old" /></FormControl>
                                                            <FormLabel className="font-normal">Old</FormLabel>
                                                        </FormItem>
                                                    </RadioGroup>
                                                </FormControl>
                                            </FormItem>
                                        )} />
                                    </div>
                                    <FormField control={form.control} name="twentyFourHourHistory" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>24-Hour Severity/Symptoms</FormLabel>
                                            <FormControl><Input placeholder="Morning/Night patterns..." {...field} /></FormControl>
                                        </FormItem>
                                    )} />
                                </CardContent>
                            </Card>

                            {/* Observation */}
                            <Card>
                                <CardHeader><CardTitle>Observation (Posture)</CardTitle></CardHeader>
                                <CardContent>
                                    <FormField control={form.control} name="observation" render={({ field }) => (
                                        <FormItem>
                                            <FormControl><Textarea className="min-h-[100px]" {...field} /></FormControl>
                                        </FormItem>
                                    )} />
                                </CardContent>
                            </Card>

                            {/* Examination Results */}
                            <Card>
                                <CardHeader><CardTitle>Examination Results</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField control={form.control} name="activeROM" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Active ROM</FormLabel>
                                                <FormControl><Textarea placeholder="L/R Ext/Flex" {...field} /></FormControl>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="passiveROM" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Passive ROM</FormLabel>
                                                <FormControl><Textarea placeholder="L/R Ext/Flex" {...field} /></FormControl>
                                            </FormItem>
                                        )} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField control={form.control} name="musclePower" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Muscle Power (MMT)</FormLabel>
                                                <FormControl><Input placeholder="MMT Grade..." {...field} /></FormControl>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="gait" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Gait</FormLabel>
                                                <FormControl><Input placeholder="Normal, Antalgic..." {...field} /></FormControl>
                                            </FormItem>
                                        )} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField control={form.control} name="sensation" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Sensation</FormLabel>
                                                <FormControl><Input placeholder="Normal, Impaired..." {...field} /></FormControl>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="reflexes" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Reflexes</FormLabel>
                                                <FormControl><Input placeholder="Grades..." {...field} /></FormControl>
                                            </FormItem>
                                        )} />
                                    </div>
                                    <FormField control={form.control} name="palpation" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Palpation</FormLabel>
                                            <FormControl><Textarea placeholder="Tenderness, swelling..." {...field} /></FormControl>
                                        </FormItem>
                                    )} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField control={form.control} name="palpation_Tenderness" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tenderness</FormLabel>
                                                <FormControl><Input {...field} /></FormControl>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="palpation_Effusion" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Effusion</FormLabel>
                                                <FormControl><Input {...field} /></FormControl>
                                            </FormItem>
                                        )} />
                                    </div>
                                    <FormField control={form.control} name="comments" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Additional Comments</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                        </FormItem>
                                    )} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField control={form.control} name="endFeel" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>End Feel</FormLabel>
                                                <FormControl><Input {...field} /></FormControl>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="capsularPattern" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Capsular Pattern</FormLabel>
                                                <FormControl><Input {...field} /></FormControl>
                                            </FormItem>
                                        )} />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* ═══════ RIGHT COLUMN ═══════ */}
                        <div className="space-y-6">

                            {/* Pain & Symptoms */}
                            <Card>
                                <CardHeader><CardTitle>Pain & Symptoms</CardTitle></CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex justify-center border p-4 rounded-md">
                                        <div className="relative w-[300px] h-[400px]">
                                            <Image src="/body-chart.png" alt="Body Chart" fill className="object-contain" />
                                        </div>
                                    </div>
                                    <FormField control={form.control} name="symptomsLocation" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Symptoms Location (Describe)</FormLabel>
                                            <FormControl><Textarea placeholder="Describe where the symptoms are..." {...field} /></FormControl>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="painLocation" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Pain Location</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="painVas" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>VAS: Intensity of Pain (0-10)</FormLabel>
                                            <div className="flex items-center gap-4">
                                                <span className="w-8 text-center font-bold text-lg">{field.value}</span>
                                                <FormControl>
                                                    <Slider min={0} max={10} step={1} value={[field.value]} onValueChange={(vals) => field.onChange(vals[0])} />
                                                </FormControl>
                                            </div>
                                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                                <span>No Pain</span><span>Worst Pain</span>
                                            </div>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="painDescription" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Pain Type</FormLabel>
                                            <FormControl><Input placeholder="Constant, periodic, episodic, occasional" {...field} /></FormControl>
                                        </FormItem>
                                    )} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField control={form.control} name="aggravatingFactors" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Aggravating Factors</FormLabel>
                                                <FormControl><Textarea {...field} /></FormControl>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="easingFactors" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Easing Factors</FormLabel>
                                                <FormControl><Textarea {...field} /></FormControl>
                                            </FormItem>
                                        )} />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Tests */}
                            <Card>
                                <CardHeader><CardTitle>Tests</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField control={form.control} name="resistedIsometrics" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Resisted Isometrics</FormLabel>
                                            <FormControl><Textarea {...field} /></FormControl>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="functionalTesting" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Functional Testing</FormLabel>
                                            <FormControl><Textarea {...field} /></FormControl>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="neurologicalTests" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Neurological Tests</FormLabel>
                                            <FormControl><Textarea placeholder="Coordination, balance..." {...field} /></FormControl>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="sensation" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Sensation</FormLabel>
                                            <FormControl><Textarea placeholder="Sensory testing..." {...field} /></FormControl>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="reflexes" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Reflexes</FormLabel>
                                            <FormControl><Textarea placeholder="Deep tendon reflexes..." {...field} /></FormControl>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="specialTests" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Special Tests</FormLabel>
                                            <FormControl><Textarea {...field} /></FormControl>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="jointPlayMovements" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Joint Play Movements</FormLabel>
                                            <FormControl><Textarea {...field} /></FormControl>
                                        </FormItem>
                                    )} />
                                </CardContent>
                            </Card>

                            {/* Treatment Plan */}
                            <Card>
                                <CardHeader><CardTitle>Treatment Plan</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField control={form.control} name="diagnosis" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Physiotherapy Diagnosis</FormLabel>
                                            <FormControl><Textarea placeholder="Based on assessment..." {...field} /></FormControl>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="manualTherapy" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Manual Therapy</FormLabel>
                                            <FormControl><Textarea placeholder="Techniques used..." {...field} /></FormControl>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="electrotherapy" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Electrotherapy</FormLabel>
                                            <FormControl><Textarea placeholder="Modalities used..." {...field} /></FormControl>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="exercisePrescription" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Exercise Prescription</FormLabel>
                                            <FormControl><Textarea placeholder="Home exercise program..." {...field} /></FormControl>
                                        </FormItem>
                                    )} />
                                </CardContent>
                            </Card>

                            {/* Reviews & Summary */}
                            <Card>
                                <CardHeader><CardTitle>Reviews & Summary</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField control={form.control} name="review1" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Review 1</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="review2" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Review 2</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="review3" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Review 3</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="patientSummary" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Overall Patient Summary</FormLabel>
                                            <FormControl><Textarea {...field} /></FormControl>
                                        </FormItem>
                                    )} />

                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* ═══════ MEDIA UPLOAD SECTION ═══════ */}
                    <Card className="mt-8 overflow-hidden border-2 border-primary/20 bg-secondary/5">
                        <CardHeader className="bg-primary/5 flex flex-row items-center justify-between py-5 border-b">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Camera className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold">Clinical Evidence Capture</CardTitle>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Add or update photos/videos ({totalMediaCount}/4 used)
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button type="button" variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} className="text-xs h-9" disabled={totalMediaCount >= 4}>
                                    <Upload className="h-4 w-4 mr-2" />
                                    Import Files
                                </Button>
                            </div>
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" multiple onChange={handleFileChange} />
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="flex flex-col lg:flex-row min-h-[400px]">
                                {/* Camera Viewport */}
                                <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden min-h-[300px]">
                                    {isInitializing && (
                                        <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center gap-4">
                                            <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                                            <p className="text-white text-xs font-semibold tracking-widest uppercase">Initializing Camera...</p>
                                        </div>
                                    )}
                                    {isStreaming ? (
                                        <>
                                            <video ref={videoRef} autoPlay playsInline muted onCanPlay={(e) => e.currentTarget.play()} className="w-full h-full object-contain" />
                                            <div className="absolute top-4 left-4 flex gap-2">
                                                <div className="flex items-center gap-1.5 bg-black/60 px-2.5 py-1 rounded-md border border-white/20">
                                                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                                    <span className="text-[10px] text-white font-bold tracking-widest uppercase">LIVE</span>
                                                </div>
                                                {isRecording && (
                                                    <div className="flex items-center gap-1.5 bg-red-600 px-2.5 py-1 rounded-md border border-red-400">
                                                        <div className="h-2 w-2 rounded-full bg-white animate-ping" />
                                                        <span className="text-[10px] text-white font-bold tracking-widest uppercase">RECORDING</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="absolute inset-x-0 bottom-6 flex justify-center items-center gap-6 px-4">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Button type="button" size="lg" className="h-16 w-16 rounded-full bg-white hover:bg-gray-200 text-primary border-[4px] border-primary/20 shadow-xl" onClick={takePhoto} disabled={totalMediaCount >= 4}>
                                                        <Camera className="h-6 w-6" />
                                                    </Button>
                                                    <span className="text-[10px] text-white font-bold drop-shadow-md">SNAP PHOTO</span>
                                                </div>
                                                <div className="flex flex-col items-center gap-2">
                                                    {!isRecording ? (
                                                        <Button type="button" size="lg" className="h-16 w-16 rounded-full bg-red-600 hover:bg-red-700 text-white border-[4px] border-red-200 shadow-xl" onClick={startRecording} disabled={totalMediaCount >= 4}>
                                                            <Video className="h-6 w-6" />
                                                        </Button>
                                                    ) : (
                                                        <Button type="button" size="lg" className="h-16 w-16 rounded-full bg-red-600 animate-pulse text-white border-[4px] border-white shadow-xl flex items-center justify-center p-0" onClick={stopRecording}>
                                                            <div className="h-6 w-6 rounded-sm bg-white" />
                                                        </Button>
                                                    )}
                                                    <span className="text-[10px] text-white font-bold drop-shadow-md uppercase">
                                                        {isRecording ? "Stop Video" : "Record Video"}
                                                    </span>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center p-12 max-w-sm">
                                            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                                                <Camera className="h-10 w-10 text-primary/40" />
                                            </div>
                                            <h4 className="text-white font-semibold mb-2">Camera Ready</h4>
                                            <p className="text-white/40 text-sm mb-8">Click below to enable your camera and capture patient media live.</p>
                                            <Button type="button" onClick={startCamera} className="w-full h-12 text-sm font-bold tracking-wide">
                                                ENABLE CAMERA VIEW
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {/* Evidence Sidebar */}
                                <div className="w-full lg:w-[320px] bg-background p-5 border-l">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-5">
                                        Media ({totalMediaCount}/4)
                                    </h3>

                                    {/* Existing Media from Google Drive */}
                                    {existingMedia.length > 0 && (
                                        <div className="mb-4">
                                            <p className="text-xs text-muted-foreground mb-2 font-medium">📁 Existing Attachments</p>
                                            <div className="grid grid-cols-2 gap-3">
                                                {existingMedia.map((url, index) => {
                                                    const isVideo = isVideoUrl(url);
                                                    const displayUrl = convertDriveUrl(url);
                                                    return (
                                                        <div key={`existing-${index}`} className="relative aspect-square rounded-xl overflow-hidden border shadow-sm group bg-black">
                                                            {isVideo ? (
                                                                <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                                                                    <FileVideo className="h-8 w-8 text-primary" />
                                                                    <span className="text-[8px] font-bold text-white bg-blue-600 px-1.5 py-0.5 rounded uppercase">Saved</span>
                                                                </div>
                                                            ) : (
                                                                <img src={displayUrl} className="w-full h-full object-cover" alt={`Existing ${index + 1}`} />
                                                            )}
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                <Button type="button" variant="destructive" size="icon" onClick={() => removeExistingMedia(index)} className="h-8 w-8 rounded-full shadow-lg">
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* New captures */}
                                    {mediaFiles.length > 0 && (
                                        <div className="mb-4">
                                            <p className="text-xs text-muted-foreground mb-2 font-medium">📸 New Captures</p>
                                            <div className="grid grid-cols-2 gap-3">
                                                {mediaFiles.map((mf, index) => (
                                                    <div key={`new-${index}`} className="relative aspect-square rounded-xl overflow-hidden border shadow-sm group bg-black">
                                                        {mf.type === 'image' ? (
                                                            <img src={mf.base64} className="w-full h-full object-cover" alt={`New ${index + 1}`} />
                                                        ) : (
                                                            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                                                                <FileVideo className="h-8 w-8 text-primary" />
                                                                <span className="text-[8px] font-bold text-white bg-red-600 px-1.5 py-0.5 rounded uppercase">Video</span>
                                                            </div>
                                                        )}
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <Button type="button" variant="destructive" size="icon" onClick={() => removeNewFile(index)} className="h-8 w-8 rounded-full shadow-lg">
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {totalMediaCount === 0 && (
                                        <div className="h-[250px] flex flex-col items-center justify-center border-2 border-dashed rounded-xl bg-muted/30">
                                            <Plus className="h-10 w-10 mb-3 text-muted-foreground/30" />
                                            <p className="text-xs text-center px-6 text-muted-foreground">No media yet. Use the camera or import files to attach evidence.</p>
                                        </div>
                                    )}

                                    {totalMediaCount < 4 && totalMediaCount > 0 && (
                                        <div className="mt-3">
                                            <div className="aspect-square rounded-xl border-2 border-dashed flex items-center justify-center bg-muted/20 max-w-[100px]">
                                                <Plus className="h-6 w-6 text-muted-foreground/30" />
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/10">
                                        <p className="text-[10px] leading-relaxed text-muted-foreground font-medium">
                                            <span className="text-primary font-bold">INFO:</span> New media will be uploaded to Google Drive on save. Existing media links are preserved.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

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
