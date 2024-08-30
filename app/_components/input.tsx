import Tip from '@/_components/tip';
import { forwardRef, InputHTMLAttributes, ReactNode, Ref } from 'react';
import { useFormStatus } from 'react-dom';
import { twMerge } from 'tailwind-merge';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  tooltip?: ReactNode;
}

const Input = forwardRef(
  (
    {
      className,
      disabled,
      id,
      label,
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
            <Tip className="relative -top-1 -mr-1" side="left">
              {tooltip}
            </Tip>
          )}
        </div>
        <input
          autoComplete="off"
          className={twMerge('input', className)}
          disabled={disabled || pending}
          id={id ?? name}
          name={name}
          ref={ref}
          type={type ?? 'text'}
          {...rest}
        />
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
