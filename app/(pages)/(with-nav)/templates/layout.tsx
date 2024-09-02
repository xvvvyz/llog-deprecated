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
          <Button className="pl-5" size="sm">
            New&hellip;
            <ChevronDownIcon className="w-5 stroke-2" />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content>
            <DropdownMenu.Button href="/templates/event-types/create">
              <PlusIcon className="w-5 text-fg-4" />
              <div>
                Event type <span className="text-fg-4">template</span>
              </div>
            </DropdownMenu.Button>
            <DropdownMenu.Button href="/templates/training-plans/create">
              <PlusIcon className="w-5 text-fg-4" />
              <div>
                Training plan <span className="text-fg-4">template</span>
              </div>
            </DropdownMenu.Button>
            <DropdownMenu.Button href="/templates/sessions/create">
              <PlusIcon className="w-5 text-fg-4" />
              <div>
                Session <span className="text-fg-4">template</span>
              </div>
            </DropdownMenu.Button>
            <DropdownMenu.Button href="/templates/modules/create">
              <PlusIcon className="w-5 text-fg-4" />
              <div>
                Module <span className="text-fg-4">template</span>
              </div>
            </DropdownMenu.Button>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
    {children}
  </>
);

export default Layout;
