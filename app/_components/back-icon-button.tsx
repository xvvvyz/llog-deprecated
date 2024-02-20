'use client';

import IconButton, { IconButtonProps } from '@/_components/icon-button';
import { useSearchParams } from 'next/navigation';

const BackButton = (props: IconButtonProps) => {
  const searchParams = useSearchParams();

  return (
    <IconButton
      href={props.onClick ? undefined : searchParams.get('back') ?? undefined}
      scroll={false}
      {...props}
    />
  );
};

export default BackButton;
