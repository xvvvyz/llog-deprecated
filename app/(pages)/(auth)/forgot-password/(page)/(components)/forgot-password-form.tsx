'use client';

import Button from '(components)/button';
import Input from '(components)/input';
import CacheKeys from '(utilities)/enum-cache-keys';
import globalValueCache from '(utilities)/global-value-cache';
import useSupabase from '(utilities)/use-supabase';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const ForgotPasswordForm = () => {
  const [linkSent, setLinkSent] = useState(false);
  const supabase = useSupabase();

  const form = useForm({
    defaultValues: {
      email: globalValueCache.get(CacheKeys.SignInForm)?.email,
    },
  });

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={form.handleSubmit(async ({ email }) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${location.origin}/change-password`,
        });

        if (error) alert(error.message);
        else setLinkSent(true);
      })}
    >
      <Input
        disabled={linkSent}
        label="Email address"
        type="email"
        {...form.register('email')}
      />
      <Button
        className="mt-8 w-full"
        disabled={linkSent}
        loading={form.formState.isSubmitting}
        loadingText="Sending link…"
        type="submit"
      >
        {linkSent ? <>Link sent&mdash;check your email</> : <>Send link</>}
      </Button>
    </form>
  );
};

export default ForgotPasswordForm;
