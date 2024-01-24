'use client';

import IconButton from '@/_components/icon-button';
import BellIcon from '@heroicons/react/24/outline/BellIcon';
import { usePathname } from 'next/navigation';

interface NotificationsButtonProps {
  count: number;
}

const NotificationsButton = ({ count }: NotificationsButtonProps) => {
  const pathname = usePathname();

  return (
    <IconButton
      activeClassName="text-fg-2"
      href={`/notifications/inbox?back=${pathname}`}
      icon={
        <div className="relative">
          {!!count && (
            <span className="absolute -top-1.5 right-7 whitespace-nowrap rounded-sm border border-alpha-4 bg-red-1 px-1.5 py-0.5 text-xs text-fg-1">
              {count}
            </span>
          )}
          <BellIcon className="w-7" />
        </div>
      }
      scroll={false}
    />
  );
};

export default NotificationsButton;
