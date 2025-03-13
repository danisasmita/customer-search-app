// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  
  // Define public paths that don't require authentication
  const isPublicPath = path === '/login' || path === '/register';
  
  // Check if the user is authenticated by looking for the authToken in cookies
  const authToken = request.cookies.get('authToken')?.value;
  
  // If the path requires authentication and the user isn't authenticated, redirect to login
  if (!isPublicPath && !authToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // If the user is authenticated and trying to access login/register, redirect to search
  if (isPublicPath && authToken) {
    return NextResponse.redirect(new URL('/search', request.url));
  }

  // Continue with the request if all checks pass
  return NextResponse.next();
}

// Configure the middleware to only run on specific paths
export const config = {
  matcher: ['/search', '/login', '/register'],
};