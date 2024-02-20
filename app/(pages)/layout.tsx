import { Analytics } from '@vercel/analytics/react';
import { Viewport } from 'next';
import { Figtree, Inconsolata } from 'next/font/google';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import '../../tailwind.css';

const figtree = Figtree({ subsets: ['latin'], variable: '--font-body' });

const inconsolata = Inconsolata({
  subsets: ['latin'],
  variable: '--font-mono',
});

interface LayoutProps {
  children: ReactNode;
}

export const metadata = {
  description:
    'Delight your clients with the ultimate collaborative behavior tracking platform.',
  title: {
    default: 'llog — behavior tracking platform',
    template: '%s - llog',
  },
};

export const viewport: Viewport = {
  initialScale: 1,
  minimumScale: 1,
  userScalable: false,
  width: 'device-width',
};

const Layout = ({ children }: LayoutProps) => (
  <html className={twMerge(figtree.variable, inconsolata.variable)} lang="en">
    <body>
      {children}
      <Analytics />
    </body>
  </html>
);

export default Layout;
