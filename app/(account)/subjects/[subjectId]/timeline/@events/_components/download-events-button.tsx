'use client';

import Button from '@/_components/button';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { useBoolean } from 'usehooks-ts';

interface DownloadEventsButtonProps {
  disabled?: boolean;
  subjectId: string;
}

const DownloadEventsButton = ({
  disabled,
  subjectId,
}: DownloadEventsButtonProps) => {
  const isDownloading = useBoolean(false);

  return (
    <Button
      className="w-[12rem]"
      colorScheme="transparent"
      disabled={disabled}
      loading={isDownloading.value}
      loadingText="Downloading…"
      onClick={async () => {
        isDownloading.setTrue();
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const r = await fetch(
          `/subjects/${subjectId}/events.csv?tz=${tz}&download=true`,
        );

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
      Download events
    </Button>
  );
};

export default DownloadEventsButton;
