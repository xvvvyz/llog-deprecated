'use client';

import Button, { ButtonProps } from '@/_components/button';
import { useSearchParams } from 'next/navigation';

const ForwardSearchParamsLink = ({ href, ...rest }: ButtonProps) => {
  const searchParams = useSearchParams();

  return (
    <Button
      href={`${href}?${searchParams.toString()}`}
      variant="link"
      {...rest}
    >
      Forgot your password?
    </Button>
  );
};

export default ForwardSearchParamsLink;
