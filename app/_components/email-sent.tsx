import EnvelopeOpenIcon from '@heroicons/react/24/solid/EnvelopeOpenIcon';
import { ReactNode } from 'react';

interface ConfirmationProps {
  children: ReactNode;
}

const EmailSent = ({ children }: ConfirmationProps) => (
  <>
    <EnvelopeOpenIcon className="w-12" />
    <p className="text-center">
      {children}
      <br />
      <span className="text-fg-4">You can close this tab.</span>
    </p>
  </>
);

export default EmailSent;
