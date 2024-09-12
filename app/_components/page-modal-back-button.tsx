'use client';

import Button from '@/_components/button';
import * as Modal from '@/_components/modal';
import { useRouter } from 'next/navigation';
import { ComponentProps } from 'react';

const PageModalBackButton = ({
  onClick,
  ...rest
}: ComponentProps<typeof Button>) => {
  const router = useRouter();

  return (
    <Modal.Close asChild onClick={(e) => e.preventDefault()}>
      <Button onClick={onClick ?? router.back} {...rest} />
    </Modal.Close>
  );
};

export default PageModalBackButton;
