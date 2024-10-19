'use client';

import * as Drawer from '@/_components/drawer';
import Tip from '@/_components/tip';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import { User } from '@supabase/supabase-js';
import { usePathname } from 'next/navigation';

interface AddNewMenuItemsProps {
  canCreateSubject: boolean;
  user: User;
}

const AddNewMenuItems = ({ canCreateSubject, user }: AddNewMenuItemsProps) => {
  const pathname = usePathname();
  const [, type, id] = pathname.split('/');

  return (
    <>
      {type === 'subjects' && id && (
        <>
          <div className="relative">
            <Drawer.Button
              className="w-full"
              href={`/subjects/${id}/event-types/create`}
            >
              <PlusIcon className="w-5 text-fg-4" />
              Event type
            </Drawer.Button>
            <Tip align="end" className="absolute right-3 top-2.5">
              Event types allow you to record events as they occur.
            </Tip>
          </div>
          <div className="relative">
            <Drawer.Button
              className="w-full"
              href={`/subjects/${id}/protocols/create`}
            >
              <PlusIcon className="w-5 text-fg-4" />
              Protocol
            </Drawer.Button>
            <Tip align="end" className="absolute right-3 top-2.5">
              Protocols are structured plans to be completed over time.
            </Tip>
          </div>
          <Drawer.Separator />
        </>
      )}
      <Drawer.Button
        href={
          canCreateSubject
            ? '/subjects/create'
            : `/teams/${user.app_metadata.active_team_id}/upgrade`
        }
      >
        <PlusIcon className="w-5 text-fg-4" />
        New subject
      </Drawer.Button>
      <Drawer.NestedRoot>
        <Drawer.Trigger asChild>
          <Drawer.Button>
            <PlusIcon className="w-5 text-fg-4" />
            New template
          </Drawer.Button>
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay />
          <Drawer.Content>
            <Drawer.Title>New template menu</Drawer.Title>
            <Drawer.Description />
            <Drawer.Button href="/templates/event-types/create">
              <PlusIcon className="w-5 text-fg-4" />
              <div>
                Event type <span className="text-fg-4">template</span>
              </div>
            </Drawer.Button>
            <Drawer.Button href="/templates/protocols/create">
              <PlusIcon className="w-5 text-fg-4" />
              <div>
                Protocol <span className="text-fg-4">template</span>
              </div>
            </Drawer.Button>
            <Drawer.Button href="/templates/sessions/create">
              <PlusIcon className="w-5 text-fg-4" />
              <div>
                Session <span className="text-fg-4">template</span>
              </div>
            </Drawer.Button>
            <Drawer.Button href="/templates/modules/create">
              <PlusIcon className="w-5 text-fg-4" />
              <div>
                Module <span className="text-fg-4">template</span>
              </div>
            </Drawer.Button>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.NestedRoot>
      <Drawer.Button href="/inputs/create">
        <PlusIcon className="w-5 text-fg-4" />
        New input
      </Drawer.Button>
    </>
  );
};

export default AddNewMenuItems;
