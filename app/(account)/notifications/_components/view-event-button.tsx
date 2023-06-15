'use client';

import Button from '@/_components/button';
import useSupabase from '@/_hooks/use-supabase';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface ViewEventButtonProps {
  children: ReactNode;
  href: string;
  notificationIds: string[];
  notificationRead: boolean;
}

const ViewEventButton = ({
  children,
  href,
  notificationIds,
  notificationRead,
}: ViewEventButtonProps) => {
  const router = useRouter();
  const supabase = useSupabase();

  return (
    <Button
      className="mx-0 mt-0 line-clamp-2 w-full items-start justify-between gap-4 px-0"
      href={href}
      onClick={async () => {
        if (notificationRead) return;

        await supabase
          .from('notifications')
          .update({ read: true })
          .in('id', notificationIds);

        router.refresh();
      }}
      variant="link"
    >
      <span>{children}</span>
      <ArrowRightIcon className="mt-0.5 w-5 shrink-0" />
    </Button>
  );
};

export default ViewEventButton;
