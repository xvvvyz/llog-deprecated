'use client';

import Button from '@/_components/button';
import Input from '@/_components/input';
import InputRoot from '@/_components/input-root';
import * as Label from '@/_components/label';
import forgotPassword from '@/_mutations/forgot-password';
import { useActionState } from 'react';

const ForgotPasswordForm = () => {
  const [state, action] = useActionState(forgotPassword, {
    defaultValues: { email: '' },
    error: '',
  });

  return (
    <form action={action} className="flex flex-col gap-8">
      <InputRoot>
        <Label.Root>Email address</Label.Root>
        <Input
          defaultValue={state.defaultValues.email}
          name="email"
          required
          type="email"
        />
      </InputRoot>
      {state.error && <p className="text-center">{state.error}</p>}
      <Button className="mt-8 w-full" loadingText="Sending link…" type="submit">
        Send reset link
      </Button>
    </form>
  );
};

export default ForgotPasswordForm;
