import { Analytics } from '@vercel/analytics/react';
import { Viewport } from 'next';
import { Figtree, Inconsolata } from 'next/font/google';
import Script from 'next/script';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import '../../tailwind.css';

const sans = Figtree({ subsets: ['latin'], variable: '--font-body' });
const mono = Inconsolata({ subsets: ['latin'], variable: '--font-mono' });

export const metadata = {
  description:
    'Achieve lasting behavior changes with your clients. Streamline data collection, create data-driven protocols and easily monitor progress.',
  robots:
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
      ? undefined
      : {
          follow: false,
          index: false,
        },
  title: {
    default: 'llog • collaborative behavior change',
    template: '%s • llog',
  },
};

export const viewport: Viewport = {
  initialScale: 1,
  minimumScale: 1,
  themeColor: '#1F1F1F',
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
      <Script id="lemon-squeezy-affiliate-config">{`window.lemonSqueezyAffiliateConfig={store:'llog'};`}</Script>
      <Script src="https://lmsqueezy.com/affiliate.js" defer />
    </body>
  </html>
);

export default Layout;
