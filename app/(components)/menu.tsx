import { Menu as M } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import Button, { ButtonProps } from './button';

interface MenuProps {
  items: (ButtonProps & {
    icon: ReactNode;
    text: string;
  })[];
}

const Menu = ({ items }: MenuProps) => (
  <M as="div" className="relative h-[2.4rem] w-full">
    <M.Button className="flex h-full w-full items-center justify-center text-fg-2 transition-colors focus-within:outline-none hover:text-fg-1">
      <EllipsisVerticalIcon className="w-5" />
    </M.Button>
    <M.Items className="absolute -right-6 -bottom-6 z-10 w-56 origin-top-right rounded bg-bg-1 shadow-md focus:outline-none sm:bg-bg-2">
      <div className="divide-y divide-alpha-1 rounded border border-alpha-2 bg-alpha-2">
        {items.map(({ icon, text, ...rest }) => (
          <M.Item key={text}>
            {({ active }) => (
              <Button
                className={twMerge(
                  'm-0 h-full w-full gap-4 px-4 py-2',
                  active && 'text-fg-1'
                )}
                variant="link"
                {...rest}
              >
                {icon}
                {text}
              </Button>
            )}
          </M.Item>
        ))}
      </div>
    </M.Items>
  </M>
);

export default Menu;
