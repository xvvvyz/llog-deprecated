'use client';

import Button from '@/_components/button';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { useToggle } from '@uidotdev/usehooks';
import { ReactNode } from 'react';

interface DownloadEventsButtonProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  subjectId: string;
}

const DownloadEventsButton = ({
  children,
  className,
  disabled,
  subjectId,
}: DownloadEventsButtonProps) => {
  const [isDownloading, toggleIsDownloading] = useToggle(false);

  return (
    <Button
      colorScheme="transparent"
      className={className}
      disabled={disabled || isDownloading}
      onClick={async () => {
        toggleIsDownloading();
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const r = await fetch(`/subjects/${subjectId}/events.csv?tz=${tz}`);
        const blob = await r.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'events.csv';
        a.click();
        toggleIsDownloading();
      }}
      size="sm"
    >
      <ArrowDownTrayIcon className="w-5" />
      {children}
    </Button>
  );
};

export default DownloadEventsButton;
