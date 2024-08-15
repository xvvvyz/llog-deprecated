import Tip from '@/_components/tip';
import CheckIcon from '@heroicons/react/24/outline/CheckIcon';
import { forwardRef, InputHTMLAttributes, ReactNode, Ref } from 'react';
import { twMerge } from 'tailwind-merge';

interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  tooltip?: ReactNode;
}

const Checkbox = forwardRef(
  (
    { className, label, name, tooltip, ...rest }: CheckboxProps,
    ref: Ref<HTMLInputElement>,
  ) => (
    <div className={twMerge('relative', className)}>
      <label className="group w-full cursor-pointer">
        {label && <span className="label">{label}</span>}
        <div className="input group flex select-none items-center justify-between gap-4 pr-2">
          <input
            className="peer absolute h-6 w-6 opacity-0"
            id={name}
            name={name}
            ref={ref}
            type="checkbox"
            {...rest}
          />
          <span className="text-fg-4 transition-colors after:content-['No'] peer-checked:text-fg-2 peer-checked:after:content-['Yes']" />
          <CheckIcon className="h-5 w-5 stroke-fg-2 opacity-0 transition-opacity peer-checked:opacity-100" />
        </div>
      </label>
      {tooltip && (
        <Tip className="absolute right-[0.55rem] top-px" side="left">
          {tooltip}
        </Tip>
      )}
    </div>
  ),
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
