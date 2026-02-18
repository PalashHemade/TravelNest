"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function DeletePackageButton({ id }: { id: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this package?")) return;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/packages/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");
            toast.success("Package deleted");
            router.refresh();
        } catch {
            toast.error("Failed to delete package");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
        </Button>
    );
}
