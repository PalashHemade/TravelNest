import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await auth();
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const blog = await Blog.findByIdAndDelete(id);

        if (!blog) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Blog deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
    }
}
