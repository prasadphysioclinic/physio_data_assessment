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
import { useRef, useEffect } from "react";

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
    const [isStreaming, setIsStreaming] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('environment');
    const [isInitializing, setIsInitializing] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Visibility Fix: Attach stream to video element only after mounting
    useEffect(() => {
        if (isStreaming && videoRef.current && streamRef.current) {
            const v = videoRef.current;
            if (v.srcObject !== streamRef.current) {
                v.srcObject = streamRef.current;
                v.play().catch(e => console.error("Playback error:", e));
            }
        }
    }, [isStreaming, cameraFacing]); // Re-run if streaming starts or camera toggles

    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    const startCamera = async () => {
        setIsInitializing(true);
        try {
            if (streamRef.current) {
                stopCamera();
            }

            let stream: MediaStream;
            try {
                // Try video and audio first
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: cameraFacing },
                    audio: true
                });
            } catch (aErr) {
                console.warn("Audio access failed, falling back to video only:", aErr);
                // Fallback to video only
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: cameraFacing },
                    audio: false
                });
            }

            streamRef.current = stream;
            setIsStreaming(true);
        } catch (err) {
            console.error("Camera access failed completely:", err);
            alert("Could not access camera. Please check camera permissions in your browser.");
        } finally {
            setIsInitializing(false);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setIsStreaming(false);
    };

    const toggleCamera = () => {
        setCameraFacing(prev => prev === 'user' ? 'environment' : 'user');
        if (isStreaming) {
            startCamera();
        }
    };

    const takePhoto = () => {
        if (!videoRef.current || mediaFiles.length >= 4) return;

        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(video, 0, 0);
            const base64 = canvas.toDataURL('image/jpeg');

            // Create a fake file object for compatibility
            const blob = dataURLToBlob(base64);
            const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });

            setMediaFiles([...mediaFiles, { file, base64, type: 'image' }]);
        }
    };

    const startRecording = () => {
        if (!streamRef.current || mediaFiles.length >= 4) return;

        const chunks: BlobPart[] = [];
        const recorder = new MediaRecorder(streamRef.current);

        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.push(e.data);
        };

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

    const dataURLToBlob = (dataurl: string) => {
        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)![1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    };

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

                {/* Live Media Capture Section */}
                <Card className="mt-8 overflow-hidden border-2 border-primary/20 bg-secondary/5">
                    <CardHeader className="bg-primary/5 flex flex-row items-center justify-between py-5 border-b">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Camera className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-bold">Clinical Evidence Capture</CardTitle>
                                <p className="text-xs text-muted-foreground mt-0.5">Capture up to 4 photos or videos of the patient</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                                className="text-xs h-9"
                            >
                                <Upload className="h-4 w-4 mr-2" />
                                Import Files
                            </Button>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*,video/*"
                            multiple
                            onChange={handleFileChange}
                        />
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
                                        <video
                                            ref={videoRef}
                                            autoPlay
                                            playsInline
                                            muted
                                            onCanPlay={(e) => e.currentTarget.play()}
                                            className="w-full h-full object-contain"
                                        />

                                        {/* HUD Overlay */}
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

                                        <div className="absolute top-4 right-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 bg-black/40 border-white/20 text-white hover:bg-black/60"
                                                onClick={toggleCamera}
                                            >
                                                <Plus className="h-4 w-4 rotate-45" />
                                            </Button>
                                        </div>

                                        {/* Main Action Bar */}
                                        <div className="absolute inset-x-0 bottom-6 flex justify-center items-center gap-6 px-4">
                                            <div className="flex flex-col items-center gap-2">
                                                <Button
                                                    type="button"
                                                    size="lg"
                                                    className="h-16 w-16 rounded-full bg-white hover:bg-gray-200 text-primary border-[4px] border-primary/20 shadow-xl"
                                                    onClick={takePhoto}
                                                    disabled={mediaFiles.length >= 4}
                                                >
                                                    <Camera className="h-6 w-6" />
                                                </Button>
                                                <span className="text-[10px] text-white font-bold drop-shadow-md">SNAP PHOTO</span>
                                            </div>

                                            <div className="flex flex-col items-center gap-2">
                                                {!isRecording ? (
                                                    <Button
                                                        type="button"
                                                        size="lg"
                                                        className="h-16 w-16 rounded-full bg-red-600 hover:bg-red-700 text-white border-[4px] border-red-200 shadow-xl"
                                                        onClick={startRecording}
                                                        disabled={mediaFiles.length >= 4}
                                                    >
                                                        <Video className="h-6 w-6" />
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        type="button"
                                                        size="lg"
                                                        className="h-16 w-16 rounded-full bg-red-600 animate-pulse text-white border-[4px] border-white shadow-xl flex items-center justify-center p-0"
                                                        onClick={stopRecording}
                                                    >
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
                                        <Button
                                            type="button"
                                            onClick={startCamera}
                                            className="w-full h-12 text-sm font-bold tracking-wide"
                                        >
                                            ENABLE CAMERA VIEW
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Evidence Sidebar */}
                            <div className="w-full lg:w-[320px] bg-background p-5 border-l">
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                        Captured ({mediaFiles.length}/4)
                                    </h3>
                                    {isStreaming && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={stopCamera}
                                            className="text-[10px] h-7 px-2"
                                        >
                                            Turn Off
                                        </Button>
                                    )}
                                </div>

                                {mediaFiles.length === 0 ? (
                                    <div className="h-[250px] flex flex-col items-center justify-center border-2 border-dashed rounded-xl bg-muted/30">
                                        <Plus className="h-10 w-10 mb-3 text-muted-foreground/30" />
                                        <p className="text-xs text-center px-6 text-muted-foreground">Captured photos or videos will appear here.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        {mediaFiles.map((mf, index) => (
                                            <div key={index} className="relative aspect-square rounded-xl overflow-hidden border shadow-sm group bg-black">
                                                {mf.type === 'image' ? (
                                                    <img src={mf.base64} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                                                        <FileVideo className="h-8 w-8 text-primary" />
                                                        <span className="text-[8px] font-bold text-white bg-red-600 px-1.5 py-0.5 rounded uppercase">Video</span>
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        onClick={() => removeFile(index)}
                                                        className="h-8 w-8 rounded-full shadow-lg"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                        {mediaFiles.length < 4 && (
                                            <div className="aspect-square rounded-xl border-2 border-dashed flex items-center justify-center bg-muted/20">
                                                <Plus className="h-6 w-6 text-muted-foreground/30" />
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/10">
                                    <p className="text-[10px] leading-relaxed text-muted-foreground font-medium">
                                        <span className="text-primary font-bold">INFO:</span> All media is automatically saved to your practice's Secure Google Drive folder upon form submission.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end pt-10">
                    <Button type="submit" size="lg" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save Assessment"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
