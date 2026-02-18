'use server'

import { z } from "zod";
import dbConnect from "@/lib/db";
import Booking from "@/models/Booking";
import Package from "@/models/Package";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const bookingSchema = z.object({
    packageId: z.string(),
    startDate: z.string().refine((date) => new Date(date) > new Date(), {
        message: "Start date must be in the future",
    }),
    travelers: z.coerce.number().min(1, "At least 1 traveler required"),
    contactEmail: z.string().email(),
    contactPhone: z.string().min(10, "Phone number required"),
    specialRequests: z.string().optional(),
});

export async function createBooking(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session || !session.user) {
        return { error: "You must be logged in to book a trip." };
    }

    const validatedFields = bookingSchema.safeParse({
        packageId: formData.get("packageId"),
        startDate: formData.get("startDate"),
        travelers: formData.get("travelers"),
        contactEmail: formData.get("contactEmail"),
        contactPhone: formData.get("contactPhone"),
        specialRequests: formData.get("specialRequests"),
    });

    if (!validatedFields.success) {
        return { error: "Invalid form data. Please check your inputs." };
    }

    const { packageId, startDate, travelers, contactEmail, contactPhone, specialRequests } = validatedFields.data;

    await dbConnect();

    const pkg = await Package.findById(packageId);
    if (!pkg) {
        return { error: "Package not found." };
    }

    if (travelers > pkg.maxPeople) {
        return { error: `Max travelers allowed for this package is ${pkg.maxPeople}` };
    }

    const totalPrice = pkg.price * travelers;

    try {
        const newBooking = await Booking.create({
            user: session.user.id,
            package: packageId,
            startDate: new Date(startDate),
            travelers,
            totalPrice,
            contactEmail,
            contactPhone,
            specialRequests,
            status: 'pending',
            paymentStatus: 'unpaid',
        });

        return { success: true, bookingId: newBooking._id.toString() };
    } catch (error) {
        console.error("Booking creation error:", error);
        return { error: "Failed to create booking. Please try again." };
    }
}
