import Tooltip from '@/(account)/_components/tooltip';
import { forwardRef, InputHTMLAttributes, ReactNode, Ref } from 'react';
import { twMerge } from 'tailwind-merge';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  right?: ReactNode;
  tooltip?: ReactNode;
}

const Input = forwardRef(
  (
    { className, id, label, right, type, name, tooltip, ...rest }: InputProps,
    ref: Ref<HTMLInputElement>,
  ) => (
    <div className="group relative w-full">
      <div className="flex justify-between">
        {label && (
          <label className="label" htmlFor={id ?? name}>
            {label}
          </label>
        )}
        {tooltip && (
          <Tooltip
            className="relative -top-1 -mr-[0.15rem]"
            id={`${name}-tooltip`}
            tip={tooltip}
          />
        )}
      </div>
      <input
        autoComplete="off"
        className={twMerge('input', right && 'pr-[2.4rem]', className)}
        id={id ?? name}
        name={name}
        ref={ref}
        type={type ?? 'text'}
        {...rest}
      />
      {right && (
        <div className="absolute right-0 top-0 flex h-[2.625rem] w-[2.4rem] items-center justify-center">
          {right}
        </div>
      )}
    </div>
  ),
);

Input.displayName = 'Input';
export default Input;
