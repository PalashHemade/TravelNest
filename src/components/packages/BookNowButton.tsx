"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CalendarCheck } from "lucide-react";

interface BookNowButtonProps {
    packageId: string;
    slug: string;
}

export function BookNowButton({ packageId, slug }: BookNowButtonProps) {
    const { data: session, status } = useSession();
    const router = useRouter();

    const handleClick = () => {
        if (status === "loading") return;
        if (!session) {
            router.push(`/login?callbackUrl=/packages/${slug}`);
        } else {
            router.push(`/dashboard/bookings/new?packageId=${packageId}`);
        }
    };

    return (
        <Button
            size="lg"
            className="w-full text-lg font-semibold h-12"
            onClick={handleClick}
            disabled={status === "loading"}
        >
            <CalendarCheck className="mr-2 h-5 w-5" />
            {session ? "Book Now" : "Sign in to Book"}
        </Button>
    );
}
