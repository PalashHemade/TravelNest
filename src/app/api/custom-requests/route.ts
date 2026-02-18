import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import CustomPackageRequest from "@/models/CustomPackageRequest";
import User from "@/models/User";
import { z } from "zod";

const requestSchema = z.object({
    destinations: z.array(z.string()).min(1),
    days: z.number().min(1),
    travelers: z.number().min(1),
    budget: z.number().optional(),
    notes: z.string().optional(),
    contactEmail: z.string().email(),
    contactPhone: z.string().min(5),
});

export async function GET() {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
        return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }
    try {
        await dbConnect();
        const requests = await CustomPackageRequest.find({})
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .lean();
        return NextResponse.json(requests.map((r: any) => ({ ...r, _id: r._id.toString() })));
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    try {
        const body = await req.json();
        const result = requestSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ message: "Invalid input", errors: result.error.flatten().fieldErrors }, { status: 400 });
        }
        await dbConnect();
        const user = await User.findOne({ email: session.user.email }).select("_id");
        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

        const request = await CustomPackageRequest.create({ user: user._id, ...result.data });
        return NextResponse.json({ message: "Request submitted", id: request._id.toString() }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
