'use client';

import updateAccount from '@/_actions/update-account';
import BackButton from '@/_components/back-button';
import Button from '@/_components/button';
import Input from '@/_components/input';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';

interface AccountPasswordFormValues {
  password: string;
}

const AccountPasswordForm = () => {
  const [isTransitioning, startTransition] = useTransition();

  const form = useForm<AccountPasswordFormValues>({
    defaultValues: { password: '' },
  });

  const router = useRouter();

  return (
    <form
      className="divide-y divide-alpha-1"
      onSubmit={form.handleSubmit((values) =>
        startTransition(async () => {
          const res = await updateAccount({ password: values.password });

          if (res?.error) {
            form.setError('root', { message: res.error, type: 'custom' });
            return;
          }

          router.back();
        }),
      )}
    >
      <div className="px-4 py-8 sm:px-8">
        <Input
          label="New password"
          minLength={6}
          placeholder="••••••••••••"
          type="password"
          {...form.register('password')}
        />
      </div>
      {form.formState.errors.root && (
        <div className="px-4 py-8 text-center sm:px-8">
          {form.formState.errors.root.message}
        </div>
      )}
      <div className="flex gap-4 px-4 py-8 sm:px-8">
        <BackButton className="w-full" colorScheme="transparent">
          Close
        </BackButton>
        <Button
          className="w-full"
          loading={isTransitioning}
          loadingText="Saving…"
          type="submit"
        >
          Save
        </Button>
      </div>
    </form>
  );
};

export type { AccountPasswordFormValues };
export default AccountPasswordForm;
