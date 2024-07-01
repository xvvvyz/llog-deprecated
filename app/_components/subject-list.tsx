import Avatar from '@/_components/avatar';
import Button from '@/_components/button';
import Empty from '@/_components/empty';
import SubjectMenu from '@/_components/subject-menu';
import getCurrentUser from '@/_queries/get-current-user';
import listSubjects, { ListSubjectsData } from '@/_queries/list-subjects';
import ArrowRightIcon from '@heroicons/react/24/outline/ArrowRightIcon';
import EllipsisVerticalIcon from '@heroicons/react/24/outline/EllipsisVerticalIcon';
import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon';

interface SubjectListProps {
  archived?: boolean;
}

const SubjectList = async ({ archived = false }: SubjectListProps) => {
  const [{ data: subjects }, user] = await Promise.all([
    listSubjects({ archived }),
    getCurrentUser(),
  ]);

  if (!subjects) return null;

  const {
    clientSubjects,
    teamSubjects,
  }: {
    clientSubjects: NonNullable<ListSubjectsData>;
    teamSubjects: NonNullable<ListSubjectsData>;
  } = subjects.reduce(
    (acc, subject) => {
      if (!!user && subject.team_id === user.id) acc.teamSubjects.push(subject);
      else acc.clientSubjects.push(subject);
      return acc;
    },
    {
      clientSubjects: [] as NonNullable<ListSubjectsData>,
      teamSubjects: [] as NonNullable<ListSubjectsData>,
    },
  );

  return (
    <>
      {!subjects.length && !archived && (
        <Empty className="mx-4">
          <InformationCircleIcon className="w-7" />
          Subjects can be dogs, cats, humans or
          <br />
          anything else you want to track.
        </Empty>
      )}
      {!!teamSubjects.length && (
        <ul className="mx-4 rounded border border-alpha-1 bg-bg-2 py-1">
          {teamSubjects.map((subject) => (
            <li
              className="flex items-stretch hover:bg-alpha-1"
              key={subject.id}
            >
              <Button
                className="m-0 w-full gap-4 px-4 py-3 pr-0 leading-snug"
                href={`/subjects/${subject.id}/events`}
                variant="link"
              >
                <Avatar
                  className="-my-0.5"
                  file={subject.image_uri}
                  key={subject.id}
                  id={subject.id}
                  size="sm"
                />
                {subject.name}
              </Button>
              <SubjectMenu
                className="group flex h-full items-center justify-center px-2 text-fg-3 hover:text-fg-2"
                itemsClassName="mr-2 mt-2"
                subject={subject}
              >
                <div className="rounded-full p-2 group-hover:bg-alpha-1">
                  <EllipsisVerticalIcon className="w-5" />
                </div>
              </SubjectMenu>
            </li>
          ))}
        </ul>
      )}
      {!!clientSubjects.length && (
        <ul className="mx-4 rounded border border-alpha-1 bg-bg-2 py-1">
          {clientSubjects.map((subject) => (
            <li key={subject.id}>
              <Button
                className="m-0 w-full gap-6 px-4 py-3 leading-snug hover:bg-alpha-1"
                href={`/subjects/${subject.id}/events`}
                variant="link"
              >
                <Avatar
                  className="-my-0.5 -mr-2"
                  file={subject.image_uri}
                  id={subject.id}
                  size="sm"
                />
                {subject.name}
                <ArrowRightIcon className="ml-auto w-5 shrink-0" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default SubjectList;
