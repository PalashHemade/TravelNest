"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function DeleteDestinationButton({ id }: { id: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this destination?")) return;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/destinations/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");
            toast.success("Destination deleted");
            router.refresh();
        } catch {
            toast.error("Failed to delete destination");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isLoading} className="flex-1">
            {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
        </Button>
    );
}
