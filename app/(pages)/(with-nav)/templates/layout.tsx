import Button from '@/_components/button';
import * as DropdownMenu from '@/_components/dropdown-menu';
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <>
    <div className="my-16 flex h-8 items-center justify-between gap-8 px-4">
      <h1 className="text-2xl">Templates</h1>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button size="sm">
            New&hellip;
            <ChevronDownIcon className="-mr-0.5 w-5 stroke-2" />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content>
            <DropdownMenu.Button href="/templates/event-types/create">
              <PlusIcon className="w-5 text-fg-4" />
              Event type template
            </DropdownMenu.Button>
            {/*<DropdownMenu.Button>*/}
            {/*  <PlusIcon className="w-5 text-fg-4" />*/}
            {/*  Training plan template*/}
            {/*</DropdownMenu.Button>*/}
            {/*<DropdownMenu.Button>*/}
            {/*  <PlusIcon className="w-5 text-fg-4" />*/}
            {/*  Session template*/}
            {/*</DropdownMenu.Button>*/}
            <DropdownMenu.Button href="/templates/modules/create">
              <PlusIcon className="w-5 text-fg-4" />
              Module template
            </DropdownMenu.Button>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
    {children}
  </>
);

export default Layout;
