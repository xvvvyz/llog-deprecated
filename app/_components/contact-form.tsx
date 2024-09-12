'use client';

import Button from '@/_components/button';
import Input from '@/_components/input';
import InputRoot from '@/_components/input-root';
import * as Label from '@/_components/label';
import RichTextarea from '@/_components/rich-textarea';
import Select, { IOption } from '@/_components/select';
import newLead from '@/_mutations/new-lead';
import { Controller, useForm } from 'react-hook-form';

export interface ContactFormValues {
  comment: string;
  email: string;
  name: string;
  phone?: string;
  profession?: IOption;
  types: IOption[];
  website?: string;
}

const ContactForm = () => {
  const form = useForm<ContactFormValues>({
    defaultValues: {
      comment: '',
      email: '',
      name: '',
      phone: '',
      types: [],
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
        <Label.Root htmlFor="phone">Phone number</Label.Root>
        <Input type="tel" {...form.register('phone')} />
      </InputRoot>
      <InputRoot>
        <Label.Root htmlFor="website">Company website</Label.Root>
        <Input type="url" {...form.register('website')} />
      </InputRoot>
      <InputRoot>
        <Label.Root htmlFor="react-select-profession-input">
          Profession
        </Label.Root>
        <Controller
          control={form.control}
          name="profession"
          render={({ field }) => (
            <Select
              isClearable={false}
              isSearchable={false}
              options={[
                { id: 'trainer', label: 'Trainer' },
                { id: 'veterinarian', label: 'Veterinarian' },
                { id: 'other', label: 'Other' },
              ]}
              placeholder="Select one…"
              {...field}
            />
          )}
        />
      </InputRoot>
      <InputRoot>
        <Label.Root htmlFor="react-select-types-input">Profession</Label.Root>
        <Controller
          control={form.control}
          name="types"
          render={({ field }) => (
            <Select
              isClearable={false}
              isMulti
              isSearchable={false}
              // prettier-ignore
              options={[
                { id: 'separation-anxiety', label: 'Separation anxiety' },
                { id: 'resource-guarding', label: 'Resource guarding' },
                { id: 'dog-dog-aggression', label: 'Dog-dog aggression/reactivity' },
                { id: 'prey-drive-aggression', label: 'Prey drive aggression' },
                { id: 'pain-health', label: 'Pain/health' },
                { id: 'hyperactivity', label: 'Hyperactivity' },
                { id: 'human-directed-aggression', label: 'Human directed aggression' },
                { id: 'fear-anxiety', label: 'Fear/anxiety' },
                { id: 'sound-phobia-sensitivity', label: 'Sound phobia/sensitivity' },
                { id: 'other', label: 'Other' },
              ]}
              placeholder="Select all that apply…"
              {...field}
            />
          )}
        />
      </InputRoot>
      <InputRoot>
        <Label.Root htmlFor="comment">Additional notes</Label.Root>
        <Controller
          control={form.control}
          name="comment"
          render={({ field }) => (
            <RichTextarea placeholder="What else should we know?" {...field} />
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
