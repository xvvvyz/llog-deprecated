import AccountMenu from '@/_components/account-menu';
import AddNewMenuItems from '@/_components/add-new-menu-items';
import Button from '@/_components/button';
import * as Drawer from '@/_components/drawer';
import IconButton from '@/_components/icon-button';
import NotificationsSubscription from '@/_components/notifications-subscription';
import canInsertSubjectOnCurrentPlan from '@/_queries/can-insert-subject-on-current-plan';
import countNotifications from '@/_queries/count-notifications';
import getCurrentUser from '@/_queries/get-current-user';
import listTeams from '@/_queries/list-teams';
import Bars3Icon from '@heroicons/react/24/outline/Bars3Icon';
import DocumentTextIcon from '@heroicons/react/24/outline/DocumentTextIcon';
import HomeIcon from '@heroicons/react/24/outline/HomeIcon';
import InboxIcon from '@heroicons/react/24/outline/InboxIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import QueueListIcon from '@heroicons/react/24/outline/QueueListIcon';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
  const user = await getCurrentUser();
  if (!user) return null;

  const [{ data: canCreateSubject }, { count }, { data: teams }] =
    await Promise.all([
      user.app_metadata.is_client
        ? Promise.resolve({ data: false })
        : canInsertSubjectOnCurrentPlan(),
      countNotifications(),
      user.app_metadata.is_client ? Promise.resolve({ data: [] }) : listTeams(),
    ]);

  if (!teams) return null;

  return (
    <>
      <div className="mx-auto max-w-lg pb-[calc(theme('spacing.16')+5.2rem)]">
        {children}
      </div>
      <div className="fixed inset-x-0 bottom-0">
        <div className="mx-auto w-full max-w-lg px-4">
          <div className="rounded-t bg-bg-1 pb-4">
            <nav className="flex items-center justify-center rounded border border-alpha-1 px-4">
              <Button
                activeClassName="text-fg-2 before:content-[' '] before:absolute before:size-10 before:left-50% before:top-3 before:-translate-1/2 before:rounded-full before:bg-alpha-1"
                className="relative m-0 w-20 flex-col gap-1 p-0 py-3 text-xs"
                href="/subjects"
                variant="link"
              >
                <HomeIcon className="w-5" />
                Subjects
              </Button>
              <Button
                activeClassName="text-fg-2 before:content-[' '] before:absolute before:size-10 before:left-50% before:top-3 before:-translate-1/2 before:rounded-full before:bg-alpha-1"
                className="relative m-0 w-20 flex-col gap-1 p-0 py-3 text-xs"
                href="/inbox"
                variant="link"
              >
                <NotificationsSubscription />
                <div className="relative">
                  {!!count && (
                    <span className="absolute -top-0.5 right-0 size-2 rounded border border-alpha-4 bg-red-1" />
                  )}
                  <InboxIcon className="w-5" />
                </div>
                Inbox
              </Button>
              {!user.app_metadata.is_client && (
                <>
                  <Drawer.Root>
                    <Drawer.Trigger asChild>
                      <IconButton
                        className="mx-3 size-10 rounded-full p-0"
                        icon={<PlusIcon className="w-5 stroke-2" />}
                        label="Add new…"
                        variant="primary"
                      />
                    </Drawer.Trigger>
                    <Drawer.Portal>
                      <Drawer.Overlay />
                      <Drawer.Content>
                        <Drawer.Title>Add new menu</Drawer.Title>
                        <Drawer.Description />
                        <AddNewMenuItems
                          canCreateSubject={canCreateSubject}
                          user={user}
                        />
                      </Drawer.Content>
                    </Drawer.Portal>
                  </Drawer.Root>
                  <Drawer.Root>
                    <Drawer.Trigger asChild>
                      <Button
                        className="relative m-0 w-20 flex-col gap-1 p-0 py-3 text-xs"
                        variant="link"
                      >
                        <Bars3Icon className="w-5" />
                        More
                      </Button>
                    </Drawer.Trigger>
                    <Drawer.Portal>
                      <Drawer.Overlay />
                      <Drawer.Content>
                        <Drawer.Title>Menu</Drawer.Title>
                        <Drawer.Description />
                        <Drawer.Button href="/inputs">
                          <QueueListIcon className="w-5 text-fg-4" />
                          Inputs
                        </Drawer.Button>
                        <Drawer.Button href="/templates">
                          <DocumentTextIcon className="w-5 text-fg-4" />
                          Templates
                        </Drawer.Button>
                      </Drawer.Content>
                    </Drawer.Portal>
                  </Drawer.Root>
                </>
              )}
              <AccountMenu user={user} teams={teams} />
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
