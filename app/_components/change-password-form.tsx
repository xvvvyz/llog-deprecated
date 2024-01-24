'use client';

import updatePassword from '@/_actions/update-password';
import Button from '@/_components/button';
import Input from '@/_components/input';
import { useFormState } from 'react-dom';

const ChangePasswordForm = () => {
  const [state, action] = useFormState(updatePassword, null);

  return (
    <form action={action} className="flex flex-col gap-6">
      <Input
        label="New password"
        minLength={6}
        name="password"
        required
        type="password"
      />
      <Button
        className="mt-8 w-full"
        loadingText="Changing password…"
        type="submit"
      >
        Change password
      </Button>
      {state?.error && <p className="text-center">{state.error}</p>}
    </form>
  );
};

export default ChangePasswordForm;
