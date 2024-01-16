import { Database } from '@/_types/database';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/((?!_next/static|favicon.ico).*)'],
};

export const middleware = async (req: NextRequest) => {
  const res = NextResponse.next();

  const session = await createMiddlewareClient<Database>({
    req,
    res,
  }).auth.getSession();

  if (
    ['/', '/forgot-password', '/sign-in', '/sign-up'].includes(
      req.nextUrl.pathname,
    ) &&
    session.data.session
  ) {
    return NextResponse.redirect(new URL('/subjects', req.url));
  }

  if (
    ['/account', '/inputs', '/notifications', '/subjects', '/templates'].some(
      (p) => req.nextUrl.pathname.startsWith(p),
    ) &&
    !session.data.session
  ) {
    const inOrUp = req.nextUrl.pathname.includes('/join/') ? 'up' : 'in';

    const redirect = encodeURIComponent(
      `${req.nextUrl.pathname}${req.nextUrl.search}`,
    );

    return NextResponse.redirect(
      new URL(`/sign-${inOrUp}?redirect=${redirect}`, req.url),
    );
  }

  return res;
};
