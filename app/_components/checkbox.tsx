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
    {
      disabled,
      className,
      label,
      name,
      tooltip,
      value,
      ...rest
    }: CheckboxProps,
    ref: Ref<HTMLInputElement>,
  ) => (
    <div
      className={twMerge(
        'flex items-center gap-4',
        disabled && 'disabled',
        className,
      )}
    >
      <label className="input group flex select-none items-center justify-between gap-4 bg-transparent py-4 hover:bg-alpha-1 active:bg-alpha-1">
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
        <span className="label p-0 peer-checked:text-fg-2">{label}</span>
        <span className="box-content inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-sm border border-alpha-2 bg-alpha-3 text-bg-1 transition-colors peer-checked:bg-accent-1 peer-hover:border-alpha-3 peer-hover:bg-alpha-4 peer-checked:peer-hover:bg-accent-2 peer-checked:[&>svg]:visible">
          <CheckIcon className="invisible h-5 w-5" />
        </span>
      </label>
      {tooltip && (
        <Tip className="-mr-[0.2rem]" side="left">
          {tooltip}
        </Tip>
      )}
    </div>
  ),
);

Checkbox.displayName = 'Checkbox';
export default Checkbox;
