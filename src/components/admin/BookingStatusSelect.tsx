"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const STATUS_OPTIONS = ['pending', 'confirmed', 'completed', 'cancelled'];

export function BookingStatusSelect({ id, currentStatus }: { id: string; currentStatus: string }) {
    const [status, setStatus] = useState(currentStatus);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        setStatus(newStatus);
        setIsLoading(true);
        try {
            const res = await fetch(`/api/bookings/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!res.ok) throw new Error("Failed to update");
            toast.success("Booking status updated");
            router.refresh();
        } catch {
            toast.error("Failed to update status");
            setStatus(currentStatus);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <select
            value={status}
            onChange={handleChange}
            disabled={isLoading}
            className="text-xs rounded border border-input bg-background px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ring"
        >
            {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
        </select>
    );
}
