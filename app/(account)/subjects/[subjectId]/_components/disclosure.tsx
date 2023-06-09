'use client';

import DirtyHtml from '@/(account)/_components/dirty-html';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { twMerge } from 'tailwind-merge';
import { useBoolean } from 'usehooks-ts';

interface DisclosureProps {
  children: string;
  className?: string;
  disabled?: boolean;
}

const Disclosure = ({ children, className, disabled }: DisclosureProps) => {
  const disclosure = useBoolean(disabled);

  return (
    <div
      className={twMerge(
        'group relative max-h-20 overflow-hidden pb-8 pt-4 after:absolute after:bottom-0 after:left-0 after:right-0 after:top-0 after:bg-gradient-to-b after:from-[hsla(60,4%,10%,0.7)] after:via-[hsla(60,4%,10%,0.9)] after:to-[hsl(60,4%,10%)]',
        disclosure.value && 'max-h-full after:hidden',
        disabled ? 'cursor-default' : 'select-none',
        className
      )}
      onClick={(e) => {
        if (!disabled && (e.target as HTMLElement).localName !== 'a') {
          disclosure.toggle();
        }
      }}
      role="button"
    >
      <DirtyHtml>{children}</DirtyHtml>
      {!disclosure.value && (
        <ChevronDownIcon className="absolute bottom-4 left-1/2 z-10 w-5 -translate-x-1/2 text-fg-2 transition-colors group-hover:text-fg-1" />
      )}
    </div>
  );
};

export default Disclosure;
