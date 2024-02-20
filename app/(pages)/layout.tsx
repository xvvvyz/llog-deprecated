import { Analytics } from '@vercel/analytics/react';
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

const Layout = ({ children }: LayoutProps) => (
  <html className={twMerge(figtree.variable, inconsolata.variable)} lang="en">
    <body>
      {children}
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
};

export default Layout;
