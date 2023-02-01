'use client';

import { ButtonProps } from '(components)/button';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useSearchParams } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import IconButton from './icon-button';

const BackButton = ({ className, href }: ButtonProps) => {
  const searchParams = useSearchParams();

  return (
    <IconButton
      href={searchParams.get('back') ?? href}
      icon={
        <ArrowLeftIcon className={twMerge('relative -left-1 w-9', className)} />
      }
      label="Back"
    />
  );
};

export default BackButton;
