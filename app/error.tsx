'use client';

import useSupabase from '@/_hooks/use-supabase';
import { BugAntIcon } from '@heroicons/react/24/outline';
import va from '@vercel/analytics';
import { useEffect } from 'react';

interface ErrorProps {
  error: Error;
}

const Error = ({ error }: ErrorProps) => {
  const supabase = useSupabase();

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();

      va.track('error', {
        message: error.message,
        user: data?.user?.id ?? null,
      });
    })();
  }, [error, supabase]);

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col items-center justify-center gap-9 py-12 text-center">
      <BugAntIcon className="w-12" />
      <p>
        Something went wrong. Try refreshing this page.
        <br />
        <span className="text-fg-3">
          Email <a href="mailto:help@llog.app">help@llog.app</a> if the problem
          persists.
        </span>
      </p>
    </div>
  );
};

export default Error;
