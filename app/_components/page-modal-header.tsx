import BackIconButton from '@/_components/back-icon-button';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface PageModalHeaderProps {
  className?: string;
  menu?: ReactNode;
  onClose?: () => void;
  subtitle?: ReactNode;
  title?: ReactNode;
}

const PageModalHeader = ({
  className,
  menu,
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
    <div className="relative -top-0.5 right-1 flex shrink-0 gap-6">
      {menu}
      <BackIconButton icon={<XMarkIcon className="w-7" />} onClick={onClose} />
    </div>
  </div>
);

export default PageModalHeader;
