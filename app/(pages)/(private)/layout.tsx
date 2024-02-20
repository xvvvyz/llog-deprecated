import AccountMenu from '@/_components/account-menu';
import Button from '@/_components/button';
import IconButton from '@/_components/icon-button';
import Subscriptions from '@/_components/subscriptions';
import countNotifications from '@/_queries/count-notifications';
import getCurrentUserFromSession from '@/_queries/get-current-user-from-session';
import BellIcon from '@heroicons/react/24/outline/BellIcon';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  modal: ReactNode;
}

const Layout = async ({ children, modal }: LayoutProps) => {
  const user = await getCurrentUserFromSession();
  const { count } = await countNotifications();

  return (
    <div className="mx-auto max-w-lg pb-20">
      <Subscriptions />
      {user && (
        <nav className="-mb-3 flex items-center justify-between gap-4 px-4 pt-8">
          <div className="flex flex-wrap gap-4 sm:gap-6">
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
                <Button
                  activeClassName="text-fg-2"
                  href="/inputs"
                  variant="link"
                >
                  Inputs
                </Button>
              </>
            )}
          </div>
          <div className="relative flex gap-6">
            <IconButton
              activeClassName="text-fg-2"
              attachBackLink
              href="/notifications/inbox"
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
              scroll={false}
            />
            <AccountMenu user={user} />
          </div>
        </nav>
      )}
      {children}
      {modal}
    </div>
  );
};

export default Layout;
