'use client';

import Button from '(components)/button';
import Input from '(components)/input';
import Label, { LabelSpan } from '(components)/label';
import supabase from '(utilities)/browser-supabase-client';
import CacheKeys from '(utilities)/enum-cache-keys';
import globalValueCache from '(utilities)/global-value-cache';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const ForgotPasswordForm = () => {
  const [linkSent, setLinkSent] = useState(false);

  const form = useForm({
    defaultValues: {
      email: globalValueCache.get(CacheKeys.SignInForm)?.email,
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit(async ({ email }) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${location.origin}/change-password`,
        });

        if (error) alert(error.message);
        else setLinkSent(true);
      })}
    >
      <Label className="mt-9">
        <LabelSpan>Email address</LabelSpan>
        <Input disabled={linkSent} type="email" {...form.register('email')} />
      </Label>
      <Button
        className="mt-12 w-full"
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
