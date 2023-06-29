import Button from '@/_components/button';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import Avatar from './avatar';
import IconButton from './icon-button';

import {
  ArrowRightIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

const icons = {
  arrow: <ArrowRightIcon className="ml-auto w-5 shrink-0" />,
  edit: <PencilIcon className="ml-auto w-5 shrink-0" />,
  trash: <TrashIcon className="ml-auto w-5 shrink-0" />,
};

interface LinkListProps {
  children: ReactNode;
  className?: string;
}

interface ListItemProps {
  avatar?: string | null;
  avatars?: { id: string; image_uri: string | null; name: string }[];
  className?: string;
  href?: string;
  icon?: keyof typeof icons;
  menu?: ReactNode;
  onClick?: () => void;
  rightHref?: string;
  rightIcon?: keyof typeof icons;
  rightLabel?: string;
  text: ReactNode;
}

const LinkList = Object.assign(
  ({ children, className }: LinkListProps) => (
    <ul
      className={twMerge(
        'mx-4 divide-y divide-alpha-1 rounded border border-alpha-1 bg-bg-2 empty:hidden',
        className
      )}
    >
      {children}
    </ul>
  ),
  {
    Item: ({
      avatars,
      className,
      href,
      icon = 'arrow',
      menu,
      onClick,
      rightHref,
      rightIcon,
      rightLabel,
      text,
    }: ListItemProps) => (
      <li className="group flex">
        <Button
          className={twMerge(
            'm-0 grow gap-4 overflow-hidden px-4 py-3',
            className
          )}
          href={href}
          onClick={onClick}
          variant="link"
        >
          {avatars && !!avatars.length && (
            <div className="mr-2 flex">
              {avatars.map(({ id, image_uri, name }) => (
                <Avatar
                  className="-mr-2 border border-alpha-reverse-2 bg-bg-2"
                  file={image_uri}
                  key={id}
                  name={name}
                  size="sm"
                />
              ))}
            </div>
          )}
          <span className="leading-snug [overflow-wrap:anywhere]">{text}</span>
          {icons[icon]}
        </Button>
        {rightIcon && rightLabel && (
          <IconButton
            className="m-0 shrink-0 border-l border-alpha-1 px-4 py-2"
            href={rightHref}
            icon={icons[rightIcon]}
            label={rightLabel}
            variant="link"
          />
        )}
        {menu && menu}
      </li>
    ),
  }
);

export default LinkList;
