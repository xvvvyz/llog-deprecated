import { CheckIcon } from '@heroicons/react/24/outline';
import { forwardRef, InputHTMLAttributes, Ref } from 'react';
import { twMerge } from 'tailwind-merge';

interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

const Checkbox = forwardRef(
  (
    { className, label, name, value, ...rest }: CheckboxProps,
    ref: Ref<HTMLInputElement>,
  ) => (
    <label
      className={twMerge('input group flex select-none gap-4 py-4', className)}
    >
      <input
        className="peer absolute h-6 w-6 opacity-0"
        defaultChecked={Boolean(value)}
        id={name}
        name={name}
        ref={ref}
        type="checkbox"
        value={value}
        {...rest}
      />
      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-sm border border-alpha-2 bg-alpha-3 text-bg-1 transition-colors peer-checked:bg-accent-1 peer-hover:border-alpha-3 peer-hover:bg-alpha-4 peer-checked:peer-hover:bg-accent-2 peer-checked:[&>svg]:visible">
        <CheckIcon className="invisible h-5 w-5" />
      </span>
      <span className="label p-0 peer-checked:text-fg-1">{label}</span>
    </label>
  ),
);

Checkbox.displayName = 'Checkbox';
export default Checkbox;
