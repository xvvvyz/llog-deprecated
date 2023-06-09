'use client';

import Button from '@/_components/button';
import Input from '@/_components/input';
import { useBoolean } from 'usehooks-ts';

interface ForgotPasswordFormProps {
  action: (values: FormData) => Promise<{ error?: string }>;
}

const ForgotPasswordForm = ({ action }: ForgotPasswordFormProps) => {
  const emailSent = useBoolean();

  return (
    <form
      action={async (values: FormData) => {
        const { error } = await action(values);
        if (error) alert(error);
        else emailSent.setTrue();
      }}
      className="flex flex-col gap-6"
    >
      <Input
        disabled={emailSent.value}
        label="Email address"
        name="email"
        type="email"
      />
      <Button
        className="mt-8 w-full"
        disabled={emailSent.value}
        loadingText="Sending link…"
        type="submit"
      >
        {emailSent.value ? (
          <>Link sent&mdash;check your email</>
        ) : (
          <>Send link</>
        )}
      </Button>
    </form>
  );
};

export default ForgotPasswordForm;
