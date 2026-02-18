import dbConnect from "@/lib/db";
import mongoose from "mongoose";

// Simple Rate Limit Schema
const RateLimitSchema = new mongoose.Schema({
    ip: { type: String, required: true, index: true },
    action: { type: String, required: true }, // e.g., 'login', 'register'
    count: { type: Number, default: 1 },
    resetAt: { type: Date, required: true, expires: 0 }, // TTL index
});

const RateLimit = mongoose.models.RateLimit || mongoose.model("RateLimit", RateLimitSchema);

export async function rateLimit(ip: string, action: string, limit: number = 5, windowMs: number = 60000) {
    await dbConnect();

    const now = new Date();
    const resetAt = new Date(now.getTime() + windowMs);

    const record = await RateLimit.findOne({ ip, action });

    if (record) {
        if (record.count >= limit) {
            return { success: false, remaining: 0, resetAt: record.resetAt };
        }

        record.count += 1;
        await record.save();
        return { success: true, remaining: limit - record.count, resetAt: record.resetAt };
    } else {
        await RateLimit.create({
            ip,
            action,
            count: 1,
            resetAt,
        });
        return { success: true, remaining: limit - 1, resetAt };
    }
}
