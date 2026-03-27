import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createPackage, getPackageBySlug } from "@/lib/db/packageService";
import { z } from "zod";

const packageSchema = z.object({
    title: z.string().min(2),
    slug: z.string().min(2),
    description: z.string().min(10),
    price: z.number().min(0),
    duration: z.number().min(1),
    image: z.string().url(),
    images: z.array(z.string()).optional(),
    destination: z.string().min(2),
    country: z.string().min(2),
    amenities: z.array(z.string()).optional(),
    maxPeople: z.number().min(1),
    featured: z.boolean().optional(),
});

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
        return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }
    try {
        const body = await req.json();
        const result = packageSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ message: "Invalid input", errors: result.error.flatten().fieldErrors }, { status: 400 });
        }
        const existing = await getPackageBySlug(result.data.slug);
        if (existing) {
            return NextResponse.json({ message: "Slug already exists" }, { status: 409 });
        }
        const pkg = await createPackage(result.data);
        return NextResponse.json({ message: "Package created", id: pkg._id.toString() }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
