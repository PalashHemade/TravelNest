import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAllCustomRequests, createCustomRequest } from "@/lib/db/customRequestService";
import { getUserByEmail, getAllUsers } from "@/lib/db/userService";
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
        const requests = await getAllCustomRequests();
        const users = await getAllUsers();
        const userMap = users.reduce((acc: any, u: any) => ({ ...acc, [u.userId]: u }), {});
        const mapped = requests.map((r: any) => ({
            ...r,
            user: userMap[r.userId] || { name: 'Unknown', email: 'N/A' },
            _id: r.requestId,
        }));
        // Sort by createdAt desc
        mapped.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return NextResponse.json(mapped);
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
        const user = await getUserByEmail(session.user.email);
        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

        const request = await createCustomRequest({ userId: (user as any).userId, ...result.data });
        return NextResponse.json({ message: "Request submitted", id: request.requestId }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
