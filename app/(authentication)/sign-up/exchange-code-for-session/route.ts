import setCrispSignatureCookie from '@/(authentication)/_utilities/set-crisp-signature-cookie';
import createServerRouteClient from '@/_server/create-server-route-client';
import { NextResponse } from 'next/server';

export const GET = async (req: Request) => {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const email = url.searchParams.get('email') ?? '';
  const redirect = url.searchParams.get('redirect') ?? '';
  if (code) await createServerRouteClient().auth.exchangeCodeForSession(code);
  if (email) setCrispSignatureCookie(email);
  return NextResponse.redirect(`${url.origin}${redirect}`);
};
