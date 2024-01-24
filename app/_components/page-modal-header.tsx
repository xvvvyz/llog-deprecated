import IconButton from '@/_components/icon-button';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';

interface PageModalHeaderProps {
  back?: string;
  onClose?: () => void;
  title: string;
}

const PageModalHeader = ({ back, onClose, title }: PageModalHeaderProps) => (
  <div className="flex h-20 items-center justify-between gap-8 px-4 sm:px-8">
    <h1 className="truncate text-xl">{title}</h1>
    <IconButton
      className="relative right-1 shrink-0"
      href={back}
      icon={<XMarkIcon className="w-7" />}
      onClick={onClose}
      scroll={false}
    />
  </div>
);

export default PageModalHeader;
