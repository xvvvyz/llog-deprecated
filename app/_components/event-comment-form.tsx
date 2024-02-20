'use client';

import addComment from '@/_actions/add-comment';
import IconButton from '@/_components/icon-button';
import RichTextarea from '@/_components/rich-textarea';
import PaperAirplaneIcon from '@heroicons/react/24/outline/PaperAirplaneIcon';
import { useEffect, useRef, useState } from 'react';
import { useFormState } from 'react-dom';
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
  const [value, setValue] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const pendingValue = useRef('');

  const [state, action] = useFormState(
    addComment.bind(null, { eventId }),
    null,
  );

  useEffect(() => {
    if (!state?.error) return;
    alert(state.error);
    setValue(pendingValue.current);
  }, [state]);

  return (
    <form
      action={() => {
        if (!value) return;
        pendingValue.current = value;
        setValue('');
        return action({ content: value });
      }}
      className={className}
      ref={formRef}
    >
      <RichTextarea
        aria-label="Comment"
        className={twMerge('min-h-full pr-12', inputClassName)}
        name="comment"
        onChange={(e) => setValue(e.target.value)}
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
            loadingText="Adding comment…"
            type="submit"
          />
        }
        value={value}
      />
    </form>
  );
};

export default EventCommentForm;
