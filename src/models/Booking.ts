import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IBooking extends Document {
    user: mongoose.Types.ObjectId;
    package: mongoose.Types.ObjectId;
    startDate: Date;
    travelers: number;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    paymentStatus: 'unpaid' | 'under_review' | 'paid' | 'rejected';
    paymentId?: string; // Razorpay ID or Manual Proof Reference
    specialRequests?: string;
    contactEmail: string;
    contactPhone: string;
    invoiceId?: string;
    createdAt: Date;
    updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        package: { type: Schema.Types.ObjectId, ref: 'Package', required: true },
        startDate: { type: Date, required: true },
        travelers: { type: Number, required: true, min: 1 },
        totalPrice: { type: Number, required: true, min: 0 },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled', 'completed'],
            default: 'pending',
        },
        paymentStatus: {
            type: String,
            enum: ['unpaid', 'under_review', 'paid', 'rejected'],
            default: 'unpaid',
        },
        paymentId: { type: String },
        specialRequests: { type: String },
        contactEmail: { type: String, required: true },
        contactPhone: { type: String, required: true },
        invoiceId: { type: String },
    },
    {
        timestamps: true,
    }
);

// Prevent recompilation of model
const Booking: Model<IBooking> = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;
