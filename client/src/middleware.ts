import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const username = request.cookies.get('username');
  const pathname = request.nextUrl.pathname;

  if (username && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!username && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}
