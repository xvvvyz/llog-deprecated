'use client';

import Button from '@/_components/button';
import Spinner from '@/_components/spinner';
import { ComponentProps, ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import { twMerge } from 'tailwind-merge';

interface IconButtonProps extends ComponentProps<typeof Button> {
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
      className={twMerge('shrink-0', className)}
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
