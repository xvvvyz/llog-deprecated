'use client';

import Button from '@/_components/button';
import Input from '@/_components/input';
import { useBoolean } from 'usehooks-ts';

interface ForgotPasswordFormProps {
  action: (values: FormData) => Promise<{ error?: string }>;
}

const ForgotPasswordForm = ({ action }: ForgotPasswordFormProps) => {
  const linkSent = useBoolean();

  return (
    <form
      action={async (values: FormData) => {
        const { error } = await action(values);
        if (error) alert(error);
        else linkSent.setTrue();
      }}
      className="flex flex-col gap-6"
    >
      <Input
        disabled={linkSent.value}
        label="Email address"
        name="email"
        type="email"
      />
      <Button
        className="mt-8 w-full"
        disabled={linkSent.value}
        loadingText="Sending link…"
        type="submit"
      >
        {linkSent.value ? (
          <>Link sent&mdash;check your email</>
        ) : (
          <>Send link</>
        )}
      </Button>
    </form>
  );
};

export default ForgotPasswordForm;
