import CheckIcon from '@heroicons/react/24/outline/CheckIcon';
import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, name, ...rest }, ref) => (
    <div
      className={twMerge(
        'input relative flex items-center justify-between gap-4 pr-2',
        className,
      )}
    >
      <input
        className="peer absolute inset-0 opacity-0"
        id={name}
        name={name}
        ref={ref}
        type="checkbox"
        {...rest}
      />
      <div
        className={twMerge(
          'text-fg-4 transition-colors peer-checked:text-fg-2',
          !label && 'after:content-["No"] peer-checked:after:content-["Yes"]',
        )}
      >
        {label && <label htmlFor={name}>{label}</label>}
      </div>
      <CheckIcon className="relative -z-10 h-5 w-5 shrink-0 stroke-fg-2 opacity-0 transition-opacity peer-checked:opacity-100" />
    </div>
  ),
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
