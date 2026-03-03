"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/blogs");
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      }
    } catch (error) {
      console.error("Failed to fetch blogs", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBlog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Success", {
            description: "Blog post deleted successfully",
        });
        fetchBlogs();
      } else {
        toast.error("Error", {
            description: "Failed to delete blog post",
        });
      }
    } catch (error) {
       toast.error("Error", {
            description: "An expected error occurred.",
        });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Blogs Management</h2>
        <Button asChild>
          <Link href="/admin/blogs/new">
            <Plus className="mr-2 h-4 w-4" /> Add New Blog
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Blog Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">Loading...</div>
          ) : blogs.length === 0 ? (
             <div className="text-center p-8 text-muted-foreground">
                No blog posts found. Create one to get started.
             </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogs.map((blog) => (
                  <TableRow key={blog._id}>
                    <TableCell className="font-medium">{blog.title}</TableCell>
                    <TableCell>{blog.author}</TableCell>
                    <TableCell>{format(new Date(blog.createdAt), "PPP")}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="icon" asChild>
                          <Link href={`/blog/${blog.slug}`} target="_blank">
                             <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => deleteBlog(blog._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
