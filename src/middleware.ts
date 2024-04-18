import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Auth Middleware
export async function middleware(request: NextRequest) {
  const token: string | undefined = request.cookies.get('fasteng.token')?.value;

  if (request.nextUrl.pathname === '/creators') {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname !== '/' && !token) {
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: '/((?!api|_next|static|public|favicon.ico|/).*)',
};
