import { forwardRef, InputHTMLAttributes, ReactNode, Ref } from 'react';
import { twMerge } from 'tailwind-merge';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  disabled?: boolean;
  label?: ReactNode;
  right?: ReactNode;
}

const Input = forwardRef(
  (
    { className, disabled, label, right, type, name, ...rest }: InputProps,
    ref: Ref<HTMLInputElement>
  ) => (
    <div className={twMerge('group relative w-full', disabled && 'disabled')}>
      {label && (
        <label className="label" htmlFor={name}>
          {label}
        </label>
      )}
      <input
        autoComplete="off"
        className={twMerge('input', right && 'pr-[2.4rem]', className)}
        disabled={disabled}
        id={name}
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
  )
);

Input.displayName = 'Input';
export default Input;
