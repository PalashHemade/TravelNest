import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { updateBooking, getBookingById } from "@/lib/db/bookingService";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
        return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }
    try {
        const { id } = await params;
        const body = await req.json();
        const booking = await getBookingById(id);
        if (!booking) return NextResponse.json({ message: "Booking not found" }, { status: 404 });
        await updateBooking(id, (booking as any).userId, body);
        return NextResponse.json({ message: "Booking updated" });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
