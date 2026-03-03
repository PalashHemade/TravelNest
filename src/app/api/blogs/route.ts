import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";

export async function GET() {
    try {
        await dbConnect();
        const blogs = await Blog.find({}).sort({ createdAt: -1 });
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
        await dbConnect();

        const blog = await Blog.create({
            ...body,
            author: session.user.name || "Admin",
        });

        return NextResponse.json(blog, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
    }
}
