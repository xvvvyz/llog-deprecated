import { forwardRef, InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value'> {
  value?: string | null;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, value, ...rest }, ref) => (
    <input
      className={twMerge('input', className)}
      ref={ref}
      type={type ?? 'text'}
      value={value ?? undefined}
      {...rest}
    />
  )
);

Input.displayName = 'Input';
export default Input;
