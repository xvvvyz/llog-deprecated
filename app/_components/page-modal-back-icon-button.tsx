'use client';

import IconButton from '@/_components/icon-button';
import * as Modal from '@/_components/modal';
import { useRouter } from 'next/navigation';
import { ComponentProps } from 'react';

const PageModalBackIconButton = ({
  onClick,
  ...rest
}: ComponentProps<typeof IconButton>) => {
  const router = useRouter();

  return (
    <Modal.Close asChild onClick={(e) => e.preventDefault()}>
      <IconButton onClick={onClick ?? router.back} {...rest} />
    </Modal.Close>
  );
};

export default PageModalBackIconButton;
