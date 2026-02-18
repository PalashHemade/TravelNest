import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, User } from "lucide-react";
import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";

// Mock data for initial view if DB is empty
const mockBlogs = [
  {
      _id: '1',
      title: 'Top 10 Hidden Gems in Europe',
      slug: 'top-10-hidden-gems-europe',
      excerpt: 'Discover the most beautiful and less crowded places in Europe for your next vacation.',
      image: 'https://images.unsplash.com/photo-1499856871940-a09627c6d7db?q=80&w=2070&auto=format&fit=crop',
      date: 'Oct 12, 2023',
      author: 'Sarah Jenkins',
      readTime: '5 min read'
  },
   {
      _id: '2',
      title: 'Essential Packing Guide for Southeast Asia',
      slug: 'packing-guide-southeast-asia',
      excerpt: 'Don\'t forget these essentials when packing for your trip to Thailand, Vietnam, and Bali.',
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop',
      date: 'Sep 28, 2023',
      author: 'Mike Chen',
      readTime: '7 min read'
  },
   {
      _id: '3',
      title: 'Sustainable Travel: How to Be an Eco-Tourist',
      slug: 'sustainable-travel-guide',
      excerpt: 'Learn how to reduce your carbon footprint while exploring the world.',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb7d5b73?q=80&w=2070&auto=format&fit=crop',
      date: 'Aug 15, 2023',
      author: 'Emma Wilson',
      readTime: '4 min read'
  }
];

export default async function BlogPage() {
  await dbConnect();
  // const blogs = await Blog.find({}).sort({ createdAt: -1 }).lean();
  const blogs = mockBlogs; // Using mock until seeded or admin panel created

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
                    <Calendar className="h-3 w-3" /> {blog.date}
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
