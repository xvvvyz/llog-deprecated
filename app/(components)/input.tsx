import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value'> {
  right?: ReactNode;
  value?: string | null;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, right, type, value, ...rest }, ref) => (
    <div className="relative">
      <input
        className={twMerge('input', right && 'pr-[2.4rem]', className)}
        ref={ref}
        type={type ?? 'text'}
        value={value ?? undefined}
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
