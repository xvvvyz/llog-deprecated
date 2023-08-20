import signEmail from '@/(authentication)/_utilities/sign-email';
import { cookies } from 'next/headers';

const setCrispSignatureCookie = (email: string) => {
  const value = signEmail(email);
  if (!value) return;
  cookies().set({ httpOnly: true, name: 'crisp_signature', path: '/', value });
};

export default setCrispSignatureCookie;
