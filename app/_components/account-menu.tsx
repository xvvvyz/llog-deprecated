'use client';

import Avatar from '@/_components/avatar';
import Menu from '@/_components/menu';
import MenuButton from '@/_components/menu-button';
import MenuItem from '@/_components/menu-item';
import MenuItems from '@/_components/menu-items';
import useSupabase from '@/_hooks/use-supabase';
import { User } from '@supabase/gotrue-js';

import {
  ArrowLeftStartOnRectangleIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

interface AccountMenuProps {
  user: User | null;
}

const AccountMenu = ({ user }: AccountMenuProps) => {
  const supabase = useSupabase();

  return (
    <Menu className="h-full shrink-0">
      <MenuButton>
        <Avatar
          file={user?.user_metadata?.image_uri}
          name={user?.user_metadata?.first_name}
        />
      </MenuButton>
      <MenuItems className="mt-12">
        <MenuItem href="/account">
          <Cog6ToothIcon className="w-5 text-fg-4" />
          Account settings
        </MenuItem>
        <MenuItem onClick={() => supabase.auth.signOut()}>
          <ArrowLeftStartOnRectangleIcon className="w-5 text-fg-4" />
          Sign out
        </MenuItem>
      </MenuItems>
    </Menu>
  );
};

export default AccountMenu;
