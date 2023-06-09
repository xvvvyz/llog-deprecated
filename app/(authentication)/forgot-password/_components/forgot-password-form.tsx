'use client';

import Button from '@/_components/button';
import Input from '@/_components/input';

interface ForgotPasswordFormProps {
  action: (values: FormData) => Promise<{ error?: string }>;
}

const ForgotPasswordForm = ({ action }: ForgotPasswordFormProps) => (
  <form
    action={async (values: FormData) => {
      const { error } = await action(values);
      if (error) alert(error);
    }}
    className="flex flex-col gap-6"
  >
    <Input label="Email address" name="email" type="email" />
    <Button className="mt-8 w-full" loadingText="Sending link…" type="submit">
      Send reset link
    </Button>
  </form>
);

export default ForgotPasswordForm;
