'use client';

import Button from '@/_components/button';
import Spinner from '@/_components/spinner';
import * as React from 'react';
import { useFormStatus } from 'react-dom';
import { twMerge } from 'tailwind-merge';

interface IconButtonProps
  extends React.ComponentPropsWithoutRef<typeof Button> {
  icon: React.ReactNode;
  label?: string;
  spinnerClassName?: string;
}

const IconButton = React.forwardRef<
  React.ComponentRef<typeof Button>,
  IconButtonProps
>(
  (
    {
      className,
      icon,
      label,
      loading,
      loadingText,
      spinnerClassName,
      type,
      ...props
    }: IconButtonProps,
    ref,
  ) => {
    const { pending } = useFormStatus();

    return (
      <Button
        className={twMerge('shrink-0', className)}
        disabled={loading || pending}
        ref={ref}
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
  },
);

IconButton.displayName = 'IconButton';

export default IconButton;
