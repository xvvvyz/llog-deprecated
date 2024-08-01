import Avatar from '@/_components/avatar';
import Button from '@/_components/button';
import SubjectMenu from '@/_components/subject-menu';
import { ListSubjectsData } from '@/_queries/list-subjects';
import ArrowRightIcon from '@heroicons/react/24/outline/ArrowRightIcon';
import EllipsisVerticalIcon from '@heroicons/react/24/outline/EllipsisVerticalIcon';

interface SubjectListProps {
  canUnarchive?: boolean;
  clientSubjects: NonNullable<ListSubjectsData>;
  teamSubjects: NonNullable<ListSubjectsData>;
}

const SubjectList = async ({
  canUnarchive,
  clientSubjects,
  teamSubjects,
}: SubjectListProps) => (
  <>
    {!!teamSubjects.length && (
      <ul className="mx-4 overflow-hidden rounded border border-alpha-1 bg-bg-2 py-1">
        {teamSubjects.map((subject) => (
          <li
            className="flex items-stretch hover:bg-alpha-1 active:bg-alpha-1"
            key={subject.id}
          >
            <Button
              className="m-0 w-full gap-4 px-4 py-3 pr-0 leading-snug"
              href={`/subjects/${subject.id}`}
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
              canUnarchive={canUnarchive}
              contentClassName="-mt-12 mr-1.5"
              subject={subject}
            >
              <div className="group flex items-center justify-center px-2 text-fg-3 hover:text-fg-2 active:text-fg-2">
                <div className="rounded-full p-2 group-hover:bg-alpha-1 group-active:bg-alpha-1">
                  <EllipsisVerticalIcon className="w-5" />
                </div>
              </div>
            </SubjectMenu>
          </li>
        ))}
      </ul>
    )}
    {!!clientSubjects.length && (
      <ul className="mx-4 overflow-hidden rounded border border-alpha-1 bg-bg-2 py-1">
        {clientSubjects.map((subject) => (
          <li key={subject.id}>
            <Button
              className="m-0 w-full gap-6 px-4 py-3 leading-snug hover:bg-alpha-1 active:bg-alpha-1"
              href={`/subjects/${subject.id}`}
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

export default SubjectList;
