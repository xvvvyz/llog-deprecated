import { Figtree } from '@next/font/google';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import 'tailwind.css';

const figtree = Figtree({ subsets: ['latin'] });

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <html
    className={twMerge('h-full text-[4vw] xs:text-[16px]', figtree.className)}
    lang="en"
  >
    <body className="h-full bg-bg-1 text-fg-1">{children}</body>
  </html>
);

export const metadata = {
  description: '',
  title: {
    default: 'llog — collaborative behavior modification',
    template: '%s - llog',
  },
  viewport:
    'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0',
};

export default Layout;
