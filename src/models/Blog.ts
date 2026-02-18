import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IBlog extends Document {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    image: string;
    author: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, index: true },
        content: { type: String, required: true },
        excerpt: { type: String, required: true },
        image: { type: String, required: true },
        author: { type: String, required: true },
        tags: [{ type: String }],
    },
    {
        timestamps: true,
    }
);

// Prevent recompilation of model
const Blog: Model<IBlog> = mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);

export default Blog;
