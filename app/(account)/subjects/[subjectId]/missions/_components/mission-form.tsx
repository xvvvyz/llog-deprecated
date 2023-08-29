'use client';

import Button from '@/_components/button';
import Input from '@/_components/input';
import useSubmitRedirect from '@/_hooks/use-submit-redirect';
import useSupabase from '@/_hooks/use-supabase';
import { GetMissionData } from '@/_server/get-mission';
import { Database } from '@/_types/database';
import { useForm } from 'react-hook-form';

interface MissionFormProps {
  mission?: GetMissionData;
  subjectId: string;
}

type MissionFormValues = Database['public']['Tables']['missions']['Insert'];

const MissionForm = ({ mission, subjectId }: MissionFormProps) => {
  const [redirect, isRedirecting] = useSubmitRedirect();
  const supabase = useSupabase();

  const form = useForm<MissionFormValues>({
    defaultValues: { id: mission?.id, name: mission?.name ?? '' },
  });

  return (
    <form
      className="form"
      onSubmit={form.handleSubmit(async (values) => {
        const { data: missionData, error: missionError } = await supabase
          .from('missions')
          .upsert({
            id: values.id,
            name: values.name.trim(),
            subject_id: subjectId,
          })
          .select('id')
          .single();

        if (missionError) {
          alert(missionError.message);
          return;
        }

        await redirect(
          `/subjects/${subjectId}/missions/${missionData.id}/sessions`,
        );
      })}
    >
      <Input label="Name" {...form.register('name')} />
      <Button
        className="mt-8 w-full"
        loading={form.formState.isSubmitting || isRedirecting}
        loadingText="Saving…"
        type="submit"
      >
        {mission ? 'Save name' : 'Continue to sessions'}
      </Button>
    </form>
  );
};

export default MissionForm;
