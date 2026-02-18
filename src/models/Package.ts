import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IPackage extends Document {
    title: string;
    slug: string;
    description: string;
    price: number;
    duration: number; // in days
    image: string;
    images: string[];
    destination: string;
    country: string;
    rating: number;
    reviewsCount: number;
    amenities: string[];
    maxPeople: number;
    featured: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const PackageSchema = new Schema<IPackage>(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, index: true },
        description: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        duration: { type: Number, required: true, min: 1 },
        image: { type: String, required: true },
        images: [{ type: String }],
        destination: { type: String, required: true },
        country: { type: String, required: true },
        rating: { type: Number, default: 0, min: 0, max: 5 },
        reviewsCount: { type: Number, default: 0 },
        amenities: [{ type: String }],
        maxPeople: { type: Number, required: true },
        featured: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

// Prevent recompilation of model
const Package: Model<IPackage> = mongoose.models.Package || mongoose.model<IPackage>('Package', PackageSchema);

export default Package;
