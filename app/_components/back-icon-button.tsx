'use client';

import IconButton, { IconButtonProps } from '@/_components/icon-button';
import { useRouter } from 'next/navigation';

const BackIconButton = ({ onClick, ...rest }: IconButtonProps) => {
  const router = useRouter();
  return <IconButton onClick={onClick ?? router.back} {...rest} />;
};

export default BackIconButton;
