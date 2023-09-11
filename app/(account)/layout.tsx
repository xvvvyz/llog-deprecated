import Button from '@/_components/button';
import IconButton from '@/_components/icon-button';
import SignOutButton from '@/_components/sign-out-button';
import countNotifications from '@/_server/count-notifications';
import getCurrentUser from '@/_server/get-current-user';
import { BellIcon } from '@heroicons/react/24/outline';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
  const user = await getCurrentUser();
  const { count } = await countNotifications();

  return (
    <div className="mx-auto max-w-lg pb-20">
      <nav className="-mb-3 flex items-center justify-between gap-4 px-4 pt-8 leading-none text-fg-3">
        <div className="flex flex-wrap gap-4">
          <Button activeClassName="text-fg-2" href="/subjects" variant="link">
            Subjects
          </Button>
          {!user?.user_metadata?.is_client && (
            <>
              <Button
                activeClassName="text-fg-2"
                href="/templates"
                variant="link"
              >
                Templates
              </Button>
              <Button activeClassName="text-fg-2" href="/inputs" variant="link">
                Inputs
              </Button>
            </>
          )}
        </div>
        <div className="flex gap-6">
          <IconButton
            activeClassName="text-fg-2"
            href="/notifications"
            icon={
              <div className="relative">
                {!!count && (
                  <span className="absolute -top-1.5 right-7 whitespace-nowrap rounded-sm border border-alpha-4 bg-red-1 px-1.5 py-0.5 text-xs text-fg-1">
                    {count}
                  </span>
                )}
                <BellIcon className="w-7" />
              </div>
            }
          />
          <SignOutButton />
        </div>
      </nav>
      {children}
    </div>
  );
};

export default Layout;
