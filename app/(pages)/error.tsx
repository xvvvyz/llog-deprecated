'use client';

import Button from '@/_components/button';
import BugAntIcon from '@heroicons/react/24/outline/BugAntIcon';

const Error = () => (
  <div className="mx-auto flex min-h-full max-w-md flex-col items-center justify-center gap-9 py-12 text-center">
    <BugAntIcon className="w-12" />
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
  </div>
);

export default Error;
