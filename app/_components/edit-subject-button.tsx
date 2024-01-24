'use client';

import Button from '@/_components/button';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import { usePathname } from 'next/navigation';

interface EditSubjectButtonProps {
  subjectId: string;
}

const EditSubjectButton = ({ subjectId }: EditSubjectButtonProps) => {
  const pathname = usePathname();

  return (
    <Button
      href={`/subjects/${subjectId}/edit?back=${pathname}`}
      scroll={false}
      variant="link"
    >
      <PencilIcon className="w-5" />
      Edit
    </Button>
  );
};

export default EditSubjectButton;
