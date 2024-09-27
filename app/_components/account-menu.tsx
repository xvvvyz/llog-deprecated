'use client';

import Avatar from '@/_components/avatar';
import Button from '@/_components/button';
import * as Drawer from '@/_components/drawer';
import SubscriptionStatus from '@/_constants/enum-subscription-status';
import signOut from '@/_mutations/sign-out';
import getCustomerBillingPortal from '@/_queries/get-customer-billing-portal';
import ArrowLeftStartOnRectangleIcon from '@heroicons/react/24/outline/ArrowLeftStartOnRectangleIcon';
import AtSymbolIcon from '@heroicons/react/24/outline/AtSymbolIcon';
import CreditCardIcon from '@heroicons/react/24/outline/CreditCardIcon';
import HeartIcon from '@heroicons/react/24/outline/HeartIcon';
import LockClosedIcon from '@heroicons/react/24/outline/LockClosedIcon';
import RocketLaunchIcon from '@heroicons/react/24/outline/RocketLaunchIcon';
import UserCircleIcon from '@heroicons/react/24/outline/UserCircleIcon';
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
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <Button
          className="m-0 w-20 flex-col gap-1 p-0 py-3 text-xs"
          variant="link"
        >
          <div className="flex size-5 items-center justify-center">
            <Avatar
              className="size-[calc(theme('spacing.4')+0.15rem)]"
              file={user?.user_metadata?.image_uri}
              id={user?.id}
            />
          </div>
          Account
        </Button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Title>Account menu</Drawer.Title>
          <Drawer.Description />
          <Drawer.Button href="/hey">
            <HeartIcon className="w-5 text-fg-4" />
            Feedback
          </Drawer.Button>
          <Drawer.Separator />
          <Drawer.Button href="/account/profile">
            <UserCircleIcon className="w-5 text-fg-4" />
            Edit profile
          </Drawer.Button>
          <Drawer.Button href="/account/email">
            <AtSymbolIcon className="w-5 text-fg-4" />
            Change email
          </Drawer.Button>
          <Drawer.Button href="/account/password">
            <LockClosedIcon className="w-5 text-fg-4" />
            Change password
          </Drawer.Button>
          {!user?.user_metadata?.is_client && (
            <>
              <Drawer.Separator />
              <Drawer.Button
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
              </Drawer.Button>
            </>
          )}
          <Drawer.Separator />
          <Drawer.Button
            loading={isSignOutTransitioning}
            loadingText="Signing out…"
            onClick={(e) => {
              e.preventDefault();
              startSignOutTransition(signOut);
            }}
          >
            <ArrowLeftStartOnRectangleIcon className="w-5 text-fg-4" />
            Sign out
          </Drawer.Button>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default AccountMenu;
