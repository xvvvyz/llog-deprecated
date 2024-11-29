'use client';

import Avatar from '@/_components/avatar';
import Button from '@/_components/button';
import * as Drawer from '@/_components/drawer';
import SubscriptionVariantName from '@/_constants/enum-subscription-variant-name';
import setActiveTeam from '@/_mutations/set-active-team';
import signOut from '@/_mutations/sign-out';
import getSubscriptionBillingPortal from '@/_queries/get-subscription-billing-portal';
import { ListTeamsData } from '@/_queries/list-teams';
import firstIfArray from '@/_utilities/first-if-array';
import ArrowLeftStartOnRectangleIcon from '@heroicons/react/24/outline/ArrowLeftStartOnRectangleIcon';
import AtSymbolIcon from '@heroicons/react/24/outline/AtSymbolIcon';
import CheckIcon from '@heroicons/react/24/outline/CheckIcon';
import CreditCardIcon from '@heroicons/react/24/outline/CreditCardIcon';
import HeartIcon from '@heroicons/react/24/outline/HeartIcon';
import LockClosedIcon from '@heroicons/react/24/outline/LockClosedIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import RocketLaunchIcon from '@heroicons/react/24/outline/RocketLaunchIcon';
import { User } from '@supabase/supabase-js';
import { useState, useTransition } from 'react';
import { twMerge } from 'tailwind-merge';

interface AccountMenuProps {
  user: NonNullable<User>;
  teams: NonNullable<ListTeamsData>;
}

const AccountMenu = ({ user, teams }: AccountMenuProps) => {
  const [isSignOutTransitioning, startSignOutTransition] = useTransition();

  const [isChangeTeamsTransitioning, startChangeTeamsTransition] =
    useTransition();

  const [changeTeamsId, setChangeTeamsId] = useState<string | null>(null);

  const [isBillingRedirectLoading, setIsBillingRedirectLoading] =
    useState(false);

  const activeTeam = teams.find(
    (team) => team.id === user.app_metadata.active_team_id,
  );

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
              file={
                user.app_metadata.is_client
                  ? user.user_metadata.image_uri
                  : activeTeam?.image_uri
              }
              id={user.app_metadata.is_client ? user.id : activeTeam?.id}
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
          {!user.app_metadata.is_client && (
            <>
              {teams.map((team) => {
                const isLoading =
                  isChangeTeamsTransitioning && changeTeamsId === team.id;

                const subscription = firstIfArray(team.subscriptions);

                return (
                  <Drawer.ButtonGroup key={team.id}>
                    <Drawer.Button
                      className="pr-14"
                      loading={isLoading}
                      onClick={(e) => {
                        e.preventDefault();
                        setChangeTeamsId(team.id);

                        startChangeTeamsTransition(() =>
                          setActiveTeam(team.id),
                        );
                      }}
                    >
                      {!isLoading && (
                        <Avatar
                          className="size-5"
                          file={team.image_uri}
                          id={team.id}
                        />
                      )}
                      <div className="truncate">{team.name}</div>
                      <div
                        className={twMerge(
                          '-ml-2 shrink-0 rounded-sm border border-alpha-1 bg-alpha-1 px-1 text-xs text-fg-4',
                          subscription?.variant ===
                            SubscriptionVariantName.Pro &&
                            'bg-cyan-900 text-cyan-200',
                          subscription?.variant ===
                            SubscriptionVariantName.Team &&
                            'bg-green-900 text-green-200',
                        )}
                      >
                        {subscription?.variant ?? 'free'}
                      </div>
                      {((team.id === activeTeam?.id &&
                        !isChangeTeamsTransitioning) ||
                        isLoading) && (
                        <CheckIcon className="ml-auto w-5 shrink-0" />
                      )}
                    </Drawer.Button>
                    <Drawer.NestedRoot>
                      <Drawer.Trigger asChild>
                        <Drawer.MoreButton label="Organization menu" />
                      </Drawer.Trigger>
                      <Drawer.Portal>
                        <Drawer.Overlay />
                        <Drawer.Content>
                          <Drawer.Title>Organization menu</Drawer.Title>
                          <Drawer.Description />
                          <Drawer.Button href={`/teams/${team.id}/edit`}>
                            <PencilIcon className="w-5 text-fg-4" />
                            Edit
                          </Drawer.Button>
                          <Drawer.Button
                            href={
                              subscription
                                ? undefined
                                : `/teams/${team.id}/upgrade`
                            }
                            loading={isBillingRedirectLoading}
                            loadingText="Redirecting…"
                            onClick={async (e) => {
                              if (!subscription) return;
                              e.preventDefault();
                              setIsBillingRedirectLoading(true);

                              const { url } =
                                await getSubscriptionBillingPortal(
                                  subscription.id,
                                );

                              if (url) location.href = url;
                              else setIsBillingRedirectLoading(false);
                            }}
                          >
                            {subscription ? (
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
                        </Drawer.Content>
                      </Drawer.Portal>
                    </Drawer.NestedRoot>
                  </Drawer.ButtonGroup>
                );
              })}
              <Drawer.Button href="/teams/create">
                <PlusIcon className="w-5 text-fg-4" />
                New organization
              </Drawer.Button>
              <Drawer.Separator />
            </>
          )}
          <Drawer.Button href="/account/profile">
            <Avatar
              className="size-5"
              file={user.user_metadata.image_uri}
              id={user.id}
            />
            Edit profile
          </Drawer.Button>
          <Drawer.Button href="/account/password">
            <LockClosedIcon className="w-5 text-fg-4" />
            Change password
          </Drawer.Button>
          <Drawer.Button href="/account/email">
            <AtSymbolIcon className="w-5 text-fg-4" />
            Change email
          </Drawer.Button>
          <Drawer.Separator />
          <Drawer.Button href="/hey">
            <HeartIcon className="w-5 text-fg-4" />
            Give feedback
          </Drawer.Button>
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
