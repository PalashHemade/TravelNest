"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DURATION_PRESETS = [3, 5, 7, 9];

export default function NewPackagePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({
        title: "", slug: "", description: "", price: "", duration: "7",
        image: "", destination: "", country: "", amenities: "", maxPeople: "10", featured: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const generateSlug = () => {
        setForm(prev => ({ ...prev, slug: prev.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const payload = {
                ...form,
                price: Number(form.price),
                duration: Number(form.duration),
                maxPeople: Number(form.maxPeople),
                amenities: form.amenities.split(',').map(a => a.trim()).filter(Boolean),
                images: [],
            };
            const res = await fetch("/api/packages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to create package");
            toast.success("Package created! Users can now see it.");
            router.push("/admin/packages");
            router.refresh();
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">New Package</h1>
            <Card>
                <CardHeader><CardTitle>Package Details</CardTitle></CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" name="title" value={form.title} onChange={handleChange} onBlur={generateSlug} placeholder="e.g. Bali Paradise" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input id="slug" name="slug" value={form.slug} onChange={handleChange} placeholder="e.g. bali-paradise" required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" name="description" value={form.description} onChange={handleChange} rows={4} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="destination">Destination</Label>
                                <Input id="destination" name="destination" value={form.destination} onChange={handleChange} placeholder="e.g. Bali" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="country">Country</Label>
                                <Input id="country" name="country" value={form.country} onChange={handleChange} placeholder="e.g. Indonesia" required />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Price (USD)</Label>
                                <Input id="price" name="price" type="number" value={form.price} onChange={handleChange} placeholder="1999" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="duration">Duration (days)</Label>
                                <div className="flex gap-2 flex-wrap">
                                    {DURATION_PRESETS.map(d => (
                                        <Button key={d} type="button" size="sm"
                                            variant={form.duration === String(d) ? "default" : "outline"}
                                            onClick={() => setForm(prev => ({ ...prev, duration: String(d) }))}>
                                            {d}d
                                        </Button>
                                    ))}
                                    <Input name="duration" type="number" value={form.duration} onChange={handleChange} className="w-20" min={1} />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="image">Cover Image URL</Label>
                            <Input id="image" name="image" value={form.image} onChange={handleChange} placeholder="https://..." required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="maxPeople">Max People</Label>
                                <Input id="maxPeople" name="maxPeople" type="number" value={form.maxPeople} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                                <Input id="amenities" name="amenities" value={form.amenities} onChange={handleChange} placeholder="Wi-Fi, Breakfast, Guide" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="featured" name="featured" checked={form.featured as boolean} onChange={handleChange} className="h-4 w-4" />
                            <Label htmlFor="featured">Featured package</Label>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Package
                            </Button>
                            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
