import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req: NextRequest & { auth: any }) => {
    const isLoggedIn = !!req.auth;
    const { nextUrl } = req;
    const isApiAuthRoute = nextUrl.pathname.startsWith('/api/auth');
    const isPublicRoute = (
        ['/', '/login', '/register', '/contact', '/destinations'].includes(nextUrl.pathname) ||
        nextUrl.pathname.startsWith('/blog') ||
        nextUrl.pathname.startsWith('/packages') ||
        nextUrl.pathname.startsWith('/api') // Allow public access to APIs effectively, or restrict specifically. Let's start with broader access then restrict.
    );

    const isAuthRoute = ['/login', '/register'].includes(nextUrl.pathname);
    const isAdminRoute = nextUrl.pathname.startsWith('/admin');

    if (isApiAuthRoute) return NextResponse.next();

    if (isAuthRoute) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL('/dashboard', nextUrl));
        }
        return NextResponse.next();
    }

    if (!isLoggedIn && !isPublicRoute) {
        return NextResponse.redirect(new URL('/login', nextUrl));
    }

    if (isAdminRoute) {
        if (req.auth?.user?.role !== 'admin') {
            return NextResponse.redirect(new URL('/', nextUrl));
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
