import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import Avatar from './avatar';
import Button from './button';
import IconButton from './icon-button';
import Pill from './pill';

import {
  ArrowRightIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

const icons = {
  arrow: <ArrowRightIcon className="w-5" />,
  edit: <PencilIcon className="w-5" />,
  trash: <TrashIcon className="w-5" />,
};

interface LinkListProps {
  children: ReactNode;
  className?: string;
}

interface ListItemProps {
  avatar?: string | null;
  avatars?: { id: string; image_uri: string; name: string }[];
  className?: string;
  href?: string;
  icon?: keyof typeof icons;
  menu?: ReactNode;
  onClick?: () => void;
  pill?: ReactNode;
  rightHref?: string;
  rightIcon?: keyof typeof icons;
  rightLabel?: string;
  text: string;
}

const LinkList = Object.assign(
  ({ children, className }: LinkListProps) => (
    <ul
      className={twMerge(
        'divide-y divide-alpha-1 rounded border border-alpha-1 bg-bg-2 empty:hidden',
        className
      )}
    >
      {children}
    </ul>
  ),
  {
    Item: ({
      avatar,
      avatars,
      className,
      href,
      icon = 'arrow',
      menu,
      onClick,
      pill,
      rightHref,
      rightIcon,
      rightLabel,
      text,
    }: ListItemProps) => (
      <li className="group flex">
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
          {avatars && !!avatars.length && (
            <div className="mr-2 flex">
              {avatars.map(({ id, image_uri, name }) => (
                <Avatar
                  className="-mr-2 border border-alpha-reverse-2"
                  file={image_uri}
                  key={id}
                  name={name}
                  size="sm"
                />
              ))}
            </div>
          )}
          <div className="ml-auto flex shrink-0 items-center gap-4">
            {pill && <Pill>{pill}</Pill>}
            {icons[icon]}
          </div>
        </Button>
        {rightIcon && rightLabel && (
          <IconButton
            className="m-0 shrink-0 border-0 border-l border-alpha-1 bg-alpha-reverse-1 px-4 hover:border-alpha-1 group-first:rounded-tr group-last:rounded-br"
            href={rightHref}
            icon={icons[rightIcon]}
            label={rightLabel}
          />
        )}
        {menu && menu}
      </li>
    ),
  }
);

export default LinkList;
