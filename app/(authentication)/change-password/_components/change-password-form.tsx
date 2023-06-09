'use client';

import Button from '@/_components/button';
import Input from '@/_components/input';

interface SignInFormProps {
  action: (values: FormData) => Promise<{ error?: string }>;
}

const ChangePasswordForm = ({ action }: SignInFormProps) => (
  <form
    action={async (values: FormData) => {
      const { error } = await action(values);
      if (error) alert(error);
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

export default ChangePasswordForm;
