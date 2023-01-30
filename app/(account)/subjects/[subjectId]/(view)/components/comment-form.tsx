'use client';

import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import IconButton from 'components/icon-button';
import RichTextarea from 'components/rich-textarea';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import supabase from 'utilities/browser-supabase-client';
import sanitizeHtml from 'utilities/sanitize-html';

interface CommentFormProps {
  eventId: string;
}

const CommentForm = ({ eventId }: CommentFormProps) => {
  const router = useRouter();
  const form = useForm({ defaultValues: { content: '' } });

  const onSubmit = form.handleSubmit(async ({ content }) => {
    const { error: commentError } = await supabase
      .from('comments')
      .upsert({ content: sanitizeHtml(content) ?? '', event_id: eventId });

    if (commentError) {
      alert(commentError.message);
      return;
    }

    form.setValue('content', '');
    await router.refresh();
  });

  return (
    <form className="relative" onSubmit={onSubmit}>
      <Controller
        control={form.control}
        name="content"
        render={({ field }) => (
          <RichTextarea
            aria-label="Comment"
            className="rounded-t-none border-x-0 border-b-0 pr-12"
            name={field.name}
            onChange={field.onChange}
            onEnter={onSubmit}
            placeholder="Add comment"
            value={field.value}
          />
        )}
      />
      <div className="absolute right-[0.95rem] bottom-[0.65rem] flex flex h-5 w-5 items-center justify-center">
        <IconButton
          icon={<PaperAirplaneIcon className="w-5" />}
          label="Add comment"
          loading={form.formState.isSubmitting}
          loadingText="Adding comment…"
        />
      </div>
    </form>
  );
};

export default CommentForm;
