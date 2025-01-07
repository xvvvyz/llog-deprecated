'use client';

import ButtonPrimitive from '@/_components/button';
import IconButtonPrimitive from '@/_components/icon-button';
import EllipsisVerticalIcon from '@heroicons/react/24/outline/EllipsisVerticalIcon';
import { usePrevious } from '@uidotdev/usehooks';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import { useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import { Drawer as DrawerPrimitive } from 'vaul';

const DrawerContext = React.createContext<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

const Button = React.forwardRef<
  React.ComponentRef<typeof ButtonPrimitive>,
  React.ComponentPropsWithoutRef<typeof ButtonPrimitive>
>(({ children, className, ...props }, ref) => (
  <ButtonPrimitive
    className={twMerge(
      'w-full min-w-0 justify-start gap-4 border-0 focus:ring-0 group-hover:bg-alpha-1',
      className,
    )}
    colorScheme="transparent"
    ref={ref}
    {...props}
  >
    {children}
  </ButtonPrimitive>
));

Button.displayName = ButtonPrimitive.displayName;

const ButtonGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={twMerge('group relative', className)} {...props} />
));

ButtonGroup.displayName = 'ButtonGroup';

const Close = DrawerPrimitive.Close;

const Content = React.forwardRef<
  React.ComponentRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerPrimitive.Content
    ref={ref}
    className={twMerge(
      'fixed inset-x-0 bottom-0 z-50 w-full rounded-t border border-b-0 border-alpha-1 bg-bg-2',
      className,
    )}
    {...props}
  >
    <div className="mx-auto flex max-w-lg flex-col px-4 py-8">
      <div className="mx-auto -mt-4 mb-8 h-2 w-24 rounded bg-alpha-2" />
      {children}
    </div>
  </DrawerPrimitive.Content>
));

Content.displayName = 'Content';

const Description = React.forwardRef<
  React.ComponentRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={twMerge('sr-only', className)}
    {...props}
  />
));

Description.displayName = DrawerPrimitive.Description.displayName;

const MoreButton = React.forwardRef<
  React.ComponentRef<typeof IconButtonPrimitive>,
  Omit<React.ComponentPropsWithoutRef<typeof IconButtonPrimitive>, 'icon'>
>(({ className, ...props }, ref) => (
  <IconButtonPrimitive
    className={twMerge(
      'absolute right-0 border-0 px-2.5 py-2.5 focus:ring-0',
      className,
    )}
    colorScheme="transparent"
    icon={<EllipsisVerticalIcon className="w-5" />}
    ref={ref}
    variant="primary"
    {...props}
  />
));

MoreButton.displayName = 'MoreButton';

const NestedRoot = (
  props: React.ComponentProps<typeof DrawerPrimitive.Root>,
) => {
  const [open, setOpen] = React.useState(false);

  return (
    <DrawerContext.Provider value={{ open, setOpen }}>
      <DrawerPrimitive.Root open={open} onOpenChange={setOpen} {...props} />
    </DrawerContext.Provider>
  );
};

NestedRoot.displayName = 'NestedRoot';

const Overlay = React.forwardRef<
  React.ComponentRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={twMerge(
      'fixed left-0 top-0 z-50 h-dvh w-dvw overflow-y-auto bg-alpha-reverse-1 py-16',
      className,
    )}
    {...props}
  />
));

Overlay.displayName = DrawerPrimitive.Overlay.displayName;

const Portal = DrawerPrimitive.Portal;

const Root = (props: React.ComponentProps<typeof DrawerPrimitive.Root>) => {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const previousPathname = usePrevious(pathname);

  // hack to close drawer when navigating to a new page. the UX is better, also
  // when modal pages are opened from the drawer, scroll gets locked...
  useEffect(() => {
    if (pathname !== previousPathname) setOpen(false);
  }, [pathname, previousPathname]);

  return (
    <DrawerContext.Provider value={{ open, setOpen }}>
      <DrawerPrimitive.Root open={open} onOpenChange={setOpen} {...props} />
    </DrawerContext.Provider>
  );
};

Root.displayName = 'Root';

const Separator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={twMerge('mx-4 my-2 h-px bg-alpha-0', className)}
    {...props}
  />
));

Separator.displayName = 'Separator';

const Title = React.forwardRef<
  React.ComponentRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={twMerge('sr-only', className)}
    {...props}
  />
));

Title.displayName = DrawerPrimitive.Title.displayName;

const Trigger = React.forwardRef<
  React.ComponentRef<typeof DrawerPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Trigger
    asChild
    className={twMerge('cursor-pointer outline-none', className)}
    ref={ref}
    {...props}
  />
));

Trigger.displayName = DrawerPrimitive.Trigger.displayName;

export {
  Button,
  ButtonGroup,
  Close,
  Content,
  Description,
  MoreButton,
  NestedRoot,
  Overlay,
  Portal,
  Root,
  Separator,
  Title,
  Trigger,
};
