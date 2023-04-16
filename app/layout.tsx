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

const Layout = ({ children }: LayoutProps) => (
  <html className={twMerge(figtree.variable, inconsolata.variable)} lang="en">
    <body>
      {children}
    </body>
  </html>
);

export const metadata = {
  description: '',
  title: {
    default: 'llog — collaborative, data-driven behavior modification',
    template: '%s - llog',
  },
  viewport:
    'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0',
};

export default Layout;
