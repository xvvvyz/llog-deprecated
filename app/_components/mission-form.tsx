'use client';

import upsertMission from '@/_actions/upsert-mission';
import Button from '@/_components/button';
import Input from '@/_components/input';
import { GetMissionData } from '@/_queries/get-mission';
import { useFormState } from 'react-dom';

interface MissionFormProps {
  mission?: NonNullable<GetMissionData>;
  subjectId: string;
}

const MissionForm = ({ mission, subjectId }: MissionFormProps) => {
  const [state, action] = useFormState(
    upsertMission.bind(null, { missionId: mission?.id, subjectId }),
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
        <Button
          className="w-full"
          colorScheme="transparent"
          href={`/subjects/${subjectId}`}
        >
          Close
        </Button>
        <Button className="w-full" loadingText="Saving…" type="submit">
          {mission ? 'Save' : 'Continue'}
        </Button>
      </div>
    </form>
  );
};

export default MissionForm;
