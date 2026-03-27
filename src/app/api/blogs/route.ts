import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAllBlogs, createBlog } from "@/lib/db/blogService";

export async function GET() {
    try {
        const blogs = await getAllBlogs();
        // Sort by createdAt desc
        blogs.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return NextResponse.json(blogs);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const blog = await createBlog({
            ...body,
            author: session.user.name || "Admin",
        });

        return NextResponse.json(blog, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
    }
}
