import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

type Role = "registered" | "student" | "teacher" | "admin" | "blocked";

const publicRoutes = ["/", "/course", "/about", "/faq", "/login", "/register"];
const registeredRoutes = ["/invite", "/profile"];
const adminRoutes = ["/admin"];
const adminOnlyRoutes = ["/admin/users", "/admin/invites"];
const protectedStaticPrefixes = ["/reading-legacy"];

function matchesRoute(pathname: string, routes: string[]) {
    return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isProtectedStatic = protectedStaticPrefixes.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    );
    const isStaticFile = Boolean(pathname.match(/\.[^/]+$/));

    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname === "/favicon.ico" ||
        (isStaticFile && !isProtectedStatic)
    ) {
        return NextResponse.next();
    }

    if (matchesRoute(pathname, publicRoutes)) {
        return NextResponse.next();
    }

    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const role = (token?.role as Role | undefined) ?? undefined;

    if (!token) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (role === "blocked") {
        return NextResponse.redirect(new URL("/login?error=blocked", request.url));
    }

    if (matchesRoute(pathname, registeredRoutes)) {
        if (pathname.startsWith("/invite") && role !== "registered") {
            return NextResponse.redirect(new URL("/", request.url));
        }
        return NextResponse.next();
    }

    if (matchesRoute(pathname, adminRoutes)) {
        if (matchesRoute(pathname, adminOnlyRoutes) && role !== "admin") {
            return NextResponse.redirect(new URL("/", request.url));
        }

        if (!["teacher", "admin"].includes(role ?? "")) {
            return NextResponse.redirect(new URL("/", request.url));
        }

        return NextResponse.next();
    }

    if (role === "registered") {
        return NextResponse.redirect(new URL("/invite", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
