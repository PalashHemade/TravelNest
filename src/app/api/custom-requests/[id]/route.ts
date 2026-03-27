import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { updateCustomRequest } from "@/lib/db/customRequestService";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
        return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }
    try {
        const { id } = await params;
        const body = await req.json();
        await updateCustomRequest(id, body);
        return NextResponse.json({ message: "Request updated" });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
