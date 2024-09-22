import { Analytics } from '@vercel/analytics/react';
import { Viewport } from 'next';
import { Figtree, Inconsolata } from 'next/font/google';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import '../../tailwind.css';

const sans = Figtree({ subsets: ['latin'], variable: '--font-body' });
const mono = Inconsolata({ subsets: ['latin'], variable: '--font-mono' });

export const metadata = {
  description:
    'Achieve lasting behavior changes with your clients. Streamline data collection, create data-driven protocols and easily monitor progress.',
  title: {
    default: 'llog • collaborative behavior change',
    template: '%s • llog',
  },
};

export const viewport: Viewport = {
  initialScale: 1,
  minimumScale: 1,
  userScalable: false,
  width: 'device-width',
};

interface LayoutProps {
  children: ReactNode;
  modal: ReactNode;
}

const Layout = ({ children, modal }: LayoutProps) => (
  <html className={twMerge(sans.variable, mono.variable)} lang="en">
    <body>
      {children}
      {modal}
      <Analytics />
    </body>
  </html>
);

export default Layout;
