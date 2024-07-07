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
    <Button
      className="pt-4"
      href={`/${shareOrSubjects}/${subjectId}/training-plans/${missionId}/sessions`}
      scroll={false}
      variant="link"
    >
      View all sessions
      <ArrowUpRightIcon className="w-5" />
    </Button>
  );
};

export default ViewAllSessionsButton;
