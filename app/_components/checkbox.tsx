import CheckIcon from '@heroicons/react/24/outline/CheckIcon';
import { forwardRef, InputHTMLAttributes, ReactNode, Ref } from 'react';
import { twMerge } from 'tailwind-merge';

interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  inputClassName?: string;
  label?: ReactNode;
  labelInside?: boolean;
  right?: ReactNode;
}

const Checkbox = forwardRef(
  (
    {
      className,
      inputClassName,
      label,
      labelInside,
      name,
      right,
      ...rest
    }: CheckboxProps,
    ref: Ref<HTMLInputElement>,
  ) => (
    <div className={twMerge('relative', className)}>
      <label className="group w-full cursor-pointer">
        {label && !labelInside && <span className="label">{label}</span>}
        <div
          className={twMerge(
            'input group flex items-center justify-between gap-4 pr-2',
            inputClassName,
          )}
        >
          <input
            className="peer absolute h-6 w-6 opacity-0"
            id={name}
            name={name}
            ref={ref}
            type="checkbox"
            {...rest}
          />
          <div
            className={twMerge(
              'text-fg-4 transition-colors peer-checked:text-fg-2',
              (!label || !labelInside) &&
                'after:content-["No"] peer-checked:after:content-["Yes"]',
            )}
          >
            {label && labelInside && label}
          </div>
          <CheckIcon className="h-5 w-5 shrink-0 stroke-fg-2 opacity-0 transition-opacity peer-checked:opacity-100" />
        </div>
      </label>
      {right && <div className="absolute right-[0.55rem] top-px">{right}</div>}
    </div>
  ),
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
