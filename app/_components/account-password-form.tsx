'use client';

import Button from '@/_components/button';
import Input from '@/_components/input';
import PageModalBackButton from '@/_components/page-modal-back-button';
import createBrowserSupabaseClient from '@/_utilities/create-browser-supabase-client';
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
      className="flex flex-col gap-8 px-4 pb-8 pt-6 sm:px-8"
      onSubmit={form.handleSubmit((values) =>
        startTransition(async () => {
          const supabase = createBrowserSupabaseClient();

          const res = await supabase.auth.updateUser({
            password: values.password,
          });

          if (res?.error) {
            form.setError('root', {
              message: res.error.message,
              type: 'custom',
            });

            return;
          }

          router.back();
        }),
      )}
    >
      <Input
        label="New password"
        minLength={6}
        placeholder="••••••••••••"
        type="password"
        {...form.register('password')}
      />
      {form.formState.errors.root && (
        <div className="text-center">{form.formState.errors.root.message}</div>
      )}
      <div className="flex gap-4 pt-8">
        <PageModalBackButton className="w-full" colorScheme="transparent">
          Close
        </PageModalBackButton>
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

export default AccountPasswordForm;
