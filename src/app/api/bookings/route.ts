import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import Booking from "@/models/Booking";
import User from "@/models/User";
import { z } from "zod";

const bookingSchema = z.object({
    packageId: z.string().min(1),
    startDate: z.string().min(1),
    travelers: z.number().min(1),
    totalPrice: z.number().min(0),
    contactEmail: z.string().email(),
    contactPhone: z.string().min(5),
    specialRequests: z.string().optional(),
});

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    try {
        const body = await req.json();
        const result = bookingSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ message: "Invalid input", errors: result.error.flatten().fieldErrors }, { status: 400 });
        }
        await dbConnect();
        const user = await User.findOne({ email: session.user.email }).select("_id");
        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

        const booking = await Booking.create({
            user: user._id,
            package: result.data.packageId,
            startDate: new Date(result.data.startDate),
            travelers: result.data.travelers,
            totalPrice: result.data.totalPrice,
            contactEmail: result.data.contactEmail,
            contactPhone: result.data.contactPhone,
            specialRequests: result.data.specialRequests,
            status: 'pending',
            paymentStatus: 'unpaid',
        });
        return NextResponse.json({ message: "Booking created", id: booking._id.toString() }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
