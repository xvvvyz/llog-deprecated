import Button from '@/_components/button';
import * as Modal from '@/_components/modal';
import PageModalHeader from '@/_components/page-modal-header';
import getCurrentUser from '@/_queries/get-current-user';

const Page = async () => {
  const user = await getCurrentUser();
  if (!user) return;

  return (
    <Modal.Content className="select-text">
      <PageModalHeader title={`Hey, ${user.user_metadata.first_name}!`} />
      <div className="px-4 pb-8 sm:px-8">
        <div className="prose max-w-[26rem]">
          <p>
            At llog, our mission is to empower behavior professionals and their
            clients with tools that make lasting behavior change
            more&nbsp;attainable. Your feedback is invaluable as we evolve and
            improve. Whether you have thoughts, ideas, concerns or even dreams:{' '}
            <span className="whitespace-nowrap">
              <Button href="mailto:hello@llog.app" variant="link">
                email us
              </Button>{' '}
              or{' '}
              <Button href="https://cal.com/llogapp/chat" variant="link">
                book a call
              </Button>
              .
            </span>
          </p>
          <p>Happy behavior hacking!</p>
          <p className="text-fg-4">~ Cade, Founder</p>
        </div>
        <Modal.Close asChild>
          <Button className="mt-8 w-full focus:ring-0">Cool, cool</Button>
        </Modal.Close>
      </div>
    </Modal.Content>
  );
};

export default Page;
