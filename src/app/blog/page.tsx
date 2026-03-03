import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, User } from "lucide-react";
import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";

export default async function BlogPage() {
  await dbConnect();
  const blogs = await Blog.find({}).sort({ createdAt: -1 }).lean();

  return (
    <div className="container py-12 md:py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Travel Journal</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Inspiring stories, travel tips, and guides from our team of explorers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog: any) => (
          <Link href={`/blog/${blog.slug}`} key={blog._id} className="group">
            <Card className="h-full border-0 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={blog.image} 
                  alt={blog.title} 
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center text-xs text-muted-foreground mb-3 gap-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {new Date(blog.createdAt).toLocaleDateString()}
                  </span>
                   <span className="flex items-center gap-1">
                    <User className="h-3 w-3" /> {blog.author}
                  </span>
                </div>
                <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {blog.title}
                </h2>
                <p className="text-muted-foreground text-sm line-clamp-3">
                  {blog.excerpt}
                </p>
                <div className="mt-4 text-sm font-medium text-primary flex items-center">
                  Read More &rarr;
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
