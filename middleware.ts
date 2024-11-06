import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        if (req.nextauth.token == undefined || req.nextauth.token == null ) {
            return NextResponse.rewrite(new URL('/auth/login', req.url));
        };
        if (req.nextUrl.pathname == '/auth/login' && req.nextauth.token != undefined) {
            return NextResponse.rewrite(new URL('/main/dashboard', req.url));
        }
    },
    {
        callbacks: {
            authorized({ req, token }) {
                if (req.nextUrl.pathname === "/main/dashboard") {
                    return token?.userRole === "admin"
                }
                return !!token
            },
        },
    }


)
export const config = { 
    matcher: [
        "/"
    ] 
}