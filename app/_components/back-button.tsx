'use client';

import Button, { ButtonProps } from '@/_components/button';
import { useRouter } from 'next/navigation';

const BackButton = ({ onClick, ...rest }: ButtonProps) => {
  const router = useRouter();
  return <Button onClick={onClick ?? router.back} {...rest} />;
};

export default BackButton;
