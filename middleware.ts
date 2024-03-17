import { CookieOptions, createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|_vercel/|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

export const middleware = async (req: NextRequest) => {
  let res = NextResponse.next({ request: { headers: req.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        remove(name: string, options: CookieOptions) {
          req.cookies.set({ name, value: '', ...options });
          res = NextResponse.next({ request: { headers: req.headers } });
          res.cookies.set({ name, value: '', ...options });
        },
        set(name: string, value: string, options: CookieOptions) {
          req.cookies.set({ name, value, ...options });
          res = NextResponse.next({ request: { headers: req.headers } });
          res.cookies.set({ name, value, ...options });
        },
      },
    },
  );

  const user = await supabase.auth.getUser();

  if (user.data.user) {
    const forcePublic = ['/', '/forgot-password', '/sign-in', '/sign-up'];

    if (forcePublic.includes(req.nextUrl.pathname)) {
      return NextResponse.redirect(new URL('/subjects', req.url));
    }
  } else {
    if (req.nextUrl.pathname === '/') {
      // temporary landing page redirect
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    const forcePrivateStartsWith = [
      '/account',
      '/inputs',
      '/notifications',
      '/subjects',
      '/templates',
    ];

    if (
      forcePrivateStartsWith.some((p) => req.nextUrl.pathname.startsWith(p))
    ) {
      const inOrUp = req.nextUrl.pathname.includes('/join/') ? 'up' : 'in';
      const redirect = `${req.nextUrl.pathname}${req.nextUrl.search}`;

      return NextResponse.redirect(
        new URL(`/sign-${inOrUp}?next=${redirect}`, req.url),
      );
    }
  }

  return res;
};
