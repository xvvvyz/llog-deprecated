import { forwardRef, InputHTMLAttributes, ReactNode, Ref } from 'react';
import { twMerge } from 'tailwind-merge';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  right?: ReactNode;
}

const Input = forwardRef(
  (
    { className, id, label, right, type, name, ...rest }: InputProps,
    ref: Ref<HTMLInputElement>
  ) => (
    <div className="group relative w-full">
      {label && (
        <label className="label" htmlFor={id ?? name}>
          {label}
        </label>
      )}
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
  )
);

Input.displayName = 'Input';
export default Input;
