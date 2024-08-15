'use client';

import Button, { ButtonProps } from '@/_components/button';
import * as Modal from '@/_components/modal';
import { useRouter } from 'next/navigation';

const PageModalBackButton = ({ onClick, ...rest }: ButtonProps) => {
  const router = useRouter();

  return (
    <Modal.Close asChild onClick={(e) => e.preventDefault()}>
      <Button onClick={onClick ?? router.back} {...rest} />
    </Modal.Close>
  );
};

export default PageModalBackButton;
