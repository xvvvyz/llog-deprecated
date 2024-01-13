'use client';

import Button from '@/_components/button';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { useToggle } from '@uidotdev/usehooks';

interface DownloadEventsButtonProps {
  isPublic?: boolean;
  subjectId: string;
}

const DownloadEventsButton = ({
  isPublic,
  subjectId,
}: DownloadEventsButtonProps) => {
  const [isDownloading, toggleIsDownloading] = useToggle(false);

  return (
    <Button
      disabled={isDownloading}
      onClick={async () => {
        toggleIsDownloading();
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const shareOrSubjects = isPublic ? 'share' : 'subjects';

        const r = await fetch(
          `/${shareOrSubjects}/${subjectId}/events.csv?tz=${tz}`,
        );

        const blob = await r.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'events.csv';
        a.click();
        toggleIsDownloading();
      }}
      variant="link"
    >
      <ArrowDownTrayIcon className="w-5" />
      Export
    </Button>
  );
};

export default DownloadEventsButton;
