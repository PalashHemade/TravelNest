import mongoose, { Schema, Model, Document } from 'mongoose';

export interface ICustomPackageRequest extends Document {
    user: mongoose.Types.ObjectId;
    destinations: string[];
    days: number;
    travelers: number;
    budget?: number;
    notes?: string;
    status: 'pending' | 'reviewed' | 'quoted' | 'closed';
    adminNote?: string;
    contactEmail: string;
    contactPhone: string;
    createdAt: Date;
    updatedAt: Date;
}

const CustomPackageRequestSchema = new Schema<ICustomPackageRequest>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        destinations: [{ type: String, required: true }],
        days: { type: Number, required: true, min: 1 },
        travelers: { type: Number, required: true, min: 1 },
        budget: { type: Number },
        notes: { type: String },
        status: {
            type: String,
            enum: ['pending', 'reviewed', 'quoted', 'closed'],
            default: 'pending',
        },
        adminNote: { type: String },
        contactEmail: { type: String, required: true },
        contactPhone: { type: String, required: true },
    },
    { timestamps: true }
);

const CustomPackageRequest: Model<ICustomPackageRequest> =
    mongoose.models.CustomPackageRequest ||
    mongoose.model<ICustomPackageRequest>('CustomPackageRequest', CustomPackageRequestSchema);

export default CustomPackageRequest;
