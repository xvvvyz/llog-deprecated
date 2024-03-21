'use client';

import BackButton from '@/_components/back-button';
import Button from '@/_components/button';
import FormBanner from '@/_components/form-banner';
import Input from '@/_components/input';
import useCachedForm from '@/_hooks/use-cached-form';
import { ListInputsBySubjectIdData } from '@/_queries/list-inputs-by-subject-id';
import getFormCacheKey from '@/_utilities/get-form-cache-key';
import { useTransition } from 'react';

interface InsightFormProps {
  availableInputs: NonNullable<ListInputsBySubjectIdData>;
  subjectId: string;
}

type InsightFormValues = {
  name: string;
};

const InsightForm = ({ subjectId }: InsightFormProps) => {
  const [isTransitioning, startTransition] = useTransition();
  const cacheKey = getFormCacheKey.insight({ id: undefined, subjectId });

  const form = useCachedForm<InsightFormValues>(cacheKey, {
    defaultValues: {
      name: '',
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit((values) =>
        startTransition(async () => {
          console.log(values);
          // const res = await upsertInsight(
          //   { insightId: insight?.id, subjectId },
          //   values,
          // );
          //
          // if (res?.error) {
          //   form.setError('root', { message: res.error, type: 'custom' });
          // }
          //
          // localStorage.setItem('refresh', '1');
          // router.back();
        }),
      )}
      className="divide-y divide-alpha-1"
    >
      <FormBanner<InsightFormValues> form={form} />
      <div className="flex flex-col gap-8 px-4 pb-8 pt-7 sm:px-8">
        <Input
          maxLength={49}
          placeholder="Name"
          required
          {...form.register('name')}
        />
      </div>
      {form.formState.errors.root && (
        <div className="px-4 py-8 text-center sm:px-8">
          {form.formState.errors.root.message}
        </div>
      )}
      <div className="flex justify-end gap-4 px-4 py-8 sm:px-8">
        <BackButton className="w-36" colorScheme="transparent" size="sm">
          Close
        </BackButton>
        <Button
          className="w-36"
          loading={isTransitioning}
          loadingText="Saving…"
          size="sm"
          type="submit"
        >
          Save
        </Button>
      </div>
    </form>
  );
};

export type { InsightFormValues };
export default InsightForm;
