'use client';

import Button from '@/_components/button';
import Input from '@/_components/input';
import { useRouter } from 'next/navigation';

interface SignInFormProps {
  action: (values: FormData) => Promise<{ error?: string }>;
  actionRedirect: string;
}

const ChangePasswordForm = ({ action, actionRedirect }: SignInFormProps) => {
  const router = useRouter();

  return (
    <form
      action={async (values: FormData) => {
        const { error } = await action(values);
        if (error) alert(error);
        else router.push(actionRedirect);
      }}
      className="flex flex-col gap-6"
    >
      <Input label="New password" name="password" type="password" />
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
