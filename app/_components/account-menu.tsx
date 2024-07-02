'use client';

import Avatar from '@/_components/avatar';
import DropdownMenu from '@/_components/dropdown-menu';
import signOut from '@/_mutations/sign-out';
import ArrowLeftStartOnRectangleIcon from '@heroicons/react/24/outline/ArrowLeftStartOnRectangleIcon';
import Bars3Icon from '@heroicons/react/24/outline/Bars3Icon';
import Cog6ToothIcon from '@heroicons/react/24/outline/Cog6ToothIcon';
import { User } from '@supabase/supabase-js';
import { useTransition } from 'react';

interface AccountMenuProps {
  user: User | null;
}

const AccountMenu = ({ user }: AccountMenuProps) => {
  const [isTransitioning, startTransition] = useTransition();

  return (
    <DropdownMenu
      trigger={
        <div className="flex gap-2 rounded-sm border border-alpha-3 pl-2 transition-colors hover:bg-alpha-1">
          <Bars3Icon className="w-5" />
          <Avatar
            className="-m-px"
            file={user?.user_metadata?.image_uri}
            id={user?.id}
          />
        </div>
      }
    >
      <DropdownMenu.Content className="mt-0.5">
        <DropdownMenu.Button href="/account/profile" scroll={false}>
          <Cog6ToothIcon className="w-5 text-fg-4" />
          Account settings
        </DropdownMenu.Button>
        <DropdownMenu.Button
          loading={isTransitioning}
          loadingText="Signing out…"
          onClick={(e) => {
            e.preventDefault();
            startTransition(signOut);
          }}
        >
          <ArrowLeftStartOnRectangleIcon className="w-5 text-fg-4" />
          Sign out
        </DropdownMenu.Button>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};

export default AccountMenu;
