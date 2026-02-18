"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface PackageOption {
    _id: string;
    title: string;
    price: number;
    duration: number;
    destination: string;
    maxPeople: number;
}

export function NewBookingForm({ packages, userEmail }: { packages: PackageOption[]; userEmail: string }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPkg, setSelectedPkg] = useState<PackageOption | null>(null);
    const [form, setForm] = useState({
        packageId: "", startDate: "", travelers: "1",
        contactEmail: userEmail, contactPhone: "", specialRequests: "",
    });

    const handlePackageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const pkg = packages.find(p => p._id === e.target.value) || null;
        setSelectedPkg(pkg);
        setForm(prev => ({ ...prev, packageId: e.target.value }));
    };

    const totalPrice = selectedPkg ? selectedPkg.price * Number(form.travelers) : 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.packageId) { toast.error("Please select a package"); return; }
        setIsLoading(true);
        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, travelers: Number(form.travelers), totalPrice }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to create booking");
            toast.success("Booking submitted! We'll confirm shortly.");
            router.push("/dashboard/bookings");
            router.refresh();
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader><CardTitle>Booking Details</CardTitle></CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Select Package</Label>
                        <select
                            value={form.packageId}
                            onChange={handlePackageChange}
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <option value="">-- Choose a package --</option>
                            {packages.map(pkg => (
                                <option key={pkg._id} value={pkg._id}>
                                    {pkg.title} — {pkg.destination} ({pkg.duration} days) — ${pkg.price}/person
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedPkg && (
                        <div className="rounded-md bg-muted p-3 text-sm">
                            <p><span className="font-medium">Destination:</span> {selectedPkg.destination}</p>
                            <p><span className="font-medium">Duration:</span> {selectedPkg.duration} days</p>
                            <p><span className="font-medium">Max People:</span> {selectedPkg.maxPeople}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input id="startDate" name="startDate" type="date" value={form.startDate}
                                onChange={e => setForm(prev => ({ ...prev, startDate: e.target.value }))}
                                min={new Date().toISOString().split('T')[0]} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="travelers">Travelers</Label>
                            <Input id="travelers" name="travelers" type="number" value={form.travelers}
                                onChange={e => setForm(prev => ({ ...prev, travelers: e.target.value }))}
                                min={1} max={selectedPkg?.maxPeople || 99} required />
                        </div>
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
                        <Label htmlFor="specialRequests">Special Requests (optional)</Label>
                        <Textarea id="specialRequests" value={form.specialRequests}
                            onChange={e => setForm(prev => ({ ...prev, specialRequests: e.target.value }))}
                            placeholder="Any dietary requirements, accessibility needs, etc." rows={3} />
                    </div>

                    {totalPrice > 0 && (
                        <div className="rounded-md border p-4 bg-primary/5">
                            <div className="flex justify-between font-semibold text-lg">
                                <span>Total Price</span>
                                <span>${totalPrice.toLocaleString()}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">${selectedPkg?.price.toLocaleString()} × {form.travelers} traveler(s)</p>
                        </div>
                    )}

                    <div className="flex gap-3">
                        <Button type="submit" disabled={isLoading} className="flex-1">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Submit Booking
                        </Button>
                        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
