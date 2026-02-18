import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import Destination from "@/models/Destination";
import { z } from "zod";

const destinationSchema = z.object({
    name: z.string().min(2),
    slug: z.string().min(2),
    country: z.string().min(2),
    description: z.string().min(10),
    image: z.string().url(),
    featured: z.boolean().optional(),
});

export async function GET() {
    try {
        await dbConnect();
        const destinations = await Destination.find({}).sort({ featured: -1, name: 1 }).lean();
        return NextResponse.json(destinations.map((d: any) => ({ ...d, _id: d._id.toString() })));
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch destinations" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
        return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }
    try {
        const body = await req.json();
        const result = destinationSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ message: "Invalid input", errors: result.error.flatten().fieldErrors }, { status: 400 });
        }
        await dbConnect();
        const existing = await Destination.findOne({ slug: result.data.slug });
        if (existing) {
            return NextResponse.json({ message: "Slug already exists" }, { status: 409 });
        }
        const destination = await Destination.create(result.data);
        return NextResponse.json({ message: "Destination created", id: destination._id.toString() }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
