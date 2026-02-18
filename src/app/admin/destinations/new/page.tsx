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

export default function NewDestinationPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({
        name: "", slug: "", country: "", description: "", image: "", featured: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const generateSlug = () => {
        setForm(prev => ({ ...prev, slug: prev.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch("/api/destinations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to create destination");
            toast.success("Destination created!");
            router.push("/admin/destinations");
            router.refresh();
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">New Destination</h1>
            <Card>
                <CardHeader><CardTitle>Destination Details</CardTitle></CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" value={form.name} onChange={handleChange} onBlur={generateSlug} placeholder="e.g. Bali" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input id="slug" name="slug" value={form.slug} onChange={handleChange} placeholder="e.g. bali" required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input id="country" name="country" value={form.country} onChange={handleChange} placeholder="e.g. Indonesia" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" name="description" value={form.description} onChange={handleChange} placeholder="Describe this destination..." rows={4} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="image">Image URL</Label>
                            <Input id="image" name="image" value={form.image} onChange={handleChange} placeholder="https://..." required />
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="featured" name="featured" checked={form.featured} onChange={handleChange} className="h-4 w-4" />
                            <Label htmlFor="featured">Featured destination</Label>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Destination
                            </Button>
                            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
