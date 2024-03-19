'use client';

import Avatar from '@/_components/avatar';
import Menu from '@/_components/menu';
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
    <Menu className="h-full shrink-0">
      <Menu.Button className="gap-2 rounded-sm border border-alpha-3 pl-2 hover:bg-alpha-1">
        <Bars3Icon className="w-5" />
        <Avatar
          className="-m-px"
          file={user?.user_metadata?.image_uri}
          id={user?.id}
        />
      </Menu.Button>
      <Menu.Items className="mt-10">
        <Menu.Item href="/account/profile" scroll={false}>
          <Cog6ToothIcon className="w-5 text-fg-4" />
          Account settings
        </Menu.Item>
        <Menu.Item
          loading={isTransitioning}
          loadingText="Signing out…"
          onClick={(e) => {
            e.preventDefault();
            startTransition(signOut);
          }}
        >
          <ArrowLeftStartOnRectangleIcon className="w-5 text-fg-4" />
          Sign out
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
};

export default AccountMenu;
