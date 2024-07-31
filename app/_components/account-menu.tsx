'use client';

import Avatar from '@/_components/avatar';
import DropdownMenu from '@/_components/dropdown-menu';
import createCustomerCheckout from '@/_mutations/create-customer-checkout';
import signOut from '@/_mutations/sign-out';
import { GetCustomerData } from '@/_queries/get-customer';
import getCustomerBillingPortal from '@/_queries/get-customer-billing-portal';
import ArrowLeftStartOnRectangleIcon from '@heroicons/react/24/outline/ArrowLeftStartOnRectangleIcon';
import ArrowUpCircleIcon from '@heroicons/react/24/outline/ArrowUpCircleIcon';
import Bars3Icon from '@heroicons/react/24/outline/Bars3Icon';
import Cog6ToothIcon from '@heroicons/react/24/outline/Cog6ToothIcon';
import CreditCardIcon from '@heroicons/react/24/outline/CreditCardIcon';
import { User } from '@supabase/supabase-js';
import { useState, useTransition } from 'react';

interface AccountMenuProps {
  customer: GetCustomerData;
  user: User | null;
}

const AccountMenu = ({ customer, user }: AccountMenuProps) => {
  const [isSignOutTransitioning, startSignOutTransition] = useTransition();

  const [isBillingRedirectLoading, setIsBillingRedirectLoading] =
    useState(false);

  const isSubscribed = customer?.subscription_status === 'active';

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
        <DropdownMenu.Button
          loading={isBillingRedirectLoading}
          loadingText="Redirecting…"
          onClick={async (e) => {
            e.preventDefault();
            setIsBillingRedirectLoading(true);

            const { url } = await (isSubscribed
              ? getCustomerBillingPortal()
              : createCustomerCheckout());

            if (url) location.href = url;
            else setIsBillingRedirectLoading(false);
          }}
        >
          {isSubscribed ? (
            <>
              <CreditCardIcon className="w-5 text-fg-4" />
              Manage subscription
            </>
          ) : (
            <>
              <ArrowUpCircleIcon className="w-5 text-fg-4" />
              Upgrade to pro
            </>
          )}
        </DropdownMenu.Button>
        <DropdownMenu.Separator />
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
