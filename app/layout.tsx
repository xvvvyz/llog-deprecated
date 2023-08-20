import SupabaseProvider from '@/(account)/_components/supabase-provider';
import getCurrentUser from '@/(account)/_server/get-current-user';
import CrispProvider from '@/_components/crisp-provider';
import { Analytics } from '@vercel/analytics/react';
import { Figtree, Inconsolata } from 'next/font/google';
import { cookies } from 'next/headers';
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

const Layout = async ({ children }: LayoutProps) => (
  <html className={twMerge(figtree.variable, inconsolata.variable)} lang="en">
    <body>
      <SupabaseProvider>
        <CrispProvider
          crispSignature={cookies().get('crisp_signature')?.value}
          user={await getCurrentUser()}
        >
          {children}
        </CrispProvider>
      </SupabaseProvider>
      <Analytics />
    </body>
  </html>
);

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
