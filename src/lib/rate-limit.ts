const rateLimits = new Map<string, { count: number; resetAt: Date }>();

export async function rateLimit(ip: string, action: string, limit: number = 5, windowMs: number = 60000) {
    const key = `${ip}:${action}`;
    const now = new Date();

    // Cleanup expired tokens occasionally to save memory
    if (Math.random() < 0.1) {
        for (const [k, v] of rateLimits.entries()) {
            if (v.resetAt < now) rateLimits.delete(k);
        }
    }

    let record = rateLimits.get(key);

    // Reset if expired
    if (record && record.resetAt < now) {
        rateLimits.delete(key);
        record = undefined;
    }

    if (record) {
        if (record.count >= limit) {
            return { success: false, remaining: 0, resetAt: record.resetAt };
        }
        record.count += 1;
        return { success: true, remaining: limit - record.count, resetAt: record.resetAt };
    } else {
        const resetAt = new Date(now.getTime() + windowMs);
        rateLimits.set(key, { count: 1, resetAt });
        return { success: true, remaining: limit - 1, resetAt };
    }
}
