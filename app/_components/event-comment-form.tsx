'use client';

import addComment from '@/_actions/add-comment';
import IconButton from '@/_components/icon-button';
import RichTextarea from '@/_components/rich-textarea';
import PaperAirplaneIcon from '@heroicons/react/24/outline/PaperAirplaneIcon';
import { useRef, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

interface EventCommentFormProps {
  className?: string;
  eventId: string;
  inputClassName?: string;
}

const EventCommentForm = ({
  className,
  eventId,
  inputClassName,
}: EventCommentFormProps) => {
  const [isTransitioning, startTransition] = useTransition();
  const form = useForm({ defaultValues: { comment: '' } });
  const formRef = useRef<HTMLFormElement>(null);
  const pendingValue = useRef('');

  return (
    <form
      className={className}
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
      <Controller
        control={form.control}
        name="comment"
        render={({ field }) => (
          <RichTextarea
            aria-label="Comment"
            className={twMerge('min-h-full pr-12', inputClassName)}
            onEnter={(e) => {
              e.preventDefault();
              formRef.current?.requestSubmit();
            }}
            placeholder="Add comment…"
            right={
              <IconButton
                className="m-0 mt-px px-3 py-2.5"
                icon={<PaperAirplaneIcon className="w-5" />}
                label="Add comment"
                loading={isTransitioning}
                loadingText="Adding comment…"
                type="submit"
              />
            }
            {...field}
          />
        )}
      />
    </form>
  );
};

export default EventCommentForm;
