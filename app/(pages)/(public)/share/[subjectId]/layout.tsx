import Button from '@/_components/button';
import getCurrentUser from '@/_server/get-current-user';
import getSubject from '@/_server/get-subject';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  params: { subjectId: string };
}

const Layout = async ({ children, params: { subjectId } }: LayoutProps) => {
  const user = await getCurrentUser();
  const { data: subject } = await getSubject(subjectId);

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
                Delight your clients with the ultimate
                <br />
                collaborative behavior tracking tool.
              </span>
              <Button href="/sign-up" size="sm">
                Sign up
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="mx-auto -mt-px max-w-lg pb-20 print:max-w-xl">
        {children}
      </div>
    </>
  );
};

export default Layout;
