'use client';

import { ButtonProps } from '(components)/button';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useSearchParams } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import IconButton from './icon-button';

const BackButton = ({ className, href, ...rest }: ButtonProps) => {
  const searchParams = useSearchParams();

  return (
    <IconButton
      href={searchParams.get('back') ?? href}
      icon={
        <ArrowLeftIcon
          className={twMerge('relative -left-[0.18em] w-7', className)}
        />
      }
      label="Back"
      {...rest}
    />
  );
};

export default BackButton;
