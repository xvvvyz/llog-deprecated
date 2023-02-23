import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import Avatar from './avatar';
import Button from './button';
import Pill from './pill';

import {
  ArrowRightIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

const icons = {
  arrow: <ArrowRightIcon className="relative -right-[0.15em] w-5" />,
  edit: <PencilIcon className="relative -right-[0.15em] w-5" />,
  trash: <TrashIcon className="relative -right-[0.15em] w-5" />,
};

interface LinkListProps {
  children: ReactNode;
  className?: string;
}

interface ListItemProps {
  avatar?: string | null;
  className?: string;
  href?: string;
  icon?: keyof typeof icons;
  onClick?: () => void;
  pill?: ReactNode;
  text: string;
}

const LinkList = Object.assign(
  ({ children, className }: LinkListProps) => (
    <ul
      className={twMerge(
        'divide-y divide-alpha-1 rounded border border-alpha-1 bg-bg-2',
        className
      )}
    >
      {children}
    </ul>
  ),
  {
    Item: ({
      avatar,
      className,
      href,
      icon = 'arrow',
      onClick,
      pill,
      text,
    }: ListItemProps) => (
      <li>
        <Button
          className={twMerge('m-0 w-full gap-4 py-3 px-4', className)}
          href={href}
          onClick={onClick}
          variant="link"
        >
          {typeof avatar !== 'undefined' && (
            <Avatar className="-my-2" file={avatar} name={text} size="sm" />
          )}
          <span className="truncate">{text}</span>
          <div className="ml-auto flex shrink-0 items-center gap-3">
            {pill && <Pill>{pill}</Pill>}
            {icons[icon]}
          </div>
        </Button>
      </li>
    ),
  }
);

export default LinkList;
