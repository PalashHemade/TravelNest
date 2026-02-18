'use server'

import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function updateProfile(formData: FormData) {
    const session = await auth();
    if (!session?.user?.email) {
        return { message: "Not authenticated", success: false };
    }

    // Only admins can update profile settings
    if (session.user.role !== 'admin') {
        return { message: "Unauthorized: only admins can change settings", success: false };
    }

    const name = formData.get("name") as string;
    const password = formData.get("password") as string;

    try {
        await dbConnect();

        const updateData: any = { name };

        if (password && password.length >= 6) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        await User.updateOne({ email: session.user.email }, updateData);

        revalidatePath("/dashboard/settings");
        return { message: "Profile updated successfully", success: true };
    } catch (error) {
        console.error("Failed to update profile:", error);
        return { message: "Failed to update profile", success: false };
    }
}
