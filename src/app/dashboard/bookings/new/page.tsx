import { auth } from "@/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Package from "@/models/Package";
import { NewBookingForm } from "@/components/dashboard/NewBookingForm";

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: Promise<{ packageId?: string }>;
}

export default async function NewBookingPage({ searchParams }: PageProps) {
    const session = await auth();
    if (!session?.user?.email) redirect("/login");

    const { packageId } = await searchParams;

    await dbConnect();
    const packages = await Package.find({}).select('title price duration destination maxPeople').sort({ title: 1 }).lean();

    const serialized = packages.map((p: any) => ({
        _id: p._id.toString(),
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

