"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const STATUS_OPTIONS = ['pending', 'reviewed', 'quoted', 'closed'];

export function CustomRequestActions({ id, currentStatus, currentNote }: { id: string; currentStatus: string; currentNote: string }) {
    const [status, setStatus] = useState(currentStatus);
    const [note, setNote] = useState(currentNote);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/custom-requests/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status, adminNote: note }),
            });
            if (!res.ok) throw new Error("Failed to update");
            toast.success("Request updated");
            router.refresh();
        } catch {
            toast.error("Failed to update request");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t">
            <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="text-sm rounded border border-input bg-background px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ring"
            >
                {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
            </select>
            <Input
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Add a note for the user..."
                className="flex-1 text-sm h-8"
            />
            <Button size="sm" onClick={handleSave} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                Save
            </Button>
        </div>
    );
}
