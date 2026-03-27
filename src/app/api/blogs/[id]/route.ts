import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { deleteBlog, getBlogById } from "@/lib/db/blogService";

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

        const existingBlog = await getBlogById(id);
        if (!existingBlog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        await deleteBlog(id);

        return NextResponse.json({ message: "Blog deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
    }
}
