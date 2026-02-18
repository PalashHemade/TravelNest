import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    image?: string;
    role: 'user' | 'admin' | 'guest';
    provider: 'credentials' | 'google';
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name'],
            maxlength: [60, 'Name cannot be more than 60 characters'],
        },
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email',
            ],
        },
        password: {
            type: String,
            select: false, // Don't return password by default
        },
        image: {
            type: String,
        },
        role: {
            type: String,
            enum: ['user', 'admin', 'guest'],
            default: 'user',
        },
        provider: {
            type: String,
            enum: ['credentials', 'google'],
            default: 'credentials',
        },
    },
    {
        timestamps: true,
    }
);

// Prevent recompilation of model
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
