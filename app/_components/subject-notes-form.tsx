'use client';

import Button from '@/_components/button';
import * as Modal from '@/_components/modal';
import RichTextarea from '@/_components/rich-textarea';
import upsertSubjectNotes from '@/_mutations/upsert-subject-notes';
import { GetSubjectNotesData } from '@/_queries/get-subject-notes';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface SubjectNotesFormProps {
  subjectId: string;
  subjectNotes?: GetSubjectNotesData;
}

export interface SubjectNotesFormValues {
  content: string;
}

const SubjectNotesForm = ({
  subjectId,
  subjectNotes,
}: SubjectNotesFormProps) => {
  const [isTransitioning, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<SubjectNotesFormValues>({
    defaultValues: {
      content: subjectNotes?.content,
    },
  });

  return (
    <form
      className="flex flex-col gap-8 px-4 pb-8 pt-6 sm:px-8"
      onSubmit={form.handleSubmit((values) =>
        startTransition(async () => {
          const res = await upsertSubjectNotes(
            { subjectId },
            { content: values.content },
          );

          if (res.error) {
            form.setError('root', { message: res.error, type: 'custom' });
            return;
          }

          router.back();
        }),
      )}
    >
      <Controller
        control={form.control}
        name="content"
        render={({ field }) => <RichTextarea {...field} />}
      />
      {form.formState.errors.root && (
        <div className="text-center">{form.formState.errors.root.message}</div>
      )}
      <div className="flex gap-4 pt-8">
        <Modal.Close asChild>
          <Button className="w-full" colorScheme="transparent">
            Close
          </Button>
        </Modal.Close>
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

export default SubjectNotesForm;
