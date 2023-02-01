import { twMerge } from 'tailwind-merge';

interface SpinnerProps {
  className?: string;
  loadingText?: string;
}

const Spinner = ({ className, loadingText }: SpinnerProps) => (
  <div
    aria-busy
    aria-label={loadingText}
    className={twMerge(
      'h-4 w-4 animate-spin rounded-full border-2 border-fg-2 border-l-transparent',
      className
    )}
    role="alert"
  />
);

export default Spinner;
