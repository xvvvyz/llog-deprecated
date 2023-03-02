import AnalyticsWrapper from '(components)/analytics-wrapper';
import { Figtree } from 'next/font/google';
import { ReactNode } from 'react';
import '../tailwind.css';

const figtree = Figtree({ subsets: ['latin'], variable: '--font-body' });

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <html className={figtree.variable} lang="en">
    <body>
      {children}
      <AnalyticsWrapper />
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
