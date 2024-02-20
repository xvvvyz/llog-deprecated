'use client';

import Button, { ButtonProps } from '@/_components/button';
import { useSearchParams } from 'next/navigation';

const BackButton = (props: ButtonProps) => {
  const searchParams = useSearchParams();

  return (
    <Button
      href={props.onClick ? undefined : searchParams.get('back') ?? undefined}
      scroll={false}
      {...props}
    />
  );
};

export default BackButton;
