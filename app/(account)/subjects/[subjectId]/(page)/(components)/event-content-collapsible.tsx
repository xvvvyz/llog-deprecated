'use client';

import DirtyHtml from '(components)/dirty-html';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { twMerge } from 'tailwind-merge';
import { useBoolean } from 'usehooks-ts';

interface EventContentCollapsibleProps {
  className?: string;
  content?: string;
}

const EventContentCollapsible = ({
  className,
  content,
}: EventContentCollapsibleProps) => {
  const { toggle, value } = useBoolean();
  if (!content) return null;

  return (
    <div
      className={twMerge(
        'group relative max-h-12 select-none overflow-hidden px-4 text-fg-3 after:absolute after:bottom-0 after:left-0 after:right-0 after:top-0 after:bg-gradient-to-b after:from-[hsla(45,6%,12%,0.4)] after:via-[hsla(45,6%,12%,0.8)] after:to-bg-2',
        value && 'max-h-full after:hidden',
        className
      )}
      onClick={toggle}
      role="button"
    >
      <DirtyHtml>{content}</DirtyHtml>
      {!value && (
        <ChevronDownIcon className="absolute bottom-0 left-1/2 z-10 w-5 -translate-x-1/2 text-fg-2 transition-colors group-hover:text-fg-1" />
      )}
    </div>
  );
};

export default EventContentCollapsible;
