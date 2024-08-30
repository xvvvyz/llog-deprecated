import * as Modal from '@/_components/modal';
import PageModalBackIconButton from '@/_components/page-modal-back-icon-button';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface PageModalHeaderProps {
  className?: string;
  onClose?: () => void;
  right?: ReactNode;
  subtitle?: ReactNode;
  title?: ReactNode;
}

const PageModalHeader = ({
  className,
  onClose,
  right,
  subtitle,
  title,
}: PageModalHeaderProps) => (
  <div
    className={twMerge(
      'flex items-start justify-between gap-8 px-4 py-6 sm:px-8',
      className,
    )}
  >
    <div className="min-w-0">
      {title && (
        <Modal.Title className="-mb-1 truncate text-xl">{title}</Modal.Title>
      )}
      {subtitle}
    </div>
    <div className="relative right-1 top-0 flex shrink-0 items-center gap-6">
      {right}
      <PageModalBackIconButton
        icon={<XMarkIcon className="w-7" />}
        onClick={onClose}
      />
    </div>
  </div>
);

export default PageModalHeader;
