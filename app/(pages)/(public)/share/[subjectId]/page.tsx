import Button from '@/_components/button';
import SubjectPage from '@/_components/subject-page';
import getCurrentUserFromSession from '@/_queries/get-current-user-from-session';
import getPublicSubject from '@/_queries/get-public-subject';
import getSubject from '@/_queries/get-subject';
import ExclamationCircleIcon from '@heroicons/react/24/outline/ExclamationCircleIcon';

interface PageProps {
  params: { subjectId: string };
  searchParams: { to?: string };
}

export const generateMetadata = async ({
  params: { subjectId },
}: PageProps) => {
  const { data: subject } = await getPublicSubject(subjectId);
  return { title: subject?.name };
};

const Page = async ({
  params: { subjectId },
  searchParams: { to },
}: PageProps) => {
  const user = await getCurrentUserFromSession();
  const { data: subject } = await getSubject(subjectId);

  return (
    <>
      <div className="border-b border-alpha-2">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-4 p-4">
          {user ? (
            <>
              {subject ? (
                <>
                  <span className="flex items-center gap-2 text-sm text-fg-4">
                    <ExclamationCircleIcon className="w-5 shrink-0" />
                    Public read-only profile
                  </span>
                  <Button
                    className="text-sm"
                    href={`/subjects/${subjectId}`}
                    variant="link"
                  >
                    View full profile
                  </Button>
                </>
              ) : (
                <>
                  <Button className="text-sm" href="/subjects" variant="link">
                    Back to my subjects
                  </Button>
                  <span className="flex items-center gap-2 text-sm text-fg-4">
                    <ExclamationCircleIcon className="w-5 shrink-0" />
                    Public read-only profile
                  </span>
                </>
              )}
            </>
          ) : (
            <>
              <span className="text-sm leading-tight text-fg-4">
                Delight your clients with the ultimate
                <br />
                collaborative behavior tracking platform.
              </span>
              <Button href="/sign-up" size="sm">
                Sign up
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="mx-auto max-w-lg pb-20">
        <SubjectPage eventsTo={to} isPublic subjectId={subjectId} />
      </div>
    </>
  );
};
export default Page;
