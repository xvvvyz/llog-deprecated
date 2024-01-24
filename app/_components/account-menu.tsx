'use client';

import signOut from '@/_actions/sign-out';
import Avatar from '@/_components/avatar';
import Menu from '@/_components/menu';
import MenuButton from '@/_components/menu-button';
import MenuItem from '@/_components/menu-item';
import MenuItems from '@/_components/menu-items';
import ArrowLeftStartOnRectangleIcon from '@heroicons/react/24/outline/ArrowLeftStartOnRectangleIcon';
import Cog6ToothIcon from '@heroicons/react/24/outline/Cog6ToothIcon';
import { User } from '@supabase/supabase-js';
import { usePathname } from 'next/navigation';
import { useTransition } from 'react';

interface AccountMenuProps {
  user: User | null;
}

const AccountMenu = ({ user }: AccountMenuProps) => {
  const [isTransitioning, startTransition] = useTransition();
  const pathname = usePathname();

  return (
    <Menu className="h-full shrink-0">
      <MenuButton>
        <Avatar file={user?.user_metadata?.image_uri} id={user?.id} />
      </MenuButton>
      <MenuItems className="mt-10">
        <MenuItem href={`/account/profile?back=${pathname}`} scroll={false}>
          <Cog6ToothIcon className="w-5 text-fg-4" />
          Account settings
        </MenuItem>
        <MenuItem
          loading={isTransitioning}
          loadingText="Signing out…"
          onClick={(e) => {
            e.preventDefault();
            startTransition(signOut);
          }}
        >
          <ArrowLeftStartOnRectangleIcon className="w-5 text-fg-4" />
          Sign out
        </MenuItem>
      </MenuItems>
    </Menu>
  );
};

export default AccountMenu;
