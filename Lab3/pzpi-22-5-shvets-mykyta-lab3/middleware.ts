// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_PATHS = [
    "/auth/login",
    "/auth/register",
    "/_next",
    "/favicon.ico",
    "/404",
    "/api/auth/login",
    "/api/auth/register",
];

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
        return NextResponse.next();
    }

    const token = req.cookies.get("token")?.value;
    if (!token) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    let payload: any;
    try {
        ({ payload } = await jwtVerify(token, secret));
    } catch {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    const role = (payload as any).role as string;

    if (pathname.startsWith("/admin")) {
        if (!["Admin","SuperAdmin","Security"].includes(role)) {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }
    if (pathname.startsWith("/user")) {
        if (["Admin","SuperAdmin","Security","Guest"].includes(role)) {
            if (["Admin","SuperAdmin"].includes(role))
                return NextResponse.redirect(new URL("/admin/dashboard", req.url));
            if (role === "Security")
                return NextResponse.redirect(new URL("/admin/security", req.url));
            if (role === "Guest")
                return NextResponse.redirect(new URL("/guest/home", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/user/:path*", "/guest/:path*"],
};
