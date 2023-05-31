import { ReactNode } from 'react';
import Button, { ButtonProps } from './button';
import Spinner from './spinner';

interface IconButtonProps extends ButtonProps {
  icon: ReactNode;
  label?: string;
}

const IconButton = ({
  icon,
  label,
  loading,
  loadingText,
  ...props
}: IconButtonProps) => (
  <Button disabled={loading} variant="link" {...props}>
    {loading ? <Spinner loadingText={loadingText} /> : icon}
    {label && <span className="sr-only">{label}</span>}
  </Button>
);

export default IconButton;
