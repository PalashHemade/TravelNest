import NextAuth, { type User as AuthUser } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { getUserByEmail, createUser } from "@/lib/db/userService";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                role: { label: "Role", type: "text" },
            },
            authorize: async (credentials) => {
                const parsedCredentials = z
                    .object({
                        email: z.string().email(),
                        password: z.string().min(1),
                        role: z.enum(["user", "admin"]).optional(),
                    })
                    .safeParse(credentials);

                if (!parsedCredentials.success) return null;

                const { email, password, role: selectedRole } = parsedCredentials.data;

                const user: any = await getUserByEmail(email);

                if (!user) return null;
                if (!user.password) return null; // OAuth user — no password set

                const passwordsMatch = await bcrypt.compare(password, user.password);
                if (!passwordsMatch) return null;

                // If a role was selected, validate it matches the DB role
                if (selectedRole && user.role !== selectedRole) {
                    // Return a sentinel that the signIn callback can detect
                    return { id: 'role-mismatch', roleMismatch: true } as any;
                }

                return user;
            },
        }),
    ],
    callbacks: {
        ...authConfig.callbacks,
        async jwt({ token, user, account }) {
            // Only fetch from DB on initial sign-in (when `user` object is present)
            if (user) {
                if ((user as any).roleMismatch) {
                    token.roleMismatch = true;
                    return token;
                }
                const dbUser: any = await getUserByEmail((user as any).email);
                if (dbUser) {
                    token.id = dbUser.userId;
                    token.role = dbUser.role;
                    token.email = dbUser.email;
                    token.name = dbUser.name;
                }
            }
            return token;
        },
        async signIn({ user, account, profile }) {
            // Reject role-mismatch sentinel
            if ((user as any).roleMismatch) {
                return '/login?error=RoleMismatch';
            }
            if (account?.provider === 'google') {
                const existingUser = await getUserByEmail((user as any).email);
                if (!existingUser) {
                    await createUser({
                        name: user.name || '',
                        email: (user as any).email || '',
                        image: user.image || '',
                        provider: 'google',
                        role: 'user',
                    });
                }
            }
            return true;
        }
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.AUTH_SECRET,
});
