import { MetadataRoute } from 'next';
import dbConnect from '@/lib/db';
import Package from '@/models/Package';
import Blog from '@/models/Blog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    await dbConnect();

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Get dynamic routes
    const packages = await Package.find({}).select('slug updatedAt').lean();
    const blogs = await Blog.find({}).select('slug updatedAt').lean();

    const packageUrls = packages.map((pkg: any) => ({
        url: `${baseUrl}/packages/${pkg.slug}`,
        lastModified: pkg.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    const blogUrls = blogs.map((blog: any) => ({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastModified: blog.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/packages`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        ...packageUrls,
        ...blogUrls,
    ];
}
