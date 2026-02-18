"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";

export function CustomRequestForm({ destinations, userEmail }: { destinations: string[]; userEmail: string }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDests, setSelectedDests] = useState<string[]>([]);
    const [form, setForm] = useState({
        days: "7", travelers: "2", budget: "", notes: "",
        contactEmail: userEmail, contactPhone: "",
    });

    const toggleDest = (dest: string) => {
        setSelectedDests(prev =>
            prev.includes(dest) ? prev.filter(d => d !== dest) : [...prev, dest]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedDests.length === 0) { toast.error("Please select at least one destination"); return; }
        setIsLoading(true);
        try {
            const res = await fetch("/api/custom-requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    destinations: selectedDests,
                    days: Number(form.days),
                    travelers: Number(form.travelers),
                    budget: form.budget ? Number(form.budget) : undefined,
                    notes: form.notes,
                    contactEmail: form.contactEmail,
                    contactPhone: form.contactPhone,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to submit request");
            toast.success("Custom request submitted! We'll get back to you soon.");
            router.push("/dashboard");
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader><CardTitle>Trip Preferences</CardTitle></CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <Label>Destinations (select all that interest you)</Label>
                        {destinations.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No destinations available yet. The admin will add them soon.</p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {destinations.map(dest => (
                                    <button key={dest} type="button" onClick={() => toggleDest(dest)}
                                        className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                                            selectedDests.includes(dest)
                                                ? 'bg-primary text-primary-foreground border-primary'
                                                : 'bg-background border-input hover:bg-muted'
                                        }`}>
                                        {dest}
                                    </button>
                                ))}
                            </div>
                        )}
                        {selectedDests.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                                {selectedDests.map(d => (
                                    <Badge key={d} variant="secondary" className="gap-1">
                                        {d}
                                        <X className="h-3 w-3 cursor-pointer" onClick={() => toggleDest(d)} />
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="days">Number of Days</Label>
                            <Input id="days" type="number" value={form.days}
                                onChange={e => setForm(prev => ({ ...prev, days: e.target.value }))}
                                min={1} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="travelers">Travelers</Label>
                            <Input id="travelers" type="number" value={form.travelers}
                                onChange={e => setForm(prev => ({ ...prev, travelers: e.target.value }))}
                                min={1} required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="budget">Approximate Budget (USD, optional)</Label>
                        <Input id="budget" type="number" value={form.budget}
                            onChange={e => setForm(prev => ({ ...prev, budget: e.target.value }))}
                            placeholder="e.g. 5000" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="contactEmail">Contact Email</Label>
                            <Input id="contactEmail" type="email" value={form.contactEmail}
                                onChange={e => setForm(prev => ({ ...prev, contactEmail: e.target.value }))} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contactPhone">Contact Phone</Label>
                            <Input id="contactPhone" type="tel" value={form.contactPhone}
                                onChange={e => setForm(prev => ({ ...prev, contactPhone: e.target.value }))}
                                placeholder="+1 234 567 8900" required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Additional Notes</Label>
                        <Textarea id="notes" value={form.notes}
                            onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
                            placeholder="Tell us about your preferences, special occasions, dietary needs..." rows={4} />
                    </div>

                    <div className="flex gap-3">
                        <Button type="submit" disabled={isLoading} className="flex-1">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Submit Request
                        </Button>
                        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
