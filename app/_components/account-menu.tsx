'use client';

import Avatar from '@/_components/avatar';
import DropdownMenu from '@/_components/dropdown-menu';
import SubscriptionStatus from '@/_constants/enum-subscription-status';
import signOut from '@/_mutations/sign-out';
import getCustomerBillingPortal from '@/_queries/get-customer-billing-portal';
import ArrowLeftStartOnRectangleIcon from '@heroicons/react/24/outline/ArrowLeftStartOnRectangleIcon';
import Bars3Icon from '@heroicons/react/24/outline/Bars3Icon';
import Cog6ToothIcon from '@heroicons/react/24/outline/Cog6ToothIcon';
import CreditCardIcon from '@heroicons/react/24/outline/CreditCardIcon';
import RocketLaunchIcon from '@heroicons/react/24/outline/RocketLaunchIcon';
import { User } from '@supabase/supabase-js';
import { useState, useTransition } from 'react';

interface AccountMenuProps {
  user: User;
}

const AccountMenu = ({ user }: AccountMenuProps) => {
  const [isSignOutTransitioning, startSignOutTransition] = useTransition();

  const [isBillingRedirectLoading, setIsBillingRedirectLoading] =
    useState(false);

  const isSubscribed =
    user.app_metadata.subscription_status === SubscriptionStatus.Active;

  return (
    <DropdownMenu
      trigger={
        <div className="flex gap-2 rounded-sm border border-alpha-3 pl-2 transition-colors hover:bg-alpha-1 active:bg-alpha-1">
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
        {!user?.user_metadata?.is_client && (
          <DropdownMenu.Button
            href={isSubscribed ? undefined : '/upgrade'}
            loading={isBillingRedirectLoading}
            loadingText="Redirecting…"
            onClick={async (e) => {
              if (!isSubscribed) return;
              e.preventDefault();
              setIsBillingRedirectLoading(true);
              const { url } = await getCustomerBillingPortal();
              if (url) location.href = url;
              else setIsBillingRedirectLoading(false);
            }}
          >
            {isSubscribed ? (
              <>
                <CreditCardIcon className="w-5 text-fg-4" />
                Manage billing
              </>
            ) : (
              <>
                <RocketLaunchIcon className="w-5 text-fg-4" />
                Upgrade plan
              </>
            )}
          </DropdownMenu.Button>
        )}
        <DropdownMenu.Button
          loading={isSignOutTransitioning}
          loadingText="Signing out…"
          onClick={(e) => {
            e.preventDefault();
            startSignOutTransition(signOut);
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
