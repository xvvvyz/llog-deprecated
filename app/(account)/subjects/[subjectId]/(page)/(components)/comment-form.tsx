'use client';

import IconButton from '(components)/icon-button';
import RichTextarea from '(components)/rich-textarea';
import supabase from '(utilities)/browser-supabase-client';
import sanitizeHtml from '(utilities)/sanitize-html';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface CommentFormProps {
  eventId: string;
}

const CommentForm = ({ eventId }: CommentFormProps) => {
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
    startTransition(() => router.refresh());
  });

  return (
    <form className="relative" onSubmit={onSubmit}>
      <Controller
        control={form.control}
        name="content"
        render={({ field }) => (
          <RichTextarea
            aria-label="Comment"
            className="rounded-t-none border-x-0 border-b-0 border-alpha-1 pr-12 hover:border-alpha-1"
            onEnter={onSubmit}
            placeholder="Add comment"
            {...field}
          />
        )}
      />
      <div className="absolute right-[0.95rem] bottom-[0.65rem] flex flex h-5 w-5 items-center justify-center">
        <IconButton
          icon={<PaperAirplaneIcon className="w-5" />}
          label="Add comment"
          loading={form.formState.isSubmitting || isTransitioning}
          loadingText="Adding comment…"
        />
      </div>
    </form>
  );
};

export default CommentForm;
