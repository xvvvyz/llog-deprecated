'use client';

import Button from 'components/button';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import sleep from 'utilities/sleep';

interface RoutineFormProps {
  eventId?: string;
  eventTypeId: string;
  subjectId: string;
}

const RoutineForm = ({ eventId, eventTypeId, subjectId }: RoutineFormProps) => {
  const router = useRouter();
  const form = useForm({});

  return (
    <form
      onSubmit={form.handleSubmit(async () => {
        // todo

        await router.refresh();
        await sleep(1000);
      })}
    >
      <Button
        className="mt-12 w-full"
        colorScheme={eventId ? 'transparent' : 'accent'}
        loading={form.formState.isSubmitting}
        loadingText="Saving…"
        type="submit"
      >
        {eventId ? 'Save' : 'Complete'}
      </Button>
    </form>
  );
};

export default RoutineForm;
