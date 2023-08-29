import EmailSent from '@/_components/email-sent';

export const metadata = {
  title: 'Forgot password',
};

const Page = () => <EmailSent>We sent you a password reset link.</EmailSent>;

export default Page;
