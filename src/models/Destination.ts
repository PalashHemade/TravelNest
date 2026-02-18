import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IDestination extends Document {
    name: string;
    slug: string;
    country: string;
    description: string;
    image: string;
    featured: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const DestinationSchema = new Schema<IDestination>(
    {
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, index: true },
        country: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        image: { type: String, required: true },
        featured: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Destination: Model<IDestination> =
    mongoose.models.Destination || mongoose.model<IDestination>('Destination', DestinationSchema);

export default Destination;
