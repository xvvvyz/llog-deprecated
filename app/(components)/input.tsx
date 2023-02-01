import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  right?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, right, type, ...rest }, ref) => (
    <div className="relative">
      <input
        className={twMerge('input', right && 'pr-[2.4rem]', className)}
        ref={ref}
        type={type ?? 'text'}
        {...rest}
      />
      {right && (
        <div className="absolute right-0 top-0 flex h-full w-[2.4rem] items-center justify-center">
          {right}
        </div>
      )}
    </div>
  )
);

Input.displayName = 'Input';
export default Input;
