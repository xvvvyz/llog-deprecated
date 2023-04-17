'use client';

import IconButton from '(components)/icon-button';
import RichTextarea from '(components)/rich-textarea';
import supabase from '(utilities)/browser-supabase-client';
import sanitizeHtml from '(utilities)/sanitize-html';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
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
  const form = useForm({ defaultValues: { content: '' } });
  const router = useRouter();

  const onSubmit = form.handleSubmit(async ({ content }) => {
    const { error: commentError } = await supabase
      .from('comments')
      .upsert({ content: sanitizeHtml(content) ?? '', event_id: eventId });

    if (commentError) {
      alert(commentError.message);
      return;
    }

    form.setValue('content', '');
    startTransition(router.refresh);
  });

  return (
    <div className={className}>
      <Controller
        control={form.control}
        name="content"
        render={({ field }) => (
          <RichTextarea
            aria-label="Comment"
            className={twMerge('min-h-full pr-12', inputClassName)}
            onEnter={onSubmit}
            placeholder="Add comment…"
            right={
              <IconButton
                className="m-0 px-3 py-2.5"
                icon={<PaperAirplaneIcon className="w-5" />}
                label="Add comment"
                loading={form.formState.isSubmitting || isTransitioning}
                loadingText="Adding comment…"
                onClick={onSubmit}
              />
            }
            {...field}
          />
        )}
      />
    </div>
  );
};

export default EventCommentForm;
