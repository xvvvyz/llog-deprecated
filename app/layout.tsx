import SupabaseProvider from '@/(account)/_components/supabase-provider';
import getCurrentUser from '@/(account)/_server/get-current-user';
import Crisp from '@/_components/crisp';
import createHmac from '@/_utilities/create-hmac';
import { Analytics } from '@vercel/analytics/react';
import { Figtree, Inconsolata } from 'next/font/google';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import '../tailwind.css';

const figtree = Figtree({ subsets: ['latin'], variable: '--font-body' });

const inconsolata = Inconsolata({
  subsets: ['latin'],
  variable: '--font-mono',
});

interface LayoutProps {
  children: ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
  const user = await getCurrentUser();

  const crispSignature =
    process.env.CRISP_SECRET_KEY && user?.email
      ? await createHmac(process.env.CRISP_SECRET_KEY, user.email)
      : null;

  return (
    <html className={twMerge(figtree.variable, inconsolata.variable)} lang="en">
      <body>
        <SupabaseProvider>{children}</SupabaseProvider>
        <Analytics />
        <Crisp crispSignature={crispSignature} user={user} />
      </body>
    </html>
  );
};

export const metadata = {
  description: '',
  title: {
    default: 'llog — behavior consulting platform',
    template: '%s - llog',
  },
  viewport:
    'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0',
};

export default Layout;
