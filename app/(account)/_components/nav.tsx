import IconButton from '@/(account)/_components/icon-button';
import countNotifications from '@/(account)/_server/count-notifications';
import getCurrentUser from '@/(account)/_server/get-current-user';
import Button from '@/_components/button';
import { BellIcon } from '@heroicons/react/24/outline';
import SignOutButton from './sign-out-button';

const Nav = async () => {
  const user = await getCurrentUser();
  const { count } = await countNotifications();

  return (
    <nav className="-mb-3 flex items-center justify-between gap-4 px-4 pt-8 leading-none text-fg-2">
      <div className="flex flex-wrap gap-4">
        <Button activeClassName="text-fg-1" href="/subjects" variant="link">
          Subjects
        </Button>
        {!user?.user_metadata?.is_client && (
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
              {!!count && (
                <span className="absolute -top-1.5 right-7 rounded-sm border border-alpha-4 bg-red-1 px-1.5 py-0.5 text-xs text-white">
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
  );
};

export default Nav;
