import EllipsisHorizontalIcon from '@heroicons/react/24/outline/EllipsisHorizontalIcon';
import SlashIcon from '@heroicons/react/24/outline/SlashIcon';
import { Slot } from '@radix-ui/react-slot';
import NextLink from 'next/link';
import * as React from 'react';
import { twMerge } from 'tailwind-merge';

const Ellipsis = ({ className, ...props }: React.ComponentProps<'span'>) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={twMerge('flex size-9 items-center justify-center', className)}
    {...props}
  >
    <EllipsisHorizontalIcon className="w-4" />
    <span className="sr-only">More</span>
  </span>
);

Ellipsis.displayName = 'Ellipsis';

const Item = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<'li'>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={twMerge('min-w-0', className)} {...props} />
));

Item.displayName = 'Item';

const Link = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<typeof NextLink> & {
    asChild?: boolean;
  }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : NextLink;
  return <Comp ref={ref} className={twMerge(className)} {...props} />;
});

Link.displayName = 'Link';

const List = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<'ol'>
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={twMerge('flex flex-wrap items-center gap-3', className)}
    {...props}
  />
));

List.displayName = 'List';

const Page = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<'span'>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={twMerge(className)}
    {...props}
  />
));

Page.displayName = 'Page';

const Root = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<'nav'> & {
    separator?: React.ReactNode;
  }
>(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />);

Root.displayName = 'Root';

const Separator = ({
  children,
  className,
  ...props
}: React.ComponentProps<'li'>) => (
  <li
    aria-hidden="true"
    className={twMerge('text-fg-4', className)}
    role="presentation"
    {...props}
  >
    {children ?? <SlashIcon className="w-5" />}
  </li>
);

Separator.displayName = 'Separator';

export { Ellipsis, Item, Link, List, Page, Root, Separator };
