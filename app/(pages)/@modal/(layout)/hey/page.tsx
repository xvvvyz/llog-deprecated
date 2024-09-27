import Button from '@/_components/button';
import * as Modal from '@/_components/modal';
import PageModalHeader from '@/_components/page-modal-header';
import getCurrentUser from '@/_queries/get-current-user';

const Page = async () => {
  const user = await getCurrentUser();
  if (!user) return;

  return (
    <Modal.Content className="select-text">
      <PageModalHeader
        closeHref="/subjects"
        title={`Hey, ${user.user_metadata.first_name}!`}
      />
      <div className="px-4 pb-8 sm:px-8">
        <div className="prose">
          <p>
            At llog, our mission is to empower behavior professionals and their
            clients by crafting intuitive and effective software tools that make
            lasting behavior change more&nbsp;attainable.
          </p>
          <p className="max-w-[25rem]">
            Your feedback is invaluable as we evolve and improve. Whether you
            have thoughts, ideas, concerns or even dreams, we&rsquo;d love to
            hear from you. Feel free to drop us a message at{' '}
            <Button href="mailto:hello@llog.app" variant="link">
              hello@llog.app
            </Button>{' '}
            or{' '}
            <Button href="https://cal.com/llogapp/chat" variant="link">
              schedule a call
            </Button>
            .
          </p>
          <p>Happy behavior hacking!</p>
          <p className="text-fg-4">~ Cade, Founder</p>
        </div>
        <Modal.Close asChild>
          <Button className="mt-8 w-full focus:ring-0" href="/subjects">
            I totally read all of that
          </Button>
        </Modal.Close>
      </div>
    </Modal.Content>
  );
};

export default Page;
