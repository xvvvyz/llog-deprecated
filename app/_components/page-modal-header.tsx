import BackIconButton from '@/_components/back-icon-button';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface PageModalHeaderProps {
  className?: string;
  onClose?: () => void;
  subtitle?: ReactNode;
  title?: ReactNode;
}

const PageModalHeader = ({
  className,
  onClose,
  subtitle,
  title,
}: PageModalHeaderProps) => (
  <div
    className={twMerge(
      'flex items-start justify-between gap-8 px-4 pb-6 pt-8 sm:px-8',
      className,
    )}
  >
    <div className="min-w-0">
      {title && <h1 className="-my-1 truncate text-xl">{title}</h1>}
      {subtitle}
    </div>
    <BackIconButton
      className="relative -top-1 right-1 shrink-0"
      icon={<XMarkIcon className="w-7" />}
      onClick={onClose}
    />
  </div>
);

export default PageModalHeader;
