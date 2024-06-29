import BackIconButton from '@/_components/back-icon-button';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface PageModalHeaderProps {
  className?: string;
  link?: ReactNode;
  onClose?: () => void;
  title: string | null;
}

const PageModalHeader = ({
  className,
  link,
  onClose,
  title,
}: PageModalHeaderProps) => (
  <div
    className={twMerge(
      'flex h-20 items-center justify-between gap-8 px-4 sm:px-8',
      className,
    )}
  >
    <div>
      {title && <h1 className="truncate text-xl">{title}</h1>}
      {link}
    </div>
    <BackIconButton
      className="relative right-1 shrink-0"
      icon={<XMarkIcon className="w-7" />}
      onClick={onClose}
    />
  </div>
);

export default PageModalHeader;
