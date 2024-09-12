import { forwardRef, InputHTMLAttributes } from 'react';
import { useFormStatus } from 'react-dom';
import { twMerge } from 'tailwind-merge';

const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, disabled, id, name, type, ...rest }, ref) => {
  const { pending } = useFormStatus();

  return (
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
  );
});

Input.displayName = 'Input';

export default Input;
