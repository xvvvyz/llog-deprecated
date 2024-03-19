'use client';

import Button from '@/_components/button';
import Input from '@/_components/input';
import forgotPassword from '@/_mutations/forgot-password';
import { useFormState } from 'react-dom';

const ForgotPasswordForm = () => {
  const [state, action] = useFormState(forgotPassword, null);

  return (
    <form action={action} className="flex flex-col gap-6">
      <Input label="Email address" name="email" required type="email" />
      {state?.error && <p className="text-center">{state.error}</p>}
      <Button className="mt-8 w-full" loadingText="Sending link…" type="submit">
        Send reset link
      </Button>
    </form>
  );
};

export default ForgotPasswordForm;
