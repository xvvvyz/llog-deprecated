'use client';

import Button from '@/_components/button';
import ArrowUpRightIcon from '@heroicons/react/24/outline/ArrowUpRightIcon';
import { useSearchParams } from 'next/navigation';

interface ViewAllSessionsButtonProps {
  isPublic?: boolean;
  missionId: string;
  subjectId: string;
}

const ViewAllSessionsButton = ({
  isPublic,
  missionId,
  subjectId,
}: ViewAllSessionsButtonProps) => {
  const searchParams = useSearchParams();
  if (searchParams.get('fromSessions')) return null;
  const shareOrSubjects = isPublic ? 'share' : 'subjects';

  return (
    <div className="-mt-6 !border-t-0 px-4 pb-8 sm:px-8">
      <Button
        href={`/${shareOrSubjects}/${subjectId}/training-plans/${missionId}/sessions`}
        variant="link"
      >
        View all sessions
        <ArrowUpRightIcon className="w-5" />
      </Button>
    </div>
  );
};

export default ViewAllSessionsButton;
