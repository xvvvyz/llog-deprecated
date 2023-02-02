import Box, { BoxProps } from '(components)/box';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { twMerge } from 'tailwind-merge';
import Avatar from './avatar';
import Button from './button';
import Pill from './pill';

const LinkList = ({ className, ...rest }: BoxProps) => (
  <Box
    as="ul"
    className={twMerge(
      'divide-y divide-alpha-1 rounded border border-alpha-1 empty:border-0',
      className
    )}
    {...rest}
  />
);

interface ListItemProps extends BoxProps {
  avatar?: string | File | null;
  href: string;
  pill?: string;
  text: string;
}

const ListItem = ({
  avatar,
  className,
  href,
  pill,
  text,
  ...rest
}: ListItemProps) => (
  <Box as="li" className={className} {...rest}>
    <Button className="m-0 w-full gap-4 p-0 p-4" href={href} variant="link">
      {avatar && (
        <Avatar className="-my-2" file={avatar} name={text} size="sm" />
      )}
      <span className="truncate">{text}</span>
      <div className="ml-auto flex shrink-0 items-center gap-4">
        {pill && <Pill>{pill}</Pill>}
        <ArrowRightIcon className="relative -right-[0.1em] w-5" />
      </div>
    </Button>
  </Box>
);

export { LinkList, ListItem };
