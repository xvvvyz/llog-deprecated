import getCurrentUser from '@/(account)/_server/get-current-user';
import ChatForm from '@/(account)/subjects/[subjectId]/timeline/@insights/_components/chat-form';

interface PageProps {
  params: {
    subjectId: string;
  };
}

const Page = async ({ params: { subjectId } }: PageProps) => {
  const user = await getCurrentUser();
  if (!user) return null;
  return <ChatForm subjectId={subjectId} user={user} />;
};

export default Page;
