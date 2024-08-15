'use client';

import IconButton, { IconButtonProps } from '@/_components/icon-button';
import * as Modal from '@/_components/modal';
import { useRouter } from 'next/navigation';

const PageModalBackIconButton = ({ onClick, ...rest }: IconButtonProps) => {
  const router = useRouter();

  return (
    <Modal.Close asChild onClick={(e) => e.preventDefault()}>
      <IconButton onClick={onClick ?? router.back} {...rest} />
    </Modal.Close>
  );
};

export default PageModalBackIconButton;
