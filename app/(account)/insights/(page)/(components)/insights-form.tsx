'use client';

import Chart from '(components)/chart';
import IconButton from '(components)/icon-button';
import Input from '(components)/input';
import Select from '(components)/select';
import forceArray from '(utilities)/force-array';
import { ListSubjectsData } from '(utilities)/list-subjects';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface InsightsFormProps {
  subjects?: ListSubjectsData;
}

type InsightsFormValues = {
  q?: string;
  subject?: { id: string };
};

const InsightsForm = ({ subjects }: InsightsFormProps) => {
  const form = useForm<InsightsFormValues>();
  const [queries, setQueries] = useState<{ a: string; q: string }[]>([]);
  const subject = form.watch('subject');

  useEffect(() => {
    if (!subject) return;
    setQueries([]);
    requestAnimationFrame(() => form.setFocus('q'));
  }, [form, subject]);

  return (
    <form
      className="mt-16 space-y-6"
      onSubmit={form.handleSubmit(async ({ q, subject }) => {
        if (!subject || !q) return;
        form.setValue('q', '');

        const res = await fetch(
          `/api/subjects/${subject.id}/ask?q=${encodeURIComponent(q)}`
        );

        const json = await res.json();

        if (res.ok) {
          setQueries((queries) => [{ a: json.message.content, q }, ...queries]);
        } else {
          form.setValue('q', q);
          alert(json.message);
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
            isDisabled={form.formState.isSubmitting}
            noOptionsMessage={() => 'No subjects'}
            options={forceArray(subjects)}
            placeholder="Select a subject…"
            {...field}
          />
        )}
      />
      {subject && (
        <Input
          placeholder="What do you need?"
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
      <div className="space-y-4">
        {queries.map(({ a, q }, i) => (
          <div
            className="whitespace-pre-line rounded border border-alpha-1 bg-bg-2 p-4"
            key={`${q}-${i}`}
          >
            <p>{q}</p>
            <div className="mt-8 space-y-10 text-fg-2">
              {a.split('```chart').map((part, j) => {
                try {
                  return <Chart key={`${i}-${j}`} {...JSON.parse(part)} />;
                } catch (e) {
                  return part.trim().replace('```', '') ? (
                    <ReactMarkdown
                      className="prose"
                      key={`${i}-${j}`}
                      remarkPlugins={[remarkGfm]}
                    >
                      {part}
                    </ReactMarkdown>
                  ) : null;
                }
              })}
            </div>
          </div>
        ))}
      </div>
    </form>
  );
};

export default InsightsForm;
