import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple middleware that doesn't require Clerk
export function middleware(request: NextRequest) {
  // Log the request for debugging
  console.log('Request path:', request.nextUrl.pathname);

  // Allow all requests through
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    // Skip all static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 