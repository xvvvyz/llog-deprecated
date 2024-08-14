'use client';

import Button from '@/_components/button';
import ExclamationTriangleIcon from '@heroicons/react/24/outline/ExclamationTriangleIcon';

interface GlobalErrorProps {
  error: Error;
}

const GlobalError = ({ error }: GlobalErrorProps) => (
  <html className="font-[ui-sans-serif,system-ui,sans-serif]" lang="en">
    <body className="mx-auto flex min-h-full max-w-md flex-col items-center justify-center gap-9 py-12 text-center">
      <ExclamationTriangleIcon className="w-12" />
      <p>
        Something went wrong. Try refreshing this page.
        <br />
        <span className="text-fg-4">
          Email{' '}
          <Button href="mailto:help@llog.app" variant="link">
            help@llog.app
          </Button>{' '}
          if the problem persists.
        </span>
      </p>
      <p className="mx-auto max-w-xs whitespace-pre-wrap text-xs text-alpha-4">
        {error.message}
      </p>
    </body>
  </html>
);

export default GlobalError;
