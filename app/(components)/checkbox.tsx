import { CheckIcon } from '@heroicons/react/24/outline';
import { forwardRef, InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

const Checkbox = forwardRef<
  HTMLInputElement,
  Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>
>(({ className, value, ...rest }, ref) => (
  <>
    <input
      className="peer absolute h-6 w-6 opacity-0"
      defaultChecked={Boolean(value)}
      ref={ref}
      type="checkbox"
      value={value}
      {...rest}
    />
    <span
      className={twMerge(
        'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-sm border border-alpha-2 bg-alpha-2 text-bg-1 transition-colors peer-checked:bg-accent-1 peer-hover:border-alpha-3 peer-focus:ring-1 peer-focus:ring-accent-2 peer-focus:ring-offset-4 peer-focus:ring-offset-bg-2 peer-checked:[&>svg]:visible',
        className
      )}
    >
      <CheckIcon className="invisible h-5 w-5" />
    </span>
  </>
));

Checkbox.displayName = 'Checkbox';
export default Checkbox;
