'use client';

import { ReactNode } from 'react';
import { experimental_useFormStatus as useFormStatus } from 'react-dom';
import Button, { ButtonProps } from './button';
import Spinner from './spinner';

interface IconButtonProps extends ButtonProps {
  icon: ReactNode;
  label?: string;
  spinnerClassName?: string;
}

const IconButton = ({
  icon,
  label,
  loading,
  loadingText,
  spinnerClassName,
  ...props
}: IconButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <Button disabled={loading || pending} variant="link" {...props}>
      {loading || pending ? (
        <Spinner className={spinnerClassName} loadingText={loadingText} />
      ) : (
        icon
      )}
      {label && <span className="sr-only">{label}</span>}
    </Button>
  );
};

export default IconButton;
