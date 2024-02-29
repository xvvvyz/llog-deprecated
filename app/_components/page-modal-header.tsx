import BackIconButton from '@/_components/back-icon-button';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import { twMerge } from 'tailwind-merge';

interface PageModalHeaderProps {
  className?: string;
  onClose?: () => void;
  title: string;
}

const PageModalHeader = ({
  className,
  onClose,
  title,
}: PageModalHeaderProps) => (
  <div
    className={twMerge(
      'flex h-20 items-center justify-between gap-8 px-4 sm:px-8',
      className,
    )}
  >
    <h1 className="truncate text-xl">{title}</h1>
    <BackIconButton
      className="relative right-1 shrink-0"
      icon={<XMarkIcon className="w-7" />}
      onClick={onClose}
    />
  </div>
);

export default PageModalHeader;
