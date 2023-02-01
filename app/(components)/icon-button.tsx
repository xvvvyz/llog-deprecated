import { ReactNode } from 'react';
import Button, { ButtonProps } from './button';
import Spinner from './spinner';

interface IconButtonProps extends ButtonProps {
  icon: ReactNode;
  label: string;
}

const IconButton = ({
  icon,
  label,
  loading,
  loadingText,
  ...props
}: IconButtonProps) =>
  loading ? (
    <Spinner loadingText={loadingText} />
  ) : (
    <Button type="submit" variant="link" {...props}>
      {icon}
      <span className="sr-only">{label}</span>
    </Button>
  );

export default IconButton;
