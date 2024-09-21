'use client';

import Button from '@/_components/button';
import Input from '@/_components/input';
import InputRoot from '@/_components/input-root';
import * as Label from '@/_components/label';
import RichTextarea from '@/_components/rich-textarea';
import { IOption } from '@/_components/select';
import newLead from '@/_mutations/new-lead';
import { Controller, useForm } from 'react-hook-form';

export interface ContactFormValues {
  comment: string;
  email: string;
  name: string;
  profession?: IOption;
  website?: string;
}

const ContactForm = () => {
  const form = useForm<ContactFormValues>({
    defaultValues: {
      comment: '',
      email: '',
      name: '',
      website: '',
    },
  });

  return (
    <form
      className="flex flex-col gap-8"
      onSubmit={form.handleSubmit((values) => newLead(values))}
    >
      <InputRoot>
        <Label.Root htmlFor="name">Name</Label.Root>
        <Input required {...form.register('name')} />
      </InputRoot>
      <InputRoot>
        <Label.Root htmlFor="email">Email address</Label.Root>
        <Input required type="email" {...form.register('email')} />
      </InputRoot>
      <InputRoot>
        <Label.Root htmlFor="website">Company website</Label.Root>
        <Input type="url" {...form.register('website')} />
      </InputRoot>
      <InputRoot>
        <Label.Root htmlFor="profession">Profession</Label.Root>
        <Input required {...form.register('profession')} />
      </InputRoot>
      <InputRoot>
        <Label.Root htmlFor="comment">Primary behavior cases</Label.Root>
        <Controller
          control={form.control}
          name="comment"
          render={({ field }) => (
            <RichTextarea
              placeholder="What do you help clients with?"
              {...field}
            />
          )}
        />
      </InputRoot>
      {form.formState.errors.root && (
        <div className="text-center">{form.formState.errors.root.message}</div>
      )}
      {form.formState.isSubmitSuccessful ? (
        <p className="mt-8 text-center">
          Thank you for your interest in llog!
          <br />
          We will be in touch soon.
        </p>
      ) : (
        <Button
          className="mt-8"
          loading={form.formState.isSubmitting}
          loadingText="Requesting…"
          type="submit"
        >
          Request a demo
        </Button>
      )}
    </form>
  );
};

export default ContactForm;
