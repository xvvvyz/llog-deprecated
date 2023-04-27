import Avatar from '(components)/avatar';
import DateTime from '(components)/date-time';
import { twMerge } from 'tailwind-merge';

interface EventBannerProps {
  className?: string;
  createdAt: string;
  createdAtFormatter?: 'date-time' | 'time';
  profile: {
    first_name: string;
    last_name: string;
  };
}

const EventBanner = ({
  className,
  createdAt,
  createdAtFormatter = 'date-time',
  profile,
}: EventBannerProps) => (
  <div
    className={twMerge(
      '-mx-px flex items-baseline gap-2 whitespace-nowrap text-xs uppercase tracking-widest text-fg-3',
      className
    )}
  >
    <Avatar className="-ml-px" name={profile.first_name} size="xs" />
    <span className="truncate">
      {profile.first_name} {profile.last_name}
    </span>
    <DateTime
      className="ml-auto"
      date={createdAt}
      formatter={createdAtFormatter}
    />
  </div>
);

export default EventBanner;
