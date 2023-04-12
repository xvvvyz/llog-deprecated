import { twMerge } from 'tailwind-merge';

interface SpinnerProps {
  className?: string;
  color?: string;
  loadingText?: string;
}

const Spinner = ({
  className,
  color = 'border-fg-2',
  loadingText,
}: SpinnerProps) => (
  <div
    className={twMerge('flex h-5 w-5 items-center justify-center', className)}
  >
    <div
      aria-busy
      aria-label={loadingText}
      className={twMerge(
        'h-[0.9rem] w-[0.9rem] animate-spin rounded-full border-2',
        color,
        'border-l-transparent'
      )}
      role="alert"
    />
  </div>
);

export default Spinner;
