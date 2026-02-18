import { auth } from "@/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Destination from "@/models/Destination";
import { CustomRequestForm } from "@/components/dashboard/CustomRequestForm";

export const dynamic = 'force-dynamic';

export default async function CustomRequestPage() {
    const session = await auth();
    if (!session?.user?.email) redirect("/login");

    await dbConnect();
    const destinations = await Destination.find({}).select('name country').sort({ name: 1 }).lean();
    const destNames = destinations.map((d: any) => `${d.name}, ${d.country}`);

    return (
        <div className="max-w-2xl space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Request Custom Package</h1>
            <p className="text-muted-foreground">
                Tell us your dream trip and we'll craft a personalized package just for you.
            </p>
            <CustomRequestForm destinations={destNames} userEmail={session.user.email!} />
        </div>
    );
}
