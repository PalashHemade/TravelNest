import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role || 'user';
            }
            return token;
        },
        async session({ session, token }) {
            if (token.id && session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as 'user' | 'admin' | 'guest';
            }
            return session;
        }
    },
    providers: [],
} satisfies NextAuthConfig;
