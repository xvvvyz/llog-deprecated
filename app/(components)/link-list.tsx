import Box, { BoxProps } from '(components)/box';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import Avatar from './avatar';
import Button from './button';
import Card from './card';
import Pill from './pill';

import {
  ArrowRightIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

const icons = {
  arrow: <ArrowRightIcon className="relative -right-[0.2em] w-5" />,
  edit: <PencilIcon className="relative -right-[0.2em] w-5" />,
  trash: <TrashIcon className="relative -right-[0.2em] w-5" />,
};

interface ListItemProps extends BoxProps {
  avatar?: string | null;
  href?: string;
  icon?: keyof typeof icons;
  onClick?: () => void;
  pill?: ReactNode[];
  text: string;
}

const LinkList = Object.assign(
  ({ className, ...rest }: BoxProps) => (
    <Card
      as="ul"
      className={twMerge('divide-y divide-alpha-1 empty:border-0', className)}
      size="0"
      {...rest}
    />
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
      ...rest
    }: ListItemProps) => (
      <Box as="li" {...rest}>
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
            {pill && <Pill values={pill} />}
            {icons[icon]}
          </div>
        </Button>
      </Box>
    ),
  }
);

export default LinkList;
