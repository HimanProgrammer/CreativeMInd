import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('admin_token');
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith('/admin');
  const clean = pathname.replace(/\/$/, '') || '/';
  const isAuthPage = clean === '/admin/login' || clean === '/admin/register';

  if (isAdminRoute && !isAuthPage && !token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
