import IconButton from '@/_components/icon-button';
import * as Modal from '@/_components/modal';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface PageModalHeaderProps {
  className?: string;
  closeHref?: string;
  onClose?: () => void;
  right?: ReactNode;
  subtitle?: ReactNode;
  title?: ReactNode;
}

const PageModalHeader = ({
  className,
  closeHref,
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
      <Modal.Close asChild>
        <IconButton
          href={closeHref}
          icon={<XMarkIcon className="w-7" />}
          label="Close"
          onClick={onClose}
        />
      </Modal.Close>
    </div>
  </div>
);

export default PageModalHeader;
