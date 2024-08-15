'use client';

import Button, { ButtonProps } from '@/_components/button';
import Spinner from '@/_components/spinner';
import { ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import { twMerge } from 'tailwind-merge';

export interface IconButtonProps extends ButtonProps {
  icon: ReactNode;
  label?: string;
  spinnerClassName?: string;
}

const IconButton = ({
  className,
  icon,
  label,
  loading,
  loadingText,
  spinnerClassName,
  type,
  ...props
}: IconButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <Button
      className={twMerge('print:hidden', className)}
      disabled={loading || pending}
      type={type}
      variant="link"
      {...props}
    >
      {loading || (type === 'submit' && pending) ? (
        <Spinner className={spinnerClassName} loadingText={loadingText} />
      ) : (
        icon
      )}
      {label && <span className="sr-only">{label}</span>}
    </Button>
  );
};

export default IconButton;
