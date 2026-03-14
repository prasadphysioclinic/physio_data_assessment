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
    date: z.string(),
    name: z.string().min(2, "Name is required"),
    age: z.string(),
    occupation: z.string().optional(),
    mechanismOfInjury: z.string().optional(),
    aggravatingFactors: z.string().optional(),
    twentyFourHourHistory: z.string().optional(),
    improvingStaticWorse: z.enum(["Improving", "Static", "Worse"]).optional(),
    newOldInjury: z.enum(["New", "Old"]).optional(),
    pastHistory: z.string().optional(),
    diagnosticImaging: z.string().optional(),
    observation: z.string().optional(),
    painVas: z.number().min(0).max(10),
    painDescription: z.string().optional(),
    painLocation: z.string().optional(),
    resistedIsometricMovements: z.string().optional(),
    functionalTesting: z.string().optional(),
    sensoryScan: z.string().optional(),
    reflexes: z.string().optional(),
    neuroSpecialTests: z.string().optional(),
    specialTests: z.string().optional(),
    jointPlayMovements: z.string().optional(),
    palpation_Tenderness: z.string().optional(),
    palpation_Effusion: z.string().optional(),
    comments: z.string().optional(),
    endFeel: z.string().optional(),
    capsularPattern: z.string().optional(),
    dailyNotes: z.string().optional(),
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
            date: assessment.Date || new Date().toISOString().split("T")[0],
            name: assessment.PatientName || "",
            age: assessment.Age?.toString() || "",
            occupation: assessment.Occupation || "",
            mechanismOfInjury: assessment.MechanismOfInjury || "",
            aggravatingFactors: assessment.AggravatingEasingFactors || "",
            twentyFourHourHistory: assessment.TwentyFourHourHistory || "",
            improvingStaticWorse: assessment.ImprovingStaticWorse || undefined,
            newOldInjury: assessment.NewOrOldInjury || undefined,
            pastHistory: assessment.PastHistory || "",
            diagnosticImaging: assessment.DiagnosticImaging || "",
            observation: assessment.ObservationPosture || "",
            painVas: parseInt(assessment.PainIntensity_VAS) || 0,
            painDescription: assessment.PainPattern || "",
            painLocation: assessment.PainLocation || "",
            resistedIsometricMovements: assessment.ResistedIsometrics || "",
            functionalTesting: assessment.FunctionalTesting || "",
            sensoryScan: assessment.SensoryScan || "",
            reflexes: assessment.Reflexes || "",
            neuroSpecialTests: assessment.NeuroSpecialTests || "",
            specialTests: assessment.SpecialTests || "",
            jointPlayMovements: assessment.JointPlayMovements || "",
            palpation_Tenderness: assessment.Palpation_Tenderness || "",
            palpation_Effusion: assessment.Palpation_Effusion || "",
            comments: assessment.Comments || "",
            endFeel: assessment.EndFeel || "",
            capsularPattern: assessment.CapsularPattern || "",
            dailyNotes: assessment.DailyNotes || "",
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

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                console.error('Server error:', errorData);
                throw new Error(errorData.error || "Failed to update assessment");
            }

            const result = await response.json();
            console.log('Success response:', result);

            alert("Assessment updated successfully!");
            router.push(`/assessment/${assessmentIndex}`);
            router.refresh();
        } catch (error) {
            console.error('Form submission error:', error);
            const errorMessage = error instanceof Error ? error.message : "Error updating assessment";
            alert(`Error: ${errorMessage}`);
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
                    Update the assessment details for {assessment.PatientName}
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Patient Details */}
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
                            </CardContent>
                        </Card>

                        {/* History */}
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
                                    name="aggravatingFactors"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Aggravating/Easing Factors</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} />
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
                            </CardContent>
                        </Card>

                        {/* Pain Assessment */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Pain Assessment</CardTitle>
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
                                            <FormLabel>VAS: Intensity of Pain (0-10)</FormLabel>
                                            <div className="flex items-center gap-4">
                                                <span className="w-8 text-center font-semibold">{field.value}</span>
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
                                            <FormLabel>Pain Pattern</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Constant, periodic, episodic, occasional" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Additional Fields */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Additional Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="comments"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Comments</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} />
                                            </FormControl>
                                            <FormMessage />
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
                                                    placeholder="Update daily progress notes..." 
                                                    className="min-h-[100px] bg-primary/5 border-primary/20"
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

                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" asChild>
                            <Link href={`/assessment/${assessmentIndex}`}>
                                Cancel
                            </Link>
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
