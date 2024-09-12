'use client';

import Button from '@/_components/button';
import Input from '@/_components/input';
import InputRoot from '@/_components/input-root';
import * as Label from '@/_components/label';
import updatePassword from '@/_mutations/update-password';
import { useActionState } from 'react';

const ChangePasswordForm = () => {
  const [state, action] = useActionState(updatePassword, null);

  return (
    <form action={action} className="flex flex-col gap-8">
      <InputRoot>
        <Label.Root htmlFor="password">New password</Label.Root>
        <Input minLength={6} name="password" required type="password" />
      </InputRoot>
      {state?.error && <p className="text-center">{state.error}</p>}
      <Button
        className="mt-8 w-full"
        loadingText="Changing password…"
        type="submit"
      >
        Change password
      </Button>
    </form>
  );
};

export default ChangePasswordForm;
