import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    // eslint-disable-next-line no-var
    var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Pre-register all Mongoose models so they are always available
 * for .populate() calls regardless of Turbopack HMR module order.
 */
function registerModels() {
    require('@/models/User');
    require('@/models/Package');
    require('@/models/Booking');
    require('@/models/Destination');
}

async function dbConnect() {
    if (cached.conn) {
        registerModels();
        return cached.conn;
    }

    if (!cached.promise) {
        // Atlas-optimised connection options
        const opts: mongoose.ConnectOptions = {
            bufferCommands: false,
            maxPoolSize: 10,           // reuse connections in serverless/Next.js
            serverSelectionTimeoutMS: 10000, // fail fast if Atlas unreachable
            socketTimeoutMS: 45000,    // give Atlas queries up to 45s
        };

        cached.promise = mongoose.connect(MONGODB_URI!, opts).then((m) => {
            console.log('✅ MongoDB Atlas connected');
            return m;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    registerModels();
    return cached.conn;
}

export default dbConnect;
