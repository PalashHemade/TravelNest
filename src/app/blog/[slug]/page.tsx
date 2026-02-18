import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function BlogDetailsPage({ params }: PageProps) {
  await dbConnect();
  // const blog = await Blog.findOne({ slug: params.slug }).lean();
  
  // Mock data matching the listing
  const blog = {
      title: 'Top 10 Hidden Gems in Europe',
      slug: 'top-10-hidden-gems-europe',
      content: `
        <p>Europe is full of famous cities like Paris, Rome, and London, but there's so much more to discover off the beaten path...</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        <h3>1. Matera, Italy</h3>
        <p>Known for its ancient cave dwellings, Matera is a breathtaking city carved into the rock.</p>
        <h3>2. Kotor, Montenegro</h3>
        <p>A coastal town with stunning views of the bay and medieval architecture.</p>
      `,
      image: 'https://images.unsplash.com/photo-1499856871940-a09627c6d7db?q=80&w=2070&auto=format&fit=crop',
      date: 'Oct 12, 2023',
      author: 'Sarah Jenkins',
      tags: ['Europe', 'Travel Tips', 'Hidden Gems']
  };

  if (!blog) {
    return <div>Blog post not found</div>
  }

  return (
    <div className="container py-12 md:py-20 max-w-4xl mx-auto">
      <Link href="/blog">
        <Button variant="ghost" className="mb-6 pl-0 hover:pl-0 hover:bg-transparent hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
        </Button>
      </Link>

      <div className="space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">{blog.title}</h1>
        
        <div className="flex flex-wrap text-sm text-muted-foreground gap-6 border-b pb-8">
           <span className="flex items-center gap-2">
             <User className="h-4 w-4" /> {blog.author}
           </span>
           <span className="flex items-center gap-2">
             <Calendar className="h-4 w-4" /> {blog.date}
           </span>
            <div className="flex gap-2">
              {blog.tags.map((tag: string) => (
                <span key={tag} className="flex items-center gap-1 bg-secondary px-2 py-0.5 rounded-full text-xs font-medium text-secondary-foreground">
                  <Tag className="h-3 w-3" /> {tag}
                </span>
              ))}
            </div>
        </div>

        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg">
           <img src={blog.image} alt={blog.title} className="object-cover w-full h-full" />
        </div>

        <article className="prose prose-lg dark:prose-invert max-w-none pt-8">
           <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </article>
      </div>
    </div>
  )
}
