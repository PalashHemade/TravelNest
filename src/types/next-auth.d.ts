import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            id: string
            role: 'user' | 'admin' | 'guest'
        } & DefaultSession["user"]
    }

    interface User {
        role?: 'user' | 'admin' | 'guest'
        email?: string | null
        name?: string | null
        image?: string | null
        id?: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id?: string
        role?: 'user' | 'admin' | 'guest'
    }
}
