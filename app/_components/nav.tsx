import Button from '@/_components/button';
import IconButton from '@/_components/icon-button';
import countNotifications from '@/_server/count-notifications';
import { BellIcon } from '@heroicons/react/24/outline';
import SignOutButton from './sign-out-button';

interface NavProps {
  isClient: boolean;
}

const Nav = async ({ isClient }: NavProps) => {
  const { count: notificationCount } = await countNotifications();

  return (
    <nav className="mt-8 flex h-3 items-center justify-between gap-4 px-4 leading-none text-fg-2">
      <div className="flex flex-wrap gap-4">
        <Button activeClassName="text-fg-1" href="/subjects" variant="link">
          Subjects
        </Button>
        {!isClient && (
          <>
            <Button
              activeClassName="text-fg-1"
              href="/templates"
              variant="link"
            >
              Templates
            </Button>
            <Button activeClassName="text-fg-1" href="/inputs" variant="link">
              Inputs
            </Button>
          </>
        )}
      </div>
      <div className="flex gap-6">
        <IconButton
          activeClassName="text-fg-1"
          href="/notifications"
          icon={
            <div className="relative">
              {!!notificationCount && (
                <span className="absolute -top-1.5 right-7 rounded-sm border border-alpha-4 bg-red-1 px-1.5 py-0.5 text-xs text-white">
                  {notificationCount}
                </span>
              )}
              <BellIcon className="w-7" />
            </div>
          }
        />
        <SignOutButton />
      </div>
    </nav>
  );
};

export default Nav;
