import { createServerClient } from '@supabase/ssr';
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
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            req.cookies.set(name, value),
          );

          res = NextResponse.next({ request: req });

          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options),
          );
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
    const forcePrivateStartsWith = [
      '/account',
      '/community',
      '/hey',
      '/inbox',
      '/inputs',
      '/subjects',
      '/teams',
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
