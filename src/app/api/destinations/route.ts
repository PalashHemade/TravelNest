import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAllDestinations, createDestination } from "@/lib/db/destinationService";
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
        const destinations = await getAllDestinations();
        // Manual sorting if needed (since DynamoDB scan doesn't sort by featured)
        destinations.sort((a: any, b: any) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return (a.name || '').localeCompare(b.name || '');
        });
        return NextResponse.json(destinations);
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
        // Slugs aren't fully checked efficiently in dynamo without GSI, skipping perfect uniqueness check or do it during create

        const destination = await createDestination(result.data);
        return NextResponse.json({ message: "Destination created", id: destination.destinationId }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
