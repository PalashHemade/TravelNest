import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAllPackages } from "@/lib/db/packageService";
import { NewBookingForm } from "@/components/dashboard/NewBookingForm";

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: Promise<{ packageId?: string }>;
}

export default async function NewBookingPage({ searchParams }: PageProps) {
    const session = await auth();
    if (!session?.user?.email) redirect("/login");

    const { packageId } = await searchParams;

    const allPackages = await getAllPackages();
    const packages = allPackages.sort((a: any, b: any) => (a.title || '').localeCompare(b.title || ''));

    const serialized = packages.map((p: any) => ({
        _id: p.packageId,
        title: p.title,
        price: p.price,
        duration: p.duration,
        destination: p.destination,
        maxPeople: p.maxPeople,
    }));

    return (
        <div className="max-w-2xl space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">New Booking</h1>
            <NewBookingForm packages={serialized} userEmail={session.user.email!} initialPackageId={packageId} />
        </div>
    );
}

