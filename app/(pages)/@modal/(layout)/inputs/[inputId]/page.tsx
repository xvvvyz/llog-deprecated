import Avatar from '@/_components/avatar';
import Button from '@/_components/button';
import InputForm from '@/_components/input-form';
import * as Modal from '@/_components/modal';
import PageModalHeader from '@/_components/page-modal-header';
import Tip from '@/_components/tip';
import listSubjectsByTeamId from '@/_queries/list-subjects-by-team-id';

import getInputWithUses, {
  GetInputWithUsesData,
} from '@/_queries/get-input-with-uses';

interface PageProps {
  params: {
    inputId: string;
  };
}

const Page = async ({ params: { inputId } }: PageProps) => {
  const [{ data: input }, { data: subjects }] = await Promise.all([
    getInputWithUses(inputId),
    listSubjectsByTeamId(),
  ]);

  if (!input || !subjects) return null;

  const usedBy =
    input?.uses?.reduce<
      Map<string, NonNullable<GetInputWithUsesData>['uses'][0]['subject']>
    >((acc, eventType) => {
      if (!eventType.subject) return acc;
      acc.set(eventType.subject.id, eventType.subject);
      return acc;
    }, new Map()) ?? new Map();

  return (
    <Modal.Content>
      <PageModalHeader title="Edit input" />
      {!!usedBy.size && (
        <div className="pb-6">
          <div className="flex items-start justify-between gap-4 border-y border-alpha-1 px-4 py-4 sm:px-8">
            <div className="smallcaps flex flex-wrap items-center gap-3">
              <div className="text-fg-4">
                {input.uses.length} use
                {input.uses.length === 1 ? '' : 's'} by
              </div>
              {Array.from(usedBy.values())
                .filter((subject) => !!subject)
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((subject) => (
                  <Button
                    className="m-0 mr-1 p-0"
                    href={`/subjects/${subject.id}`}
                    key={subject.id}
                    variant="link"
                  >
                    <Avatar
                      className="-my-[0.15rem] size-5"
                      file={subject.image_uri}
                      id={subject.id}
                    />
                    {subject.name}
                  </Button>
                ))}
            </div>
            <Tip className="-mr-1 -mt-3.5" side="left">
              When an input is added to an event type or training plan module it
              counts as one &ldquo;use&rdquo;. Template and insight uses are not
              counted.
            </Tip>
          </div>
        </div>
      )}
      <InputForm input={input} subjects={subjects} />
    </Modal.Content>
  );
};

export default Page;
