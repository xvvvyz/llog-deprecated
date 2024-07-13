'use client';

import Button from '@/_components/button';
import Input from '@/_components/input';
import forgotPassword from '@/_mutations/forgot-password';
import { useActionState } from 'react';

const ForgotPasswordForm = () => {
  const [state, action] = useActionState(forgotPassword, {
    defaultValues: { email: '' },
    error: '',
  });

  return (
    <form action={action} className="flex flex-col gap-8">
      <Input
        defaultValue={state.defaultValues.email}
        label="Email address"
        name="email"
        required
        type="email"
      />
      {state.error && <p className="text-center">{state.error}</p>}
      <Button className="mt-8 w-full" loadingText="Sending link…" type="submit">
        Send reset link
      </Button>
    </form>
  );
};

export default ForgotPasswordForm;
