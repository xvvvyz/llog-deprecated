'use client';

import IconButton from '(components)/icon-button';
import Input from '(components)/input';
import Select from '(components)/select';
import forceArray from '(utilities)/force-array';
import { ListSubjectsData } from '(utilities)/list-subjects';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface InsightsFormProps {
  subjects?: ListSubjectsData;
}

type InsightsFormValues = {
  q?: string;
  subject?: { id: string };
};

const InsightsForm = ({ subjects }: InsightsFormProps) => {
  const form = useForm<InsightsFormValues>();
  const [response, setResponse] = useState<string | null>(null);
  const subject = form.watch('subject');

  return (
    <form
      className="mt-16 space-y-6"
      onSubmit={form.handleSubmit(async ({ q, subject }) => {
        if (!subject || !q) return;
        setResponse(null);

        try {
          const res = await fetch(
            `/api/subjects/${subject.id}/ask?q=${encodeURIComponent(q)}`
          );

          const json = await res.json();
          setResponse(json.message.content);
          form.setValue('q', '');
        } catch (e) {
          setResponse('Something went wrong.');
        }
      })}
    >
      <Controller
        control={form.control}
        name="subject"
        render={({ field }) => (
          <Select
            hasAvatar
            isClearable={false}
            noOptionsMessage={() => 'No subjects'}
            options={forceArray(subjects)}
            placeholder="Select a subject…"
            {...field}
          />
        )}
      />
      <div>
        {subject && (
          <Input
            className={response ? 'rounded-b-none' : ''}
            placeholder="What do you want to know?"
            right={
              <IconButton
                className="m-0 px-3 py-2.5"
                icon={<PaperAirplaneIcon className="w-5" />}
                label="Submit query"
                loading={form.formState.isSubmitting}
                loadingText="Submitting query…"
                type="submit"
              />
            }
            {...form.register('q')}
          />
        )}
        {response && (
          <p className="whitespace-pre-line rounded rounded-t-none border border-t-0 border-alpha-1 bg-bg-2 px-4 py-3">
            {response}
          </p>
        )}
      </div>
    </form>
  );
};

export default InsightsForm;
