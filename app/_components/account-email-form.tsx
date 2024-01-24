'use client';

import updateAccount from '@/_actions/update-account';
import Button from '@/_components/button';
import Input from '@/_components/input';
import { User } from '@supabase/supabase-js';
import { useFormState } from 'react-dom';

interface AccountEmailFormProps {
  back: string;
  user: User;
}

const AccountEmailForm = ({ back, user }: AccountEmailFormProps) => {
  const [state, action] = useFormState(
    updateAccount.bind(null, { next: back }),
    null,
  );

  return (
    <form action={action} className="divide-y divide-alpha-1">
      <div className="px-4 py-8 sm:px-8">
        <Input
          defaultValue={user.email}
          label="Email address"
          name="email"
          required
          type="email"
        />
      </div>
      {state?.error && (
        <div className="px-4 py-8 text-center sm:px-8">{state.error}</div>
      )}
      <div className="flex gap-4 px-4 py-8 sm:px-8">
        <Button className="w-full" colorScheme="transparent" href={back}>
          Close
        </Button>
        <Button className="w-full" loadingText="Saving…" type="submit">
          Save
        </Button>
      </div>
    </form>
  );
};

export default AccountEmailForm;
