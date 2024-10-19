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
        'input relative flex items-center gap-2.5 pr-2 group-hover:bg-alpha-2',
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
      <div className="relative -z-10 -ml-1.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-alpha-1 bg-alpha-1 text-transparent transition-colors peer-checked:bg-accent-1 peer-checked:text-bg-1">
        <CheckIcon className="w-4 stroke-2" />
      </div>
      <div
        className={twMerge(
          'text-fg-4 transition-colors peer-checked:text-fg-2',
          !label && 'after:content-["No"] peer-checked:after:content-["Yes"]',
        )}
      >
        {label && <label htmlFor={name}>{label}</label>}
      </div>
    </div>
  ),
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
