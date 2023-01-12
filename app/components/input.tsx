import { forwardRef, InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...rest }, ref) => (
  <input
    className={twMerge('input', className)}
    ref={ref}
    type={type ?? 'text'}
    {...rest}
  />
));

Input.displayName = 'Input';
export default Input;
