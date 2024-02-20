'use client';

import updateAccount from '@/_actions/update-account';
import BackButton from '@/_components/back-button';
import Button from '@/_components/button';
import Input from '@/_components/input';
import { useSearchParams } from 'next/navigation';
import { useFormState } from 'react-dom';

const AccountPasswordForm = () => {
  const [state, action] = useFormState(
    updateAccount.bind(null, { next: useSearchParams().get('back') as string }),
    null,
  );

  return (
    <form action={action} className="divide-y divide-alpha-1">
      <div className="px-4 py-8 sm:px-8">
        <Input
          label="New password"
          minLength={6}
          name="password"
          placeholder="••••••••••••"
          type="password"
        />
      </div>
      {state?.error && (
        <div className="px-4 py-8 text-center sm:px-8">{state.error}</div>
      )}
      <div className="flex gap-4 px-4 py-8 sm:px-8">
        <BackButton className="w-full" colorScheme="transparent">
          Close
        </BackButton>
        <Button className="w-full" loadingText="Saving…" type="submit">
          Save
        </Button>
      </div>
    </form>
  );
};

export default AccountPasswordForm;
