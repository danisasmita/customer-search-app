import { NextResponse } from 'next/server';

export function middleware(request) {
  const path = request.nextUrl.pathname;
  
  const isPublicPath = path === '/login' || path === '/register';
  
  const authToken = request.cookies.get('authToken')?.value;
  
  if (!isPublicPath && !authToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  if (isPublicPath && authToken) {
    return NextResponse.redirect(new URL('/search', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/search', '/login', '/register'],
};