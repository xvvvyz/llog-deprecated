import Button, { ButtonProps } from '@/_components/button';
import { Menu as M } from '@headlessui/react';
import { twMerge } from 'tailwind-merge';

const MenuItem = ({ className, ...rest }: ButtonProps) => (
  <M.Item>
    {({ active }) => (
      <Button
        className={twMerge(
          'h-10 w-full justify-start gap-4 rounded-none border-0 bg-transparent ring-transparent ring-offset-0 hover:bg-alpha-1',
          active && 'bg-alpha-1 text-fg-2',
          className,
        )}
        colorScheme="transparent"
        {...rest}
      />
    )}
  </M.Item>
);

export default MenuItem;
