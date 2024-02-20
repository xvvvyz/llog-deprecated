'use client';

import upsertMission from '@/_actions/upsert-mission';
import BackButton from '@/_components/back-button';
import Button from '@/_components/button';
import Input from '@/_components/input';
import { GetMissionData } from '@/_queries/get-mission';
import { useSearchParams } from 'next/navigation';
import { useFormState } from 'react-dom';

interface MissionFormProps {
  mission?: NonNullable<GetMissionData>;
  subjectId: string;
}

const MissionForm = ({ mission, subjectId }: MissionFormProps) => {
  const back = useSearchParams().get('back') as string;

  const [state, action] = useFormState(
    upsertMission.bind(null, {
      missionId: mission?.id,
      next: mission ? back : undefined,
      subjectId,
    }),
    null,
  );

  return (
    <form action={action} className="divide-y divide-alpha-1">
      <div className="px-4 py-8 sm:px-8">
        <Input
          defaultValue={mission?.name}
          label="Name"
          maxLength={49}
          name="name"
          required
        />
      </div>
      {state?.error && (
        <div className="px-4 py-8 text-center sm:px-8">{state.error}</div>
      )}
      <div className="flex gap-4 px-4 py-8 sm:px-8">
        <BackButton className="w-full" colorScheme="transparent">
          Close
        </BackButton>
        <Button className="w-full" loadingText="Saving…" type="submit">
          {mission ? 'Save' : 'Continue'}
        </Button>
      </div>
    </form>
  );
};

export default MissionForm;
