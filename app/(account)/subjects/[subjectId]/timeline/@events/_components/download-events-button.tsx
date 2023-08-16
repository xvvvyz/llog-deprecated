'use client';

import Button from '@/_components/button';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { ReactNode } from 'react';
import { useBoolean } from 'usehooks-ts';

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
  const isDownloading = useBoolean(false);

  return (
    <Button
      colorScheme="transparent"
      className={className}
      disabled={disabled || isDownloading.value}
      onClick={async () => {
        isDownloading.setTrue();
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const r = await fetch(`/subjects/${subjectId}/events.csv?tz=${tz}`);
        const blob = await r.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'events.csv';
        a.click();
        isDownloading.setFalse();
      }}
      size="sm"
    >
      <ArrowDownTrayIcon className="w-5" />
      {children}
    </Button>
  );
};

export default DownloadEventsButton;
