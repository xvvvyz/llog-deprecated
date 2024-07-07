import Tip from '@/_components/tip';
import { forwardRef, InputHTMLAttributes, ReactNode, Ref } from 'react';
import { useFormStatus } from 'react-dom';
import { twMerge } from 'tailwind-merge';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  right?: ReactNode;
  tooltip?: ReactNode;
}

const Input = forwardRef(
  (
    {
      className,
      disabled,
      id,
      label,
      right,
      type,
      name,
      tooltip,
      ...rest
    }: InputProps,
    ref: Ref<HTMLInputElement>,
  ) => {
    const { pending } = useFormStatus();

    return (
      <div className="group relative w-full">
        <div className="flex justify-between">
          {label && (
            <label className="label" htmlFor={id ?? name}>
              {label}
            </label>
          )}
          {tooltip && (
            <Tip className="relative -top-1 -mr-[0.2rem]" side="left">
              {tooltip}
            </Tip>
          )}
        </div>
        <input
          autoComplete="off"
          className={twMerge('input', right && 'pr-[2.4rem]', className)}
          disabled={disabled || pending}
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
    );
  },
);

Input.displayName = 'Input';
export default Input;
