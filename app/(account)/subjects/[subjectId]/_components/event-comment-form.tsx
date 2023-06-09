'use client';

import IconButton from '@/(account)/_components/icon-button';
import RichTextarea from '@/(account)/_components/rich-textarea';
import useSupabase from '@/(account)/_hooks/use-supabase';
import sanitizeHtml from '@/(account)/_utilities/sanitize-html';
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
  const supabase = useSupabase();
  const form = useForm({ defaultValues: { content: '' } });
  const router = useRouter();

  const onSubmit = form.handleSubmit(async ({ content }) => {
    startTransition(async () => {
      const { error } = await supabase
        .from('comments')
        .upsert({ content: sanitizeHtml(content) ?? '', event_id: eventId });

      if (error) alert(error.message);
      else router.refresh();
    });

    form.setValue('content', '');
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
