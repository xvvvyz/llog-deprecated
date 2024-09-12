'use client';

import IconButton from '@/_components/icon-button';
import InputRoot from '@/_components/input-root';
import RichTextarea from '@/_components/rich-textarea';
import addComment from '@/_mutations/add-comment';
import PaperAirplaneIcon from '@heroicons/react/24/outline/PaperAirplaneIcon';
import { useRef, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface EventCommentFormProps {
  eventId: string;
}

const EventCommentForm = ({ eventId }: EventCommentFormProps) => {
  const [isTransitioning, startTransition] = useTransition();
  const form = useForm({ defaultValues: { comment: '' } });
  const formRef = useRef<HTMLFormElement>(null);
  const pendingValue = useRef('');

  return (
    <form
      onSubmit={form.handleSubmit((values) =>
        startTransition(async () => {
          if (!values.comment) return;
          pendingValue.current = values.comment;
          form.setValue('comment', '');

          const res = await addComment(
            { eventId },
            { content: values.comment },
          );

          if (res?.error) {
            alert(res.error);
            form.setValue('comment', pendingValue.current);
            return;
          }
        }),
      )}
      ref={formRef}
    >
      <InputRoot>
        <Controller
          control={form.control}
          name="comment"
          render={({ field }) => (
            <RichTextarea
              className="min-h-full pr-12"
              onEnter={(e) => {
                e.preventDefault();
                formRef.current?.requestSubmit();
              }}
              placeholder="Add comment…"
              {...field}
            />
          )}
        />
        <div className="absolute right-0 top-0 flex h-full w-10 flex-col items-center justify-start">
          <IconButton
            className="m-0 mt-px px-3 py-2.5"
            icon={<PaperAirplaneIcon className="w-5" />}
            label="Add comment"
            loading={isTransitioning}
            loadingText="Adding comment…"
            type="submit"
          />
        </div>
      </InputRoot>
    </form>
  );
};

export default EventCommentForm;
