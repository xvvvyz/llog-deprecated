import Button from '@/_components/button';
import getCurrentUser from '@/_queries/get-current-user';
import getSubject from '@/_queries/get-subject';
import ExclamationCircleIcon from '@heroicons/react/24/outline/ExclamationCircleIcon';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ subjectId: string }>;
}

const Layout = async ({ children, params }: LayoutProps) => {
  const { subjectId } = await params;

  const [{ data: subject }, user] = await Promise.all([
    getSubject(subjectId),
    getCurrentUser(),
  ]);

  return (
    <>
      <div className="border-b border-alpha-2">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-4 p-4">
          {user ? (
            <>
              {subject ? (
                <>
                  <span className="flex items-center gap-2 text-sm text-fg-4">
                    <ExclamationCircleIcon className="w-5 shrink-0" />
                    Public read-only profile
                  </span>
                  <Button
                    className="text-sm"
                    href={`/subjects/${subjectId}`}
                    variant="link"
                  >
                    View full profile
                  </Button>
                </>
              ) : (
                <>
                  <Button className="text-sm" href="/subjects" variant="link">
                    Back to my subjects
                  </Button>
                  <span className="flex items-center gap-2 text-sm text-fg-4">
                    <ExclamationCircleIcon className="w-5 shrink-0" />
                    Public read-only profile
                  </span>
                </>
              )}
            </>
          ) : (
            <>
              <span className="text-sm leading-tight text-fg-4">
                <span className="text-fg-2">llog</span>&mdash;the app for data
                collection <br />
                and real-time progress tracking.
              </span>
              <Button href="/sign-up" size="sm">
                Sign up
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="mx-auto max-w-lg pb-20">{children}</div>
    </>
  );
};

export default Layout;
