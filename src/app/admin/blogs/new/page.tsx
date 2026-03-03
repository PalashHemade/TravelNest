"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

type BlogFormValues = {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image: string;
  tags: string;
};

export default function NewBlogPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<BlogFormValues>({
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      image: "",
      tags: "",
    },
  });

  const generateSlug = () => {
    const title = form.getValues("title");
    if (title) {
       const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
       form.setValue("slug", slug);
    }
  }

  async function onSubmit(data: BlogFormValues) {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        tags: data.tags ? data.tags.split(",").map(t => t.trim()) : [],
      };

      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Success", {
          description: "Blog created successfully",
        });
        form.reset();
        router.push("/admin/blogs");
        router.refresh();
      } else {
        const error = await res.json();
        toast.error("Error", {
          description: error.error || "Failed to create blog",
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/blogs">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Create New Blog Post</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Blog Details</CardTitle>
          <CardDescription>Fill out the form below to publish a new travel journal entry.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Enter blog title" {...field} required onChange={(e) => {
                            field.onChange(e);
                        }}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center justify-between">
                         <span>Slug <span className="text-red-500">*</span></span>
                         <Button type="button" variant="link" size="sm" className="h-auto p-0 text-muted-foreground" onClick={generateSlug}>
                             Auto-generate
                         </Button>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="unique-url-slug" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

               <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Image URL <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input placeholder="Europe, Travel Tips, Hidden Gems" {...field} />
                      </FormControl>
                      <p className="text-[0.8rem] text-muted-foreground mt-2">Comma separated words</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

               <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Textarea 
                            placeholder="A short summary of the blog post. This appears on the blog listing page." 
                            className="resize-none" 
                            {...field} 
                            required 
                            rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content (HTML format) <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="<p>Write your detailed blog post here. You can use HTML tags.</p>"
                        className="min-h-[300px]"
                        {...field}
                        required
                      />
                    </FormControl>
                     <p className="text-[0.8rem] text-muted-foreground mt-2">Supports raw HTML syntax</p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4 pt-4 border-t">
                <Button variant="outline" type="button" asChild>
                  <Link href="/admin/blogs">Cancel</Link>
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Publishing..." : "Publish Blog Post"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
