"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Save, X, Loader2 } from "lucide-react";

const formSchema = z.object({
    date: z.string(),
    name: z.string().min(2, "Name is required"),
    age: z.string(),
    phoneNumber: z.string().optional(),
    occupation: z.string().optional(),
    chiefComplaint: z.string().optional(),
    presentHistory: z.string().optional(),
    pastHistory: z.string().optional(),
    aggravatingFactors: z.string().optional(),
    twentyFourHourHistory: z.string().optional(),
    improvingStaticWorse: z.enum(["Improving", "Static", "Worse"]).optional(),
    newOldInjury: z.enum(["New", "Old"]).optional(),
    diagnosticImaging: z.string().optional(),
    observation: z.string().optional(),
    activeMovements: z.string().optional(),
    passiveMovements: z.string().optional(),
    comments: z.string().optional(),
    endFeel: z.string().optional(),
    capsularPattern: z.string().optional(),
    painVas: z.number().min(0).max(10),
    painDescription: z.string().optional(),
    symptomsLocation: z.string().optional(),
    resistedIsometricMovements: z.string().optional(),
    functionalTesting: z.string().optional(),
    neurologicalTests: z.string().optional(),
    specialTests: z.string().optional(),
    jointPlayMovements: z.string().optional(),
    palpation: z.string().optional(),
    whatTreatment: z.string().optional(),
    treatmentPlan: z.string().optional(),
});

export function AssessmentForm() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            date: new Date().toISOString().split("T")[0],
            name: "",
            age: "",
            painVas: 0,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log('Form submission started');
        console.log('Form values:', values);
        setIsSubmitting(true);
        try {
            console.log('Sending POST request to /api/assessments');
            const response = await fetch("/api/assessments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
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

            // Redirect to dashboard with success
            router.push('/?success=Assessment saved successfully!');
        } catch (error) {
            console.error('Form submission error:', error);
            const errorMessage = error instanceof Error ? error.message : "Error saving assessment";
            alert(`Error: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
            console.log('Form submission completed');
        }
    }

    function handleCancel() {
        if (form.formState.isDirty) {
            const confirmCancel = window.confirm('You have unsaved changes. Are you sure you want to cancel?');
            if (confirmCancel) {
                router.push('/');
            }
        } else {
            router.push('/');
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
                                <FormField
                                    control={form.control}
                                    name="phoneNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Contact Number" {...field} />
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
                                            <FormLabel>C/C (Chief Complaint)</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Chief complaint..." {...field} />
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
                                            <FormLabel>Present History Records</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Present history..." {...field} />
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
                                            <FormLabel>Past History Records</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Past history..." {...field} />
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
                                    name="twentyFourHourHistory"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>24-Hour History</FormLabel>
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
                                                <FormLabel>Status</FormLabel>
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
                                                            <FormLabel className="font-normal">
                                                                Improving
                                                            </FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="Static" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                Static
                                                            </FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="Worse" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                Worse
                                                            </FormLabel>
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
                                                            <FormLabel className="font-normal">
                                                                New
                                                            </FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="Old" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                Old
                                                            </FormLabel>
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
                                <CardTitle>Examination</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="activeMovements"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Active Movements</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="L/R" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="passiveMovements"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Passive Movements</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="L/R" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="comments"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Comments</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
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
                                    name="resistedIsometricMovements"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Resisted Isometric Movements</FormLabel>
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
                                <CardTitle>Treatment</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="whatTreatment"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>What Treatment (Given)</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Treatment given during this session..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="treatmentPlan"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Treatment Plan</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Planned future treatments..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
                {/* Action Buttons - Sticky Footer */}
                <div className="sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t pt-4 pb-2 -mx-4 px-4 mt-8">
                    <div className="flex flex-col sm:flex-row justify-between gap-3">
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                                className="gap-2"
                            >
                                <X className="h-4 w-4" />
                                Cancel
                            </Button>
                        </div>
                        <Button
                            type="submit"
                            size="lg"
                            disabled={isSubmitting}
                            className="gap-2 min-w-[160px]"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    Save Assessment
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    );
}
